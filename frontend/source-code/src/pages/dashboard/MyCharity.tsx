import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Target,
  Heart,
  Ticket,
  Trophy,
  Settings,
  ExternalLink,
  Gift,
} from "lucide-react";
import { SidebarNav } from "../../components/shared/SidebarNav";
import { ContributionSlider } from "../../components/shared/ContributionSlider";
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

export default function MyCharity() {
  const { data, loading, refetch } = useDashboard();
  const { refreshUser } = useAuth();
  const [percent, setPercent] = useState(10);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (data?.user?.charityPercent) {
      setPercent(data.user.charityPercent);
    }
  }, [data]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (!data?.user) {
    return <div className="flex min-h-screen items-center justify-center">Error loading charity info</div>;
  }

  const { user, subscription } = data;
  const charity = user.charityId;

  const monthlyAmount = subscription?.amount ? subscription.amount / 100 : 25; // Default £25 if not subscribed yet

  const totalDonated = ((subscription?.amount || 0) * (user.charityPercent || 0) / 100 / 100) * 7; // Mock 7 months for now

  const handlePercentChange = async (newPercent: number) => {
    setPercent(newPercent);
    setIsSaving(true);
    try {
      await fetchApi('/users/charity', {
        method: 'PATCH',
        body: JSON.stringify({ charityPercent: newPercent })
      });
      await refetch();
      await refreshUser();
    } catch (err) {
      console.error("Failed to update percent", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-bg">
      <SidebarNav
        items={dashboardItems}
        activePath="/dashboard/charity"
        title="Fairway"
        variant="dashboard"
      />

      <main className="flex-1 overflow-y-auto md:ml-64">
        <div className="mx-auto max-w-[1200px] px-6 py-8">
          <h1 className="font-display text-2xl font-semibold text-ink">
            My Charity
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Choose where your contribution goes each month.
          </p>

          {charity ? (
            <div className="mt-6 overflow-hidden rounded-xl border border-border bg-surface">
              {charity.logoUrl && (
                <img
                  src={charity.logoUrl}
                  alt={charity.name}
                  className="h-48 w-full object-cover"
                />
              )}
              <div className="p-6">
                <p className="text-xs font-medium uppercase tracking-wider text-accent-deep">
                  {charity.category || "Charity"}
                </p>
                <h2 className="mt-1 font-display text-xl font-semibold text-ink">
                  {charity.name}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {charity.description}
                </p>
                <div className="mt-4 flex items-center gap-4">
                  <div className="rounded-lg bg-success/5 px-4 py-2">
                    <p className="text-xs text-ink-soft">Your contribution</p>
                    <p className="font-mono text-lg font-bold text-success">
                      £{totalDonated.toFixed(0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-border bg-surface p-6 text-center">
              <p className="text-sm text-ink-soft">You haven't selected a charity yet.</p>
            </div>
          )}

          <div className="mt-6 rounded-xl border border-border bg-surface p-6">
            <h3 className="font-display text-base font-semibold text-ink">
              Adjust your contribution
            </h3>
            <p className="mt-1 text-xs text-ink-soft">
              Minimum 10% of your £{monthlyAmount}/month subscription.
            </p>
            <div className="mt-5 opacity-90 transition-opacity" style={{ opacity: isSaving ? 0.5 : 1 }}>
              <ContributionSlider
                value={percent}
                onChange={handlePercentChange}
                min={10}
                monthlyAmount={monthlyAmount}
              />
            </div>
          </div>

          {charity && (
            <div className="mt-6 rounded-xl border border-border/60 bg-surface-sunken/30 p-6">
              <div className="flex items-start gap-3">
                <Gift size={18} className="mt-0.5 text-ink-soft" />
                <div>
                  <h3 className="text-sm font-semibold text-ink">
                    One-off donation
                  </h3>
                  <p className="mt-1 text-xs text-ink-soft">
                    Want to give more? Make a one-time donation directly to{" "}
                    {charity.name}.
                  </p>
                  <button className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-sunken">
                    <ExternalLink size={14} />
                    Donate to {charity.name}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              to="/charities"
              className="text-sm font-medium text-accent-deep hover:underline"
            >
              Change charity →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
