import { useState } from "react";
import {
  LayoutDashboard,
  Target,
  Heart,
  Ticket,
  Trophy,
  Settings,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { SidebarNav } from "../../components/shared/SidebarNav";
import { StatusPill } from "../../components/shared/StatusPill";
import { useDashboard } from "../../lib/hooks";

const dashboardItems = [
  { label: "Overview", href: "/dashboard", icon: <LayoutDashboard size={16} /> },
  { label: "My Scores", href: "/dashboard/scores", icon: <Target size={16} /> },
  { label: "My Charity", href: "/dashboard/charity", icon: <Heart size={16} /> },
  { label: "Draws", href: "/dashboard/draws", icon: <Ticket size={16} /> },
  { label: "Winnings", href: "/dashboard/winnings", icon: <Trophy size={16} /> },
  { label: "Settings", href: "/dashboard/settings", icon: <Settings size={16} /> },
];

export default function Winnings() {
  const [dragOver, setDragOver] = useState(false);
  const { data, loading } = useDashboard();

  const statusConfig: Record<
    string,
    { variant: "success" | "warning" | "default"; icon: typeof CheckCircle2 }
  > = {
    paid: { variant: "success", icon: CheckCircle2 },
    approved: { variant: "warning", icon: Clock },
    pending: { variant: "default", icon: AlertCircle },
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  const winnings = data?.winnings?.recent || [];

  return (
    <div className="flex min-h-screen bg-bg">
      <SidebarNav
        items={dashboardItems}
        activePath="/dashboard/winnings"
        title="Fairway"
        variant="dashboard"
      />

      <main className="flex-1 overflow-y-auto md:ml-64">
        <div className="mx-auto max-w-[1200px] px-6 py-8">
          <h1 className="font-display text-2xl font-semibold text-ink">
            Winnings
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Track your prizes and verification status.
          </p>

          <div className="mt-6 space-y-4">
            {winnings.map((result: any) => {
              const config = statusConfig[result.status] || statusConfig.pending;
              const StatusIcon = config.icon;
              return (
                <div
                  key={result.drawId}
                  className={`rounded-xl border bg-surface p-5 ${
                    result.status === "paid"
                      ? "border-gold/40"
                      : "border-border"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-ink">
                        {result.drawName}
                      </h3>
                      <p className="mt-0.5 text-xs text-ink-soft">
                        {/* If we have result.createdAt we use it, otherwise date may not be easily available */}
                        {new Date().toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <StatusPill
                      status={
                        result.status.charAt(0).toUpperCase() +
                        result.status.slice(1)
                      }
                      variant={config.variant}
                    />
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="rounded-lg bg-surface-sunken/50 p-3">
                      <p className="text-xs text-ink-soft">Matches</p>
                      <p className="font-mono text-lg font-bold text-ink">
                        {result.userNumbers?.length || 0}/5
                      </p>
                    </div>
                    <div className="rounded-lg bg-surface-sunken/50 p-3">
                      <p className="text-xs text-ink-soft">Tier</p>
                      <p className="font-mono text-lg font-bold text-ink">
                        {result.tier ?? "—"}
                      </p>
                    </div>
                    <div className="rounded-lg bg-surface-sunken/50 p-3">
                      <p className="text-xs text-ink-soft">Prize</p>
                      <p
                        className={`font-mono text-lg font-bold ${
                          result.prize > 0 ? "text-gold" : "text-ink-soft"
                        }`}
                      >
                        {result.prize > 0
                          ? `£${(result.prize / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                          : "—"}
                      </p>
                    </div>
                  </div>

                  {result.prize > 0 && (
                    <div className="mt-4 border-t border-border pt-4">
                      <div className="flex items-start gap-3">
                        <StatusIcon
                          size={16}
                          className={`mt-0.5 shrink-0 ${
                            result.status === "paid"
                              ? "text-success"
                              : result.status === "approved"
                                ? "text-gold"
                                : "text-ink-soft"
                          }`}
                        />
                        <div className="flex-1">
                          {result.status === "paid" && (
                            <p className="text-xs text-ink-soft">
                              Paid successfully. Funds have been transferred to
                              your account.
                            </p>
                          )}
                          {result.status === "approved" && (
                            <p className="text-xs text-ink-soft">
                              Your win has been verified. Payment is being
                              processed.
                            </p>
                          )}
                          {result.status === "pending" && (
                            <div>
                              <p className="text-xs font-medium text-ink">
                                Verification required
                              </p>
                              <p className="mt-1 text-xs text-ink-soft">
                                Upload proof of your scorecard to verify this
                                win. Accepted formats: JPG, PNG, PDF (max 5MB).
                              </p>
                              <div
                                onDragOver={(e) => {
                                  e.preventDefault();
                                  setDragOver(true);
                                }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  setDragOver(false);
                                }}
                                className={`mt-3 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
                                  dragOver
                                    ? "border-accent-deep bg-accent-deep/5"
                                    : "border-border bg-surface-sunken/30"
                                }`}
                              >
                                <Upload
                                  size={20}
                                  className="text-ink-soft"
                                />
                                <p className="mt-2 text-xs font-medium text-ink-soft">
                                  Drag & drop your proof here
                                </p>
                                <p className="mt-0.5 text-[10px] text-ink-soft/60">
                                  or click to browse files
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            
            {winnings.length === 0 && (
              <div className="rounded-xl border border-border bg-surface p-6 text-center">
                <p className="text-sm text-ink-soft">No winnings to show yet.</p>
              </div>
            )}
          </div>

          <div className="mt-8 rounded-xl border border-border bg-surface p-5">
            <h3 className="text-sm font-semibold text-ink">
              Verification process
            </h3>
            <ol className="mt-3 space-y-2 text-xs text-ink-soft">
              <li className="flex gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-deep/10 font-mono text-[10px] font-bold text-accent-deep">
                  1
                </span>
                Upload a clear photo or scan of your scorecard showing date,
                course, and score.
              </li>
              <li className="flex gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-deep/10 font-mono text-[10px] font-bold text-accent-deep">
                  2
                </span>
                Our team reviews submissions within 48 hours.
              </li>
              <li className="flex gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-deep/10 font-mono text-[10px] font-bold text-accent-deep">
                  3
                </span>
                Once verified, your prize is processed and paid within 5 business
                days.
              </li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
}
