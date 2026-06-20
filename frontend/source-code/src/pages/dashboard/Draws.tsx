import {
  LayoutDashboard,
  Target,
  Heart,
  Ticket,
  Trophy,
  Settings,
} from "lucide-react";
import { SidebarNav } from "../../components/shared/SidebarNav";
import { DrawCountdown } from "../../components/shared/DrawCountdown";
import { NumberRevealAnimation } from "../../components/shared/NumberRevealAnimation";
import { StatusPill } from "../../components/shared/StatusPill";
import { useDraws, useDashboard } from "../../lib/hooks";

const dashboardItems = [
  { label: "Overview", href: "/dashboard", icon: <LayoutDashboard size={16} /> },
  { label: "My Scores", href: "/dashboard/scores", icon: <Target size={16} /> },
  { label: "My Charity", href: "/dashboard/charity", icon: <Heart size={16} /> },
  { label: "Draws", href: "/dashboard/draws", icon: <Ticket size={16} /> },
  { label: "Winnings", href: "/dashboard/winnings", icon: <Trophy size={16} /> },
  { label: "Settings", href: "/dashboard/settings", icon: <Settings size={16} /> },
];

export default function Draws() {
  const { data: drawsData, loading: drawsLoading } = useDraws();
  const { data: dashboardData, loading: dashboardLoading } = useDashboard();

  if (drawsLoading || dashboardLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  const draws = drawsData?.draws || [];
  const currentDraw = draws.find((d: any) => d.status === "upcoming" || d.status === "active");
  const pastDraws = draws.filter((d: any) => d.status === "completed");
  
  const currentMonthScores = dashboardData?.scores
    ? dashboardData.scores
        .filter((s: any) => s.date.startsWith(new Date().toISOString().slice(0, 7)))
        .map((s: any) => s.score)
    : [];

  const winnings = dashboardData?.winnings?.recent || [];

  return (
    <div className="flex min-h-screen bg-bg">
      <SidebarNav
        items={dashboardItems}
        activePath="/dashboard/draws"
        title="Fairway"
        variant="dashboard"
      />

      <main className="flex-1 overflow-y-auto md:ml-64">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <h1 className="font-display text-2xl font-semibold text-ink">Draws</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Your current and past draw entries.
          </p>

          {currentDraw ? (
            <div className="mt-6 rounded-xl border border-border bg-surface p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-accent-deep">
                    Current Draw
                  </p>
                  <h2 className="mt-1 font-display text-xl font-semibold text-ink">
                    {currentDraw.name}
                  </h2>
                  <p className="mt-1 text-sm text-ink-soft">
                    Prize pool:{" "}
                    <span className="font-mono font-bold text-ink">
                      £{(currentDraw.prizePool / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </p>
                </div>
                <DrawCountdown targetDate={currentDraw.scheduledDate} />
              </div>

              <div className="mt-6">
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-ink-soft">
                  Your numbers
                </p>
                <NumberRevealAnimation numbers={currentMonthScores} />
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-border bg-surface p-6">
              <p className="text-sm text-ink-soft">No upcoming draws at the moment.</p>
            </div>
          )}

          <div className="mt-8">
            <h2 className="font-display text-lg font-semibold text-ink">
              Draw history
            </h2>
            <div className="mt-4 space-y-3">
              {pastDraws.map((draw: any) => {
                const result = winnings.find(
                  (r: any) => r.drawId === draw._id,
                );
                return (
                  <div
                    key={draw._id}
                    className="rounded-xl border border-border bg-surface p-5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-ink">
                          {draw.name}
                        </h3>
                        <p className="text-xs text-ink-soft">
                          {new Date(draw.scheduledDate).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      {result && (
                        <StatusPill
                          status={
                            result.status.charAt(0).toUpperCase() +
                            result.status.slice(1)
                          }
                          variant={
                            result.status === "paid"
                              ? "success"
                              : result.status === "approved"
                                ? "warning"
                                : "default"
                          }
                        />
                      )}
                    </div>

                    {result && (
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <div className="flex gap-1.5">
                          {result.userNumbers.map((n: number, i: number) => {
                            const isMatch = draw.winningNumbers?.includes(n);
                            return (
                              <span
                                key={i}
                                className={`inline-flex h-7 w-7 items-center justify-center rounded-full font-mono text-xs font-bold ${
                                  isMatch
                                    ? "bg-gold text-white"
                                    : "bg-surface-sunken text-ink-soft"
                                }`}
                              >
                                {n}
                              </span>
                            );
                          })}
                        </div>
                        <span className="text-xs text-ink-soft">
                          {result.userNumbers.filter((n: number) => draw.winningNumbers?.includes(n)).length} match
                          {result.userNumbers.filter((n: number) => draw.winningNumbers?.includes(n)).length !== 1 ? "es" : ""}
                          {result.tier
                            ? ` — Tier ${result.tier}`
                            : ""}
                        </span>
                        {result.prize > 0 && (
                          <span className="font-mono text-sm font-bold text-gold">
                            £{(result.prize / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        )}
                      </div>
                    )}

                    {draw.winningNumbers && draw.winningNumbers.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-ink-soft">
                          Winning numbers:{" "}
                          <span className="font-mono font-medium text-ink">
                            {draw.winningNumbers.join(", ")}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
              {pastDraws.length === 0 && (
                <p className="text-sm text-ink-soft">No past draws yet.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
