import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Target,
  Heart,
  Ticket,
  Trophy,
  Settings,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";
import { SidebarNav } from "../../components/shared/SidebarNav";
import { TicketCard } from "../../components/shared/TicketCard";
import { DrawCountdown } from "../../components/shared/DrawCountdown";
import { StatusPill } from "../../components/shared/StatusPill";
import { useDashboard, useDraws } from "../../lib/hooks";

const dashboardItems = [
  { label: "Overview", href: "/dashboard", icon: <LayoutDashboard size={16} /> },
  { label: "My Scores", href: "/dashboard/scores", icon: <Target size={16} /> },
  { label: "My Charity", href: "/dashboard/charity", icon: <Heart size={16} /> },
  { label: "Draws", href: "/dashboard/draws", icon: <Ticket size={16} /> },
  { label: "Winnings", href: "/dashboard/winnings", icon: <Trophy size={16} /> },
  { label: "Settings", href: "/dashboard/settings", icon: <Settings size={16} /> },
];

export default function DashboardHome() {
  const { data: dashboardData, loading: dashboardLoading } = useDashboard();
  const { data: drawsData, loading: drawsLoading } = useDraws();

  if (dashboardLoading || drawsLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (!dashboardData) {
    return <div className="flex min-h-screen items-center justify-center">Error loading dashboard</div>;
  }

  const { user, scores, subscription, winnings } = dashboardData;
  const currentDraw = drawsData?.draws?.find((d: any) => d.status === "upcoming");
  const charity = user.charityId;
  
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const currentMonthScores = scores.filter((s: any) => s.date.startsWith(currentMonth));
  
  const pendingWin = winnings.recent.find((r: any) => r.status === "pending" && r.prize > 0);
  const paidWins = winnings.recent.filter((r: any) => r.status === "paid" && r.prize > 0);
  const totalDonated = ((subscription?.amount || 0) * (user.charityPercent || 0) / 100) * 7; // Mock 7 months

  return (
    <div className="flex min-h-screen bg-bg">
      <SidebarNav
        items={dashboardItems}
        activePath="/dashboard"
        title="Fairway"
        variant="dashboard"
      />

      <main className="flex-1 overflow-y-auto md:ml-64">
        <div className="mx-auto max-w-[1400px] px-6 py-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-display text-2xl font-semibold text-ink">
                Welcome back, {user.firstName}
              </h1>
              <p className="mt-1 text-sm text-ink-soft">
                Here's your activity at a glance.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <StatusPill status={subscription?.status === 'active' ? 'Active' : 'Inactive'} variant={subscription?.status === 'active' ? 'success' : 'default'} />
              {subscription?.renewalDate && (
                <span className="text-xs text-ink-soft">
                  Renews {new Date(subscription.renewalDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              )}
            </div>
          </div>

          {pendingWin && (
            <div className="mt-6 rounded-xl border border-gold bg-gold-soft/30 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/20">
                  <Trophy size={20} className="text-gold" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gold">Pending Winnings</p>
                  <p className="mt-0.5 font-display text-2xl font-bold text-ink">
                    £{(pendingWin.prize / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                  <p className="mt-1 text-xs text-ink-soft">
                    {pendingWin.drawName} — {pendingWin.userNumbers.length} matches (Tier {pendingWin.tier})
                  </p>
                  <Link
                    to="/dashboard/winnings"
                    className="mt-2 inline-block text-xs font-medium text-accent-deep hover:underline"
                  >
                    View details →
                  </Link>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <section className="rounded-xl border border-border bg-surface p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-base font-semibold">Your numbers this month</h2>
                {currentDraw && <DrawCountdown targetDate={currentDraw.scheduledDate} />}
              </div>
              <div className="mt-4">
                <TicketCard
                  scores={currentMonthScores.map((s: any) => s.score)}
                  status="active"
                  title={currentDraw ? currentDraw.name : "No upcoming draw"}
                  subtitle={`${currentMonthScores.length} scores logged`}
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {currentMonthScores.map((s: any) => (
                  <div key={s._id} className="rounded-lg bg-surface-sunken px-3 py-1.5">
                    <span className="font-mono text-sm font-bold text-ink">{s.score}</span>
                    <span className="ml-1.5 text-xs text-ink-soft">{s.course}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-border bg-surface p-5">
              <h2 className="font-display text-base font-semibold">Your charity</h2>
              {charity ? (
                <>
                  <div className="mt-4 flex items-center gap-4">
                    {charity.logoUrl && (
                      <img
                        src={charity.logoUrl}
                        alt={charity.name}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-ink">{charity.name}</p>
                      <p className="text-xs text-ink-soft line-clamp-2">{charity.description}</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-accent-deep/5 p-3">
                      <p className="text-xs text-ink-soft">Contribution</p>
                      <p className="font-mono text-lg font-bold text-accent-deep">
                        {user.charityPercent}%
                      </p>
                      <p className="text-xs text-ink-soft">£{(((subscription?.amount || 0) * (user.charityPercent || 0)) / 100 / 100).toFixed(2)}/mo</p>
                    </div>
                    <div className="rounded-lg bg-success/5 p-3">
                      <p className="text-xs text-ink-soft">Total donated</p>
                      <p className="font-mono text-lg font-bold text-success">
                        £{(totalDonated / 100).toFixed(0)}
                      </p>
                      <p className="text-xs text-ink-soft">Since joining</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="mt-4 text-sm text-ink-soft">No charity selected yet.</div>
              )}
              <Link
                to="/dashboard/charity"
                className="mt-4 block text-center text-xs font-medium text-accent-deep hover:underline"
              >
                Adjust contribution →
              </Link>
            </section>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <section className="rounded-xl border border-border bg-surface p-5">
              <h2 className="font-display text-base font-semibold">Participation</h2>
              <div className="mt-4 space-y-3">
                {[
                  { label: "Draws entered", value: winnings.recent.length, icon: Ticket },
                  { label: "Scores logged", value: scores.length, icon: Target },
                  { label: "Months active", value: "Active", icon: Clock },
                  { label: "Current streak", value: "Current", icon: TrendingUp },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <stat.icon size={14} className="text-ink-soft" />
                      <span className="text-sm text-ink-soft">{stat.label}</span>
                    </div>
                    <span className="font-mono text-sm font-semibold text-ink">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-border bg-surface p-5">
              <h2 className="font-display text-base font-semibold">Winnings</h2>
              <div className="mt-4 space-y-3">
                {winnings.recent.map((r: any) => (
                  <div
                    key={r._id}
                    className="flex items-center justify-between rounded-lg bg-surface-sunken/50 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-ink">{r.drawName}</p>
                      <p className="text-xs text-ink-soft">
                        {r.userNumbers?.length || 0} matches
                        {r.tier ? ` — Tier ${r.tier}` : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      {r.prize > 0 ? (
                        <p className="font-mono text-sm font-bold text-gold">
                          £{(r.prize / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                      ) : (
                        <p className="text-xs text-ink-soft">No prize</p>
                      )}
                      <StatusPill
                        status={r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                        variant={
                          r.status === "paid"
                            ? "success"
                            : r.status === "approved"
                              ? "warning"
                              : "default"
                        }
                      />
                    </div>
                  </div>
                ))}
                {winnings.recent.length === 0 && (
                  <p className="text-sm text-ink-soft text-center py-4">No winnings yet.</p>
                )}
                {winnings.totalWon > 0 && (
                  <div className="rounded-lg border border-gold/30 bg-gold-soft/20 p-3 text-center">
                    <CheckCircle2 size={16} className="mx-auto text-gold" />
                    <p className="mt-1 text-xs font-medium text-ink">
                      Total lifetime winnings: <span className="font-mono font-bold text-gold">£{(winnings.totalWon / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
