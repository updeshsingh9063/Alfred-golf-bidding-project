import { useState } from "react";
import {
  BarChart3,
  Users,
  Ticket,
  Building2,
  HandCoins,
  Plus,
  Pencil,
  Trash2,
  X,
  Star,
} from "lucide-react";
import { SidebarNav } from "../../components/shared/SidebarNav";
import { AdminDataTable } from "../../components/shared/AdminDataTable";
import { useAdminCharities } from "../../lib/hooks";
import { fetchApi } from "../../lib/api";

const adminItems = [
  { label: "Overview", href: "/admin", icon: <BarChart3 size={16} /> },
  { label: "Users", href: "/admin/users", icon: <Users size={16} /> },
  { label: "Draws", href: "/admin/draws", icon: <Ticket size={16} /> },
  { label: "Charities", href: "/admin/charities", icon: <Building2 size={16} /> },
  { label: "Winners", href: "/admin/winners", icon: <HandCoins size={16} /> },
  { label: "Reports", href: "/admin/reports", icon: <BarChart3 size={16} /> },
];

export default function AdminCharities() {
  const { data, loading, refetch } = useAdminCharities();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    region: "",
    description: "",
  });

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  const charities = data?.charities?.map((c: any) => ({
    id: c._id,
    name: c.name,
    category: c.category || "General",
    region: c.region || "Global",
    description: c.description || "",
    totalRaised: c.totalRaised || 0,
    isSpotlight: c.isFeatured || false,
  })) || [];

  async function toggleSpotlight(id: string) {
    try {
      await fetchApi(`/admin/charities/${id}/feature`, { method: "PATCH" });
      refetch();
    } catch (e) {
      console.error(e);
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    try {
      await fetchApi(`/admin/charities`, {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          shortDescription: formData.description.slice(0, 80),
          category: formData.category,
          region: formData.region,
          imageUrl: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80"
        })
      });
      setFormData({ name: "", category: "", region: "", description: "" });
      setShowForm(false);
      refetch();
    } catch (e) {
      console.error(e);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this charity?")) return;
    try {
      await fetchApi(`/admin/charities/${id}`, { method: "DELETE" });
      refetch();
    } catch (e) {
      console.error(e);
    }
  }

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (row: any) => (
        <div className="flex items-center gap-2">
          {row.isSpotlight && <Star size={12} className="text-gold" />}
          <span className="font-medium text-ink">{row.name}</span>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (row: any) => (
        <span className="text-xs text-ink-soft">{row.category}</span>
      ),
    },
    {
      key: "region",
      label: "Region",
      render: (row: any) => (
        <span className="text-xs text-ink-soft">{row.region}</span>
      ),
    },
    {
      key: "totalRaised",
      label: "Total Raised",
      align: "right" as const,
      render: (row: any) => (
        <span className="font-mono text-sm font-medium text-ink">
          £{(row.totalRaised / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      key: "spotlight",
      label: "Spotlight",
      align: "center" as const,
      render: (row: any) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSpotlight(row.id);
          }}
          className={`relative h-5 w-9 rounded-full transition-colors ${
            row.isSpotlight ? "bg-gold" : "bg-surface-sunken"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
              row.isSpotlight ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </button>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (row: any) => (
        <div className="flex items-center justify-end gap-1">
          <button className="rounded p-1.5 text-ink-soft hover:bg-surface-sunken hover:text-ink">
            <Pencil size={13} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.id);
            }}
            className="rounded p-1.5 text-ink-soft hover:bg-rose-soft hover:text-rose"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen bg-bg">
      <SidebarNav
        items={adminItems}
        activePath="/admin/charities"
        title="Admin"
        variant="admin"
      />

      <main className="flex-1 overflow-y-auto md:ml-64">
        <div className="mx-auto max-w-[1600px] px-6 py-8">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="font-display text-2xl font-semibold text-ink">
                Charities
              </h1>
              <p className="mt-1 text-sm text-ink-soft">
                {charities.length} charities · {charities.filter((c: any) => c.isSpotlight).length} spotlighted
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-accent-deep px-4 py-2 text-sm font-medium text-white hover:bg-accent-deep-hov"
            >
              <Plus size={14} />
              Add charity
            </button>
          </div>

          {showForm && (
            <form
              onSubmit={handleAdd}
              className="mt-6 rounded-xl border border-border bg-surface p-5"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-ink">
                  New charity
                </h3>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-ink-soft hover:text-ink"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-ink-soft">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, name: e.target.value }))
                    }
                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-accent-deep"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-ink-soft">
                    Category
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, category: e.target.value }))
                    }
                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-accent-deep"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-ink-soft">
                    Region
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.region}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, region: e.target.value }))
                    }
                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-accent-deep"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-ink-soft">
                    Description
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        description: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-accent-deep"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-ink-soft hover:bg-surface-sunken"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-accent-deep px-4 py-2 text-sm font-medium text-white hover:bg-accent-deep-hov"
                >
                  Add charity
                </button>
              </div>
            </form>
          )}

          <div className="mt-6">
            <AdminDataTable columns={columns} data={charities as unknown as Record<string, unknown>[]} />
          </div>
        </div>
      </main>
    </div>
  );
}
