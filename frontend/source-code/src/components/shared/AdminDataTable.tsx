import { useState, useMemo, type ReactNode } from "react";
import { Search, ChevronUp, ChevronDown } from "lucide-react";

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  render?: (row: any) => ReactNode;
}

interface AdminDataTableProps {
  columns: Column[];
  data: Record<string, unknown>[];
  searchable?: boolean;
  paginated?: boolean;
  onRowClick?: (row: Record<string, unknown>) => void;
}

const PAGE_SIZE = 20;

export function AdminDataTable({
  columns,
  data,
  searchable = true,
  paginated = true,
  onRowClick,
}: AdminDataTableProps) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((row) =>
      columns.some((c) => String(row[c.key] ?? "").toLowerCase().includes(q)),
    );
  }, [data, search, columns]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av == null) return 1;
      if (bv == null) return -1;
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = paginated ? Math.max(1, Math.ceil(sorted.length / PAGE_SIZE)) : 1;
  const safePage = Math.min(page, totalPages - 1);
  const rows = paginated
    ? sorted.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE)
    : sorted;

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {searchable && (
        <div className="relative max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-soft" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className="w-full rounded-lg border border-border bg-surface py-2 pr-3 pl-9 text-sm text-ink placeholder:text-ink-soft/50 focus:outline-none"
          />
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-sunken">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`whitespace-nowrap px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-ink-soft ${col.sortable ? "cursor-pointer select-none hover:text-ink" : ""} ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : ""}`}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      sortDir === "asc"
                        ? <ChevronUp className="h-3 w-3" />
                        : <ChevronDown className="h-3 w-3" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-sm text-ink-soft"
                >
                  No results found.
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr
                  key={i}
                  className={`border-b border-border last:border-b-0 transition-colors hover:bg-surface-sunken/50 ${onRowClick ? "cursor-pointer" : ""}`}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`whitespace-nowrap px-4 py-2.5 text-ink ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : ""}`}
                    >
                      {col.render ? col.render(row) : String(row[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {paginated && totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-ink-soft">
          <span>
            {safePage * PAGE_SIZE + 1}–{Math.min((safePage + 1) * PAGE_SIZE, sorted.length)} of{" "}
            {sorted.length}
          </span>
          <div className="flex gap-1">
            <button
              disabled={safePage === 0}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-md border border-border px-2.5 py-1 text-xs font-medium transition-colors hover:bg-surface-sunken disabled:opacity-40"
            >
              Prev
            </button>
            <button
              disabled={safePage >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-md border border-border px-2.5 py-1 text-xs font-medium transition-colors hover:bg-surface-sunken disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
