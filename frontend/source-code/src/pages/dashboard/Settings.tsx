import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Target,
  Heart,
  Ticket,
  Trophy,
  Settings,
  Bell,
  CreditCard,
  User,
} from "lucide-react";
import { SidebarNav } from "../../components/shared/SidebarNav";
import { StatusPill } from "../../components/shared/StatusPill";
import { useDashboard } from "../../lib/hooks";
import { fetchApi } from "../../lib/api";
import { useAuth } from "../../lib/auth";

const dashboardItems = [
  { label: "Overview", href: "/dashboard", icon: <LayoutDashboard size={16} /> },
  { label: "My Scores", href: "/dashboard/scores", icon: <Target size={16} /> },
  { label: "My Charity", href: "/dashboard/charity", icon: <Heart size={16} /> },
  { label: "Draws", href: "/dashboard/draws", icon: <Ticket size={16} /> },
  { label: "Winnings", href: "/dashboard/winnings", icon: <Trophy size={16} /> },
  { label: "Settings", href: "/dashboard/settings", icon: <Settings size={16} /> },
];

export default function SettingsPage() {
  const { data, loading, refetch } = useDashboard();
  const { refreshUser } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [notifications, setNotifications] = useState({
    drawResults: true,
    winnerAlerts: true,
    systemUpdates: false,
  });

  useEffect(() => {
    if (data?.user) {
      setFirstName(data.user.firstName || "");
      setLastName(data.user.lastName || "");
      setEmail(data.user.email || "");
    }
  }, [data]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  const { subscription } = data || {};

  function toggleNotification(key: keyof typeof notifications) {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function handleSaveProfile() {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await fetchApi('/users/profile', {
        method: 'PATCH',
        body: JSON.stringify({ firstName, lastName })
      });
      await refetch();
      await refreshUser();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save profile", err);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-bg">
      <SidebarNav
        items={dashboardItems}
        activePath="/dashboard/settings"
        title="Fairway"
        variant="dashboard"
      />

      <main className="flex-1 overflow-y-auto md:ml-64">
        <div className="mx-auto max-w-[1200px] px-6 py-8">
          <h1 className="font-display text-2xl font-semibold text-ink">
            Settings
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Manage your account and preferences.
          </p>

          <section className="mt-6 rounded-xl border border-border bg-surface p-6">
            <div className="flex items-center gap-2">
              <User size={16} className="text-ink-soft" />
              <h2 className="font-display text-base font-semibold text-ink">
                Profile
              </h2>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-ink-soft">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-accent-deep"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-ink-soft">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-accent-deep"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-ink-soft">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-accent-deep opacity-60"
                />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-end gap-3">
              {saveSuccess && <span className="text-sm text-success">Saved!</span>}
              <button 
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="rounded-lg bg-accent-deep px-4 py-2 text-sm font-medium text-white hover:bg-accent-deep-hov disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </section>

          <section className="mt-6 rounded-xl border border-border bg-surface p-6">
            <div className="flex items-center gap-2">
              <CreditCard size={16} className="text-ink-soft" />
              <h2 className="font-display text-base font-semibold text-ink">
                Subscription
              </h2>
            </div>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-ink">
                    {subscription?.plan === "monthly"
                      ? "Monthly"
                      : "Yearly"}{" "}
                    Plan
                  </p>
                  <StatusPill status={subscription?.status === 'active' ? 'Active' : 'Inactive'} variant={subscription?.status === 'active' ? 'success' : 'default'} />
                </div>
                {subscription?.renewalDate && (
                  <p className="mt-1 text-xs text-ink-soft">
                    £{(subscription.amount / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}/month · Renews{" "}
                    {new Date(
                      subscription.renewalDate,
                    ).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-ink hover:bg-surface-sunken">
                  Upgrade
                </button>
                <button className="rounded-lg border border-danger/30 px-4 py-2 text-sm font-medium text-danger hover:bg-danger/5">
                  Cancel
                </button>
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-xl border border-border bg-surface p-6">
            <div className="flex items-center gap-2">
              <CreditCard size={16} className="text-ink-soft" />
              <h2 className="font-display text-base font-semibold text-ink">
                Billing history
              </h2>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-2 text-xs font-medium text-ink-soft">
                      Date
                    </th>
                    <th className="pb-2 text-xs font-medium text-ink-soft">
                      Amount
                    </th>
                    <th className="pb-2 text-xs font-medium text-ink-soft">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {subscription?.status === 'active' && (
                    <tr className="border-b border-border/50 last:border-0">
                      <td className="py-3 text-sm text-ink">
                        {new Date(subscription.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3 font-mono text-sm font-medium text-ink">
                        £{(subscription.amount / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3">
                        <StatusPill status="Paid" variant="success" />
                      </td>
                    </tr>
                  )}
                  {(!subscription || subscription.status !== 'active') && (
                    <tr>
                      <td colSpan={3} className="py-4 text-center text-sm text-ink-soft">
                        No billing history found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-6 rounded-xl border border-border bg-surface p-6">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-ink-soft" />
              <h2 className="font-display text-base font-semibold text-ink">
                Notifications
              </h2>
            </div>
            <div className="mt-4 space-y-4">
              {[
                {
                  key: "drawResults" as const,
                  label: "Draw results",
                  desc: "Get notified when draw results are published.",
                },
                {
                  key: "winnerAlerts" as const,
                  label: "Winner alerts",
                  desc: "Alerts when you've won a prize tier.",
                },
                {
                  key: "systemUpdates" as const,
                  label: "System updates",
                  desc: "Platform news and maintenance notifications.",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-ink">{item.label}</p>
                    <p className="text-xs text-ink-soft">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => toggleNotification(item.key)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      notifications[item.key]
                        ? "bg-accent-deep"
                        : "bg-surface-sunken"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        notifications[item.key]
                          ? "translate-x-5"
                          : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
