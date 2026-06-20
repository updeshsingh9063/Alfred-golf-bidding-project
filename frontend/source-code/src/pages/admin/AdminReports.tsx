import {
  BarChart3,
  Users,
  Ticket,
  Building2,
  HandCoins,
  Download,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { SidebarNav } from "../../components/shared/SidebarNav";
import { useAdminKPIs, useCharities } from "../../lib/hooks";

const adminItems = [
  { label: "Overview", href: "/admin", icon: <BarChart3 size={16} /> },
  { label: "Users", href: "/admin/users", icon: <Users size={16} /> },
  { label: "Draws", href: "/admin/draws", icon: <Ticket size={16} /> },
  { label: "Charities", href: "/admin/charities", icon: <Building2 size={16} /> },
  { label: "Winners", href: "/admin/winners", icon: <HandCoins size={16} /> },
  { label: "Reports", href: "/admin/reports", icon: <BarChart3 size={16} /> },
];

export default function AdminReports() {
  const { data: kpiData, loading: kpiLoading } = useAdminKPIs();
  const { data: charitiesData, loading: charitiesLoading } = useCharities();

  if (kpiLoading || charitiesLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  const { overview, monthlyGrowth } = kpiData || {};

  // Derive subscriber growth from actual KPIs if available
  const subscriberGrowth = monthlyGrowth?.map((g: any) => ({
    month: `${g._id.year}-${String(g._id.month).padStart(2, '0')}`,
    subscribers: g.count,
  })) || [];

  // Currently backend doesn't supply monthly prize pool history
  const monthlyPrizePool: any[] = [];

  // Derive category totals from charities
  const charities: any[] = charitiesData?.charities || [];
  const categoryTotals = charities.reduce(
    (acc: Record<string, number>, c: any) => {
      const category = c.category || "General";
      const raised = c.totalRaised || 0;
      acc[category] = (acc[category] || 0) + raised;
      return acc;
    },
    {} as Record<string, number>,
  );

  const charityDistribution = Object.entries(categoryTotals).map(
    ([category, amount]) => ({ category, amount: (amount as number) / 100 }), // convert to pounds
  );

  const dynamicSummary = overview ? [
    { metric: "Total Subscribers", value: overview.activeSubscribers, change: "-" },
    { metric: "Current Prize Pool", value: `£${(overview.currentPrizePool / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, change: "-" },
    { metric: "Charity Disbursed", value: `£${(overview.charityContributed / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, change: "-" },
    { metric: "Total Paid Out", value: `£${(overview.totalPaidOut / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, change: "-" },
    { metric: "Total Draws", value: overview.totalDraws, change: "-" },
    { metric: "Total Winners", value: overview.totalWinners, change: "-" },
  ] : [];

  return (
    <div className="flex min-h-screen bg-bg">
      <SidebarNav
        items={adminItems}
        activePath="/admin/reports"
        title="Admin"
        variant="admin"
      />

      <main className="flex-1 overflow-y-auto md:ml-64">
        <div className="mx-auto max-w-[1600px] px-6 py-8">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="font-display text-2xl font-semibold text-ink">
                Reports
              </h1>
              <p className="mt-1 text-sm text-ink-soft">
                Platform analytics and performance data.
              </p>
            </div>
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-ink hover:bg-surface-sunken">
              <Download size={14} />
              Export
            </button>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-border bg-surface p-5">
              <h2 className="font-display text-base font-semibold text-ink">
                Subscriber growth
              </h2>
              <div className="mt-4 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={subscriberGrowth}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#E5DFD3"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: "#5B5A54" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#5B5A54" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#fff",
                        border: "1px solid #E5DFD3",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="subscribers"
                      stroke="#1B4A47"
                      strokeWidth={2.5}
                      dot={{ fill: "#1B4A47", r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface p-5">
              <h2 className="font-display text-base font-semibold text-ink">
                Monthly prize pool
              </h2>
              <div className="mt-4 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyPrizePool}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#E5DFD3"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: "#5B5A54" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#5B5A54" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#fff",
                        border: "1px solid #E5DFD3",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                      formatter={(value) => [
                        `£${Number(value).toLocaleString()}`,
                        "Prize Pool",
                      ]}
                    />
                    <Bar
                      dataKey="pool"
                      fill="#C9A24B"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-border bg-surface p-5">
            <h2 className="font-display text-base font-semibold text-ink">
              Charity distribution by category
            </h2>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charityDistribution}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E5DFD3"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="category"
                    tick={{ fontSize: 11, fill: "#5B5A54" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#5B5A54" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#fff",
                      border: "1px solid #E5DFD3",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    formatter={(value) => [
                        `£${Number(value).toLocaleString()}`,
                        "Total Raised",
                      ]}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#1B4A47"
                    fill="#1B4A47"
                    fillOpacity={0.15}
                    strokeWidth={2}
                    name="Total Raised"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-display text-base font-semibold text-ink">
                Summary
              </h2>
              <button className="inline-flex items-center gap-1 text-xs font-medium text-accent-deep hover:underline">
                <Download size={12} />
                Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-sunken/50">
                    <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-ink-soft">
                      Metric
                    </th>
                    <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-ink-soft">
                      Value
                    </th>
                    <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-ink-soft">
                      Change
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dynamicSummary.map((row) => (
                    <tr
                      key={row.metric}
                      className="border-b border-border/50 last:border-0"
                    >
                      <td className="px-5 py-3 text-sm text-ink">
                        {row.metric}
                      </td>
                      <td className="px-5 py-3 font-mono text-sm font-semibold text-ink">
                        {row.value}
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-xs font-medium text-ink-soft">
                          {row.change}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
