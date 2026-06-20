import { useState } from 'react';
import { Check, CreditCard, Lock } from 'lucide-react';
import { Navbar } from '../../components/shared/Navbar';
import { Footer } from '../../components/shared/Footer';
import { PrizePoolBar } from '../../components/shared/PrizePoolBar';
import { ContributionSlider } from '../../components/shared/ContributionSlider';

const monthlyPrice = 25;
const yearlyPrice = 250;

const features = [
  '5 Stableford scores per month',
  'Monthly prize draw entry',
  'Choose your charity',
  'Transparent draw results',
  'Cancel anytime',
  'Verified payout within 5 days',
];

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);
  const [charityPercent, setCharityPercent] = useState(15);

  const price = isYearly ? yearlyPrice : monthlyPrice;
  const monthlyEquiv = isYearly ? +(yearlyPrice / 12).toFixed(2) : monthlyPrice;

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <section className="border-b border-border">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center lg:px-8 lg:py-24">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold">
            Pricing
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            One plan. Every feature included. Choose monthly or yearly and save two months.
          </p>

          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-border bg-surface p-1">
            <button
              onClick={() => setIsYearly(false)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                !isYearly ? 'bg-accent-deep text-white' : 'text-ink-soft hover:text-ink'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                isYearly ? 'bg-accent-deep text-white' : 'text-ink-soft hover:text-ink'
              }`}
            >
              Yearly
              <span className="ml-1.5 rounded-full bg-gold-soft px-2 py-0.5 text-[10px] font-semibold text-gold">
                Save £50
              </span>
            </button>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-[1800px] px-5 py-12 lg:px-8 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <div className="rounded-[var(--radius-card)] border border-border bg-surface p-8">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-4xl font-bold text-ink">
                    £{monthlyEquiv}
                  </span>
                  <span className="text-sm text-ink-soft">/ month</span>
                </div>
                {isYearly && (
                  <p className="mt-1 text-sm text-ink-soft">
                    Billed annually at £{yearlyPrice}
                  </p>
                )}

                <ul className="mt-6 space-y-3">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check size={16} className="mt-0.5 shrink-0 text-success" />
                      <span className="text-sm text-ink-soft">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 rounded-[var(--radius-card)] border border-border bg-surface p-6">
                <p className="mb-4 text-sm font-semibold text-ink">Where your money goes</p>
                <PrizePoolBar 
                  prizePercent={40}
                  charityPercent={charityPercent}
                  platformPercent={60 - charityPercent}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[var(--radius-card)] border border-border bg-surface p-6">
                <p className="mb-4 text-sm font-semibold text-ink">Charity contribution split</p>
                <ContributionSlider
                  value={charityPercent}
                  onChange={setCharityPercent}
                  monthlyAmount={monthlyEquiv}
                />
              </div>

              <div className="rounded-[var(--radius-card)] border border-border bg-surface p-6">
                <div className="mb-5 flex items-center gap-2">
                  <CreditCard size={18} className="text-ink-soft" />
                  <p className="text-sm font-semibold text-ink">Payment details</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-ink-soft">
                      Card number
                    </label>
                    <div className="flex items-center rounded-lg border border-border bg-bg px-3 py-2.5">
                      <span className="flex-1 text-sm text-ink-soft/50">4242 4242 4242 4242</span>
                      <Lock size={14} className="text-ink-soft/40" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-ink-soft">
                        Expiry
                      </label>
                      <div className="rounded-lg border border-border bg-bg px-3 py-2.5">
                        <span className="text-sm text-ink-soft/50">MM / YY</span>
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-ink-soft">
                        CVC
                      </label>
                      <div className="rounded-lg border border-border bg-bg px-3 py-2.5">
                        <span className="text-sm text-ink-soft/50">123</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  disabled
                  className="mt-6 w-full cursor-not-allowed rounded-full bg-accent-deep/40 py-3 text-sm font-medium text-white/60"
                >
                  Subscribe — £{price}{isYearly ? '/year' : '/month'}
                </button>

                <p className="mt-3 text-center text-[11px] text-ink-soft/60">
                  Demo only. No real payments processed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
