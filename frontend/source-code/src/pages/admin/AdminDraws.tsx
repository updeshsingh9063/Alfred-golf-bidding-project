import { useState } from "react";
import {
  BarChart3,
  Users,
  Ticket,
  Building2,
  HandCoins,
  Play,
  CheckCircle2,
} from "lucide-react";
import { SidebarNav } from "../../components/shared/SidebarNav";
import { StatusPill } from "../../components/shared/StatusPill";
import { useAdminDraws } from "../../lib/hooks";
import { fetchApi } from "../../lib/api";

const adminItems = [
  { label: "Overview", href: "/admin", icon: <BarChart3 size={16} /> },
  { label: "Users", href: "/admin/users", icon: <Users size={16} /> },
  { label: "Draws", href: "/admin/draws", icon: <Ticket size={16} /> },
  { label: "Charities", href: "/admin/charities", icon: <Building2 size={16} /> },
  { label: "Winners", href: "/admin/winners", icon: <HandCoins size={16} /> },
  { label: "Reports", href: "/admin/reports", icon: <BarChart3 size={16} /> },
];

export default function AdminDraws() {
  const { data, loading, refetch } = useAdminDraws(1, 50);
  const [algorithm, setAlgorithm] = useState<"random" | "algorithmic">("random");
  const [showSimulation, setShowSimulation] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [simulatedNumbers, setSimulatedNumbers] = useState<number[]>([]);
  const [simulating, setSimulating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  const draws = data?.draws || [];
  const currentDraw = draws.find((d: any) => d.status === "upcoming" || d.status === "simulated" || d.status === "in_progress");
  const pastDraws = draws.filter((d: any) => d.status === "published");

  return (
    <div className="flex min-h-screen bg-bg">
      <SidebarNav
        items={adminItems}
        activePath="/admin/draws"
        title="Admin"
        variant="admin"
      />

      <main className="flex-1 overflow-y-auto md:ml-64">
        <div className="mx-auto max-w-[1400px] px-6 py-8">
          <h1 className="font-display text-2xl font-semibold text-ink">
            Draws
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Configure and manage draw events.
          </p>

          {currentDraw ? (
            <div className="mt-6 rounded-xl border border-border bg-surface p-6">
              <div className="flex items-start justify-between">
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
                  {/* Jackpot Rollover placeholder - API does not return it yet */}
                </div>
                <StatusPill
                  status={currentDraw.status.charAt(0).toUpperCase() + currentDraw.status.slice(1)}
                  variant="warning"
                />
              </div>

              <div className="mt-6 border-t border-border pt-5">
                <h3 className="text-sm font-semibold text-ink">
                  Draw algorithm
                </h3>
                <div className="mt-3 flex gap-3">
                  {(["random", "algorithmic"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setAlgorithm(mode)}
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                        algorithm === mode
                          ? "bg-accent-deep text-white"
                          : "border border-border bg-surface text-ink-soft hover:bg-surface-sunken"
                      }`}
                    >
                      {mode === "random" ? "Random" : "Algorithmic (weighted)"}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-ink-soft">
                  {algorithm === "random"
                    ? "Pure random selection — each number has equal probability."
                    : "Weighted algorithm — accounts for score distribution patterns."}
                </p>
              </div>

              <div className="mt-6 flex gap-3 border-t border-border pt-5">
                <button
                  disabled={simulating}
                  onClick={async () => {
                    if (!currentDraw) return;
                    setSimulating(true);
                    try {
                      const res = await fetchApi(`/admin/draws/${currentDraw._id}/simulate`, {
                        method: 'POST',
                        body: JSON.stringify({ method: algorithm })
                      });
                      if (res.success && res.data?.draw?.winningNumbers) {
                        setSimulatedNumbers(res.data.draw.winningNumbers);
                      }
                      setShowSimulation(true);
                      refetch();
                    } catch(e) { console.error(e); }
                    finally { setSimulating(false); }
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-ink hover:bg-surface-sunken disabled:opacity-50"
                >
                  <Play size={14} />
                  {simulating ? 'Simulating...' : 'Run simulation'}
                </button>
                <button
                  onClick={() => setShowConfirm(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-accent-deep px-4 py-2 text-sm font-medium text-white hover:bg-accent-deep-hov"
                >
                  <CheckCircle2 size={14} />
                  Publish results
                </button>
              </div>

              {showSimulation && (
                <div className="relative mt-5 rounded-xl border-2 border-dashed border-border bg-surface-sunken/30 p-6">
                  <span className="absolute top-3 right-4 font-mono text-[10px] font-bold uppercase tracking-widest text-ink-soft/30">
                    SIMULATION
                  </span>
                  <p className="text-xs font-medium text-ink-soft">
                    Simulated winning numbers ({algorithm} mode):
                  </p>
                  <div className="mt-3 flex gap-2">
                    {simulatedNumbers.map((n, i) => (
                      <span
                        key={i}
                        className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-accent-deep/40 font-mono text-sm font-bold text-accent-deep"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-ink-soft">
                    This is a preview only. No numbers are committed until you
                    publish.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-border bg-surface p-6">
              <p className="text-sm text-ink-soft">No active or upcoming draws found.</p>
            </div>
          )}

          {publishSuccess && (
            <div className="mt-4 rounded-lg border border-success/30 bg-success/5 p-4 text-center">
              <CheckCircle2 size={16} className="mx-auto text-success" />
              <p className="mt-1 text-sm font-medium text-success">
                Results published successfully. Winners have been notified.
              </p>
            </div>
          )}

          <div className="mt-8">
            <h2 className="font-display text-lg font-semibold text-ink">
              Past draws
            </h2>
            <div className="mt-4 space-y-3">
              {pastDraws.map((draw: any) => (
                <div
                  key={draw._id}
                  className="rounded-xl border border-border bg-surface p-5"
                >
                  <div className="flex items-center justify-between">
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
                    <div className="text-right">
                      <p className="font-mono text-sm font-bold text-ink">
                        £{(draw.prizePool / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                      <StatusPill status="Completed" variant="success" />
                    </div>
                  </div>
                  {draw.winningNumbers && draw.winningNumbers.length > 0 && (
                    <div className="mt-3 flex gap-1.5">
                      {draw.winningNumbers.map((n: number, i: number) => (
                        <span
                          key={i}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent-deep font-mono text-xs font-bold text-white"
                        >
                          {n}
                        </span>
                      ))}
                    </div>
                  )}
                  {/* Tiers placeholder - logic needs to map actual winners based on match count */}
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {[
                      { matches: 5, poolPct: 0.40, winners: draw.winners?.tier5?.count || 0, prizeEach: draw.winners?.tier5?.prizeEach || 0 },
                      { matches: 4, poolPct: 0.35, winners: draw.winners?.tier4?.count || 0, prizeEach: draw.winners?.tier4?.prizeEach || 0 },
                      { matches: 3, poolPct: 0.25, winners: draw.winners?.tier3?.count || 0, prizeEach: draw.winners?.tier3?.prizeEach || 0 },
                    ].map((tier) => (
                      <div
                        key={tier.matches}
                        className="rounded-lg bg-surface-sunken/50 px-3 py-2 text-center"
                      >
                        <p className="text-[10px] text-ink-soft">
                          Match {tier.matches}
                        </p>
                        <p className="font-mono text-xs font-bold text-ink">
                          {tier.prizeEach > 0 ? `£${(tier.prizeEach / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '—'}
                        </p>
                        <p className="text-[10px] text-ink-soft">
                          {tier.winners} winner{tier.winners !== 1 ? "s" : ""}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {pastDraws.length === 0 && (
                <p className="text-sm text-ink-soft">No past draws found.</p>
              )}
            </div>
          </div>
        </div>
      </main>

      {showConfirm && currentDraw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30">
          <div className="w-full max-w-sm rounded-xl bg-surface p-6 shadow-xl">
            <h3 className="font-display text-base font-semibold text-ink">
              Publish results?
            </h3>
            <p className="mt-2 text-sm text-ink-soft">
              This will finalise the winning numbers for {currentDraw?.name} and
              notify all participants. This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-ink-soft hover:bg-surface-sunken"
              >
                Cancel
              </button>
              <button
                disabled={publishing}
                onClick={async () => {
                  if (!currentDraw) return;
                  setPublishing(true);
                  try {
                    await fetchApi(`/admin/draws/${currentDraw._id}/publish`, {
                      method: 'POST',
                      body: JSON.stringify({ method: algorithm })
                    });
                    setShowConfirm(false);
                    setPublishSuccess(true);
                    setTimeout(() => setPublishSuccess(false), 5000);
                    refetch();
                  } catch(e) { console.error(e); }
                  finally { setPublishing(false); }
                }}
                className="rounded-lg bg-accent-deep px-4 py-2 text-sm font-medium text-white hover:bg-accent-deep-hov disabled:opacity-50"
              >
                {publishing ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
