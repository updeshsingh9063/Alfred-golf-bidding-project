import { useState } from "react";
import {
  BarChart3,
  Users,
  Ticket,
  Building2,
  HandCoins,
  Search,
  X,
  Pencil,
  Check,
} from "lucide-react";
import { SidebarNav } from "../../components/shared/SidebarNav";
import { AdminDataTable } from "../../components/shared/AdminDataTable";
import { StatusPill } from "../../components/shared/StatusPill";
import { useAdminUsers } from "../../lib/hooks";

const adminItems = [
  { label: "Overview", href: "/admin", icon: <BarChart3 size={16} /> },
  { label: "Users", href: "/admin/users", icon: <Users size={16} /> },
  { label: "Draws", href: "/admin/draws", icon: <Ticket size={16} /> },
  { label: "Charities", href: "/admin/charities", icon: <Building2 size={16} /> },
  { label: "Winners", href: "/admin/winners", icon: <HandCoins size={16} /> },
  { label: "Reports", href: "/admin/reports", icon: <BarChart3 size={16} /> },
];

const statusVariant: Record<string, "success" | "danger" | "default"> = {
  active: "success",
  cancelled: "danger",
  inactive: "default",
};

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingScores, setEditingScores] = useState(false);
  const [scoreValues, setScoreValues] = useState<string[]>([]);
  const { data, loading } = useAdminUsers(1, 100);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  const users = data?.users || [];

  const filtered = users.filter(
    (u: any) =>
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  ).map((u: any) => ({
    id: u._id,
    name: `${u.firstName} ${u.lastName}`,
    email: u.email,
    plan: u.subscription?.plan || 'none',
    status: u.subscription?.status || 'inactive',
    joined: u.createdAt,
    scores: u.scoresCount || 0,
    charity: u.charityId?.name || 'None selected',
  }));

  const selectedUser = selectedId
    ? filtered.find((u: any) => u.id === selectedId)
    : null;

  function startEditScores() {
    setEditingScores(true);
    setScoreValues(Array(5).fill(""));
  }

  function saveScores() {
    setEditingScores(false);
    setScoreValues([]);
  }

  function handleStatusChange(newStatus: string) {
    // Mock status change
    console.log("Status changed to:", newStatus);
  }

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (row: any) => (
        <span className="font-medium text-ink">{row.name}</span>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (row: any) => (
        <span className="text-ink-soft">{row.email}</span>
      ),
    },
    {
      key: "plan",
      label: "Plan",
      render: (row: any) => (
        <span className="text-xs font-medium capitalize text-ink">
          {row.plan}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: any) => (
        <StatusPill
          status={row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          variant={statusVariant[row.status] || "default"}
        />
      ),
    },
    {
      key: "joined",
      label: "Joined",
      render: (row: any) => (
        <span className="font-mono text-xs text-ink-soft">
          {new Date(row.joined).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "scores",
      label: "Scores",
      align: "center" as const,
      render: (row: any) => (
        <span className="font-mono text-sm font-medium text-ink">
          {row.scores}
        </span>
      ),
    },
    {
      key: "charity",
      label: "Charity",
      render: (row: any) => (
        <span className="text-xs text-ink-soft">{row.charity}</span>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen bg-bg">
      <SidebarNav
        items={adminItems}
        activePath="/admin/users"
        title="Admin"
        variant="admin"
      />

      <main className="flex-1 overflow-y-auto md:ml-64">
        <div className="mx-auto max-w-[1600px] px-6 py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-display text-2xl font-semibold text-ink">
                Users
              </h1>
              <p className="mt-1 text-sm text-ink-soft">
                {filtered.length} total users · {filtered.filter((u: any) => u.status === "active").length} active
              </p>
            </div>
            <div className="relative w-full sm:w-auto">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft"
              />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-64 rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm text-ink outline-none focus:border-accent-deep"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-6">
            <div className="flex-1">
              <AdminDataTable
                columns={columns}
                data={filtered}
                onRowClick={(row) => {
                  const id = row.id as string;
                  setSelectedId(selectedId === id ? null : id);
                }}
              />
            </div>

            {selectedUser && (
              <div className="hidden w-80 shrink-0 rounded-xl border border-border bg-surface p-5 lg:block">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-sm font-semibold text-ink">
                    User details
                  </h3>
                  <button
                    onClick={() => {
                      setSelectedId(null);
                      setEditingScores(false);
                    }}
                    className="text-ink-soft hover:text-ink"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-xs text-ink-soft">Name</p>
                    <p className="text-sm font-medium text-ink">
                      {selectedUser.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-ink-soft">Email</p>
                    <p className="text-sm text-ink">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-ink-soft">Plan</p>
                    <p className="text-sm capitalize text-ink">
                      {selectedUser.plan}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-ink-soft">Status</p>
                    <div className="mt-1 flex items-center gap-2">
                      <StatusPill
                        status={
                          selectedUser.status.charAt(0).toUpperCase() +
                          selectedUser.status.slice(1)
                        }
                        variant={
                          statusVariant[selectedUser.status] || "default"
                        }
                      />
                      <select
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="rounded border border-border bg-bg px-2 py-1 text-xs text-ink"
                        value={selectedUser.status}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Golf Scores Section */}
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-ink-soft">Golf Scores</p>
                      {!editingScores && (
                        <button
                          onClick={startEditScores}
                          className="text-xs text-accent-deep hover:text-accent-deep-hov"
                        >
                          <Pencil size={12} className="inline" /> Edit
                        </button>
                      )}
                    </div>
                    {editingScores ? (
                      <div className="mt-2 space-y-2">
                        {scoreValues.map((val, idx) => (
                          <input
                            key={idx}
                            type="number"
                            min={1}
                            max={45}
                            value={val}
                            onChange={(e) => {
                              const newVals = [...scoreValues];
                              newVals[idx] = e.target.value;
                              setScoreValues(newVals);
                            }}
                            placeholder={`Score ${idx + 1} (1-45)`}
                            className="w-full rounded border border-border bg-bg px-2 py-1 font-mono text-sm text-ink"
                          />
                        ))}
                        <div className="flex gap-2">
                          <button
                            onClick={saveScores}
                            className="flex-1 rounded bg-accent-deep px-2 py-1 text-xs font-medium text-white hover:bg-accent-deep-hov"
                          >
                            <Check size={12} className="inline" /> Save
                          </button>
                          <button
                            onClick={() => setEditingScores(false)}
                            className="flex-1 rounded border border-border px-2 py-1 text-xs font-medium text-ink-soft hover:bg-surface-sunken"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="font-mono text-sm font-bold text-ink">
                        {selectedUser.scores} logged
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-xs text-ink-soft">Charity</p>
                    <p className="text-sm text-ink">{selectedUser.charity}</p>
                  </div>
                  <div>
                    <p className="text-xs text-ink-soft">Joined</p>
                    <p className="font-mono text-xs text-ink">
                      {new Date(selectedUser.joined).toLocaleDateString(
                        "en-GB",
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
