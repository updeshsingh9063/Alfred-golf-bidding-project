import {
  BarChart3,
  Users,
  Ticket,
  Building2,
  HandCoins,
  TrendingUp,
} from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import { SidebarNav } from "../../components/shared/SidebarNav";
import { useAdminKPIs } from "../../lib/hooks";

const adminItems = [
  { label: "Overview", href: "/admin", icon: <BarChart3 size={16} /> },
  { label: "Users", href: "/admin/users", icon: <Users size={16} /> },
  { label: "Draws", href: "/admin/draws", icon: <Ticket size={16} /> },
  { label: "Charities", href: "/admin/charities", icon: <Building2 size={16} /> },
  { label: "Winners", href: "/admin/winners", icon: <HandCoins size={16} /> },
  { label: "Reports", href: "/admin/reports", icon: <BarChart3 size={16} /> },
];

const kpiColors = ["#1B4A47", "#C9A24B", "#1B4A47", "#C9A24B"];

export default function AdminOverview() {
  const { data, loading } = useAdminKPIs();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  const { totalUsers = 0, activeSubscribers = 0, totalDonated = 0, totalPrizes = 0 } = data || {};

  const kpis = [
    { label: "Total Subscribers", value: activeSubscribers.toLocaleString(), change: 0, trend: [{ value: 0 }, { value: activeSubscribers }] },
    { label: "Total Users", value: totalUsers.toLocaleString(), change: 0, trend: [{ value: 0 }, { value: totalUsers }] },
    { label: "Total Donated", value: `£${(totalDonated / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, change: 0, trend: [{ value: 0 }, { value: totalDonated }] },
    { label: "Prizes Awarded", value: `£${(totalPrizes / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, change: 0, trend: [{ value: 0 }, { value: totalPrizes }] }
  ];

  return (
    <div className="flex min-h-screen bg-bg">
      <SidebarNav
        items={adminItems}
        activePath="/admin"
        title="Admin"
        variant="admin"
      />

      <main className="flex-1 overflow-y-auto md:ml-64">
        <div className="mx-auto max-w-[1600px] px-6 py-8">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="font-display text-2xl font-semibold text-ink">
                Overview
              </h1>
              <p className="mt-1 text-sm text-ink-soft">
                Platform performance at a glance.
              </p>
            </div>
            <p className="text-xs text-ink-soft">
              Last updated: {new Date().toLocaleDateString("en-GB")}
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {kpis.map((kpi, i) => (
              <div
                key={kpi.label}
                className="rounded-xl border border-border bg-surface p-5"
              >
                <p className="text-xs font-medium uppercase tracking-wider text-ink-soft">
                  {kpi.label}
                </p>
                <div className="mt-2 flex items-end justify-between">
                  <div>
                    <p className="font-mono text-2xl font-bold text-ink">
                      {kpi.value}
                    </p>
                    <div className="mt-1 flex items-center gap-1">
                      <TrendingUp size={12} className={kpi.change > 0 ? "text-success" : "text-ink-soft"} />
                      <span
                        className={`text-xs font-medium ${
                          kpi.change > 0 ? "text-success" : "text-ink-soft"
                        }`}
                      >
                        {kpi.change > 0 ? "+" : ""}
                        {kpi.change}%
                      </span>
                    </div>
                  </div>
                  <div className="h-10 w-20">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={kpi.trend}>
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke={kpiColors[i]}
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-border bg-surface p-5">
              <h2 className="font-display text-base font-semibold text-ink">
                Recent activity
              </h2>
              <div className="mt-4 space-y-3">
                {[
                  { text: "Dashboard connected to live API", time: "Just now" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg bg-surface-sunken/30 px-4 py-3"
                  >
                    <p className="text-sm text-ink">{item.text}</p>
                    <span className="shrink-0 text-xs text-ink-soft">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface p-5">
              <h2 className="font-display text-base font-semibold text-ink">
                Quick stats
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  { label: "Total Users", value: totalUsers.toString() },
                  { label: "Active Subscribers", value: activeSubscribers.toString() },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-lg bg-surface-sunken/50 p-3 text-center"
                  >
                    <p className="font-mono text-xl font-bold text-ink">
                      {stat.value}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-soft">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
