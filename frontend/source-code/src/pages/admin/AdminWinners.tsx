import { useState } from "react";
import {
  BarChart3,
  Users,
  Ticket,
  Building2,
  HandCoins,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
} from "lucide-react";
import { SidebarNav } from "../../components/shared/SidebarNav";
import { StatusPill } from "../../components/shared/StatusPill";
import { useAdminWinners } from "../../lib/hooks";
import { fetchApi } from "../../lib/api";

const adminItems = [
  { label: "Overview", href: "/admin", icon: <BarChart3 size={16} /> },
  { label: "Users", href: "/admin/users", icon: <Users size={16} /> },
  { label: "Draws", href: "/admin/draws", icon: <Ticket size={16} /> },
  { label: "Charities", href: "/admin/charities", icon: <Building2 size={16} /> },
  { label: "Winners", href: "/admin/winners", icon: <HandCoins size={16} /> },
  { label: "Reports", href: "/admin/reports", icon: <BarChart3 size={16} /> },
];

const statusVariant: Record<string, "success" | "warning" | "danger" | "default"> = {
  pending: "default",
  approved: "warning",
  rejected: "danger",
  paid: "success",
};

export default function AdminWinners() {
  const { data, loading, refetch } = useAdminWinners(1, 50);

  async function updateStatus(id: string, status: string) {
    try {
      await fetchApi(`/admin/winners/${id}/verify`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      });
      refetch();
    } catch (e) {
      console.error(e);
    }
  }

  async function togglePayout(id: string, currentStatus: string) {
    const newStatus = currentStatus === "paid" ? "approved" : "paid";
    try {
      await fetchApi(`/admin/winners/${id}/verify`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus })
      });
      refetch();
    } catch (e) {
      console.error(e);
    }
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  const winners = data?.winners?.map((w: any) => ({
    id: w._id,
    userName: w.user?.name || `${w.user?.firstName || ''} ${w.user?.lastName || ''}`.trim() || 'Unknown User',
    drawName: w.draw?.name || 'Unknown Draw',
    tier: w.tier || 0,
    prize: w.prize || 0,
    status: w.status || 'pending',
    proofUrl: w.proofUrl || null,
    submittedAt: new Date(w.createdAt).toLocaleDateString("en-GB"),
    verifiedAt: w.verifiedAt ? new Date(w.verifiedAt).toLocaleDateString("en-GB") : null,
    paidAt: w.paidAt ? new Date(w.paidAt).toLocaleDateString("en-GB") : null,
  })) || [];

  return (
    <div className="flex min-h-screen bg-bg">
      <SidebarNav
        items={adminItems}
        activePath="/admin/winners"
        title="Admin"
        variant="admin"
      />

      <main className="flex-1 overflow-y-auto md:ml-64">
        <div className="mx-auto max-w-[1400px] px-6 py-8">
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">
              Winners
            </h1>
            <p className="mt-1 text-sm text-ink-soft">
              {winners.filter((w: any) => w.status === "pending").length} awaiting
              verification · {winners.filter((w: any) => w.status === "paid").length}{" "}
              paid
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {winners.map((winner: any) => (
              <div
                key={winner.id}
                className="rounded-xl border border-border bg-surface p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        winner.status === "paid"
                          ? "bg-success/10"
                          : winner.status === "approved"
                            ? "bg-gold-soft"
                            : winner.status === "rejected"
                              ? "bg-danger/10"
                              : "bg-surface-sunken"
                      }`}
                    >
                      {winner.status === "paid" ? (
                        <CheckCircle2 size={18} className="text-success" />
                      ) : winner.status === "approved" ? (
                        <Clock size={18} className="text-gold" />
                      ) : winner.status === "rejected" ? (
                        <XCircle size={18} className="text-danger" />
                      ) : (
                        <DollarSign size={18} className="text-ink-soft" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-ink">
                        {winner.userName}
                      </h3>
                      <p className="text-xs text-ink-soft">
                        {winner.drawName} · Tier {winner.tier}
                      </p>
                      <p className="mt-1 font-mono text-lg font-bold text-ink">
                        £{(winner.prize / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <StatusPill
                      status={
                        winner.status.charAt(0).toUpperCase() +
                        winner.status.slice(1)
                      }
                      variant={statusVariant[winner.status] || "default"}
                    />

                    {winner.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateStatus(winner.id, "approved")}
                          className="inline-flex items-center gap-1 rounded-lg bg-success px-3 py-1.5 text-xs font-medium text-white hover:bg-success/90"
                        >
                          <CheckCircle2 size={12} />
                          Approve
                        </button>
                        <button
                          onClick={() => updateStatus(winner.id, "rejected")}
                          className="inline-flex items-center gap-1 rounded-lg bg-danger px-3 py-1.5 text-xs font-medium text-white hover:bg-danger/90"
                        >
                          <XCircle size={12} />
                          Reject
                        </button>
                      </div>
                    )}

                    {(winner.status === "approved" || winner.status === "paid") && (
                      <button
                        onClick={() => togglePayout(winner.id, winner.status)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                          winner.status === "paid"
                            ? "border border-border text-ink-soft hover:bg-surface-sunken"
                            : "bg-gold text-white hover:bg-gold/90"
                        }`}
                      >
                        {winner.status === "paid" ? "Mark unpaid" : "Mark paid"}
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-4 rounded-lg bg-surface-sunken/30 p-3">
                  <p className="text-xs font-medium text-ink-soft">
                    Proof preview
                  </p>
                  {winner.proofUrl ? (
                    <img
                      src={winner.proofUrl}
                      alt="Proof"
                      className="mt-2 h-20 w-32 rounded object-cover"
                    />
                  ) : (
                    <div className="mt-2 flex h-20 w-32 items-center justify-center rounded border border-dashed border-border">
                      <span className="text-[10px] text-ink-soft/50">
                        No proof uploaded
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-4 border-t border-border/50 pt-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-ink-soft/60">
                      Submitted
                    </p>
                    <p className="font-mono text-xs text-ink">
                      {winner.submittedAt}
                    </p>
                  </div>
                  {winner.verifiedAt && (
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-ink-soft/60">
                        Verified
                      </p>
                      <p className="font-mono text-xs text-ink">
                        {winner.verifiedAt}
                      </p>
                    </div>
                  )}
                  {winner.paidAt && (
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-ink-soft/60">
                        Paid
                      </p>
                      <p className="font-mono text-xs text-ink">
                        {winner.paidAt}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {winners.length === 0 && (
              <div className="rounded-xl border border-border bg-surface p-6 text-center">
                <p className="text-sm text-ink-soft">No winners found.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
