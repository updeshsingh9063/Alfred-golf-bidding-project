import { Navbar } from '../../components/shared/Navbar';
import { Footer } from '../../components/shared/Footer';

const oddsTable = [
  { tier: 'Jackpot', matches: '5 of 5', prize: '£6,000–£10,000+', odds: '~1 in 500,000', note: 'Rolled over if no winner' },
  { tier: 'Second', matches: '4 of 5', prize: '£350–£500', odds: '~1 in 5,000', note: 'Typically 1–3 winners' },
  { tier: 'Third', matches: '3 of 5', prize: '£50', odds: '~1 in 200', note: 'Typically 15–30 winners' },
];

const verificationSteps = [
  {
    step: '1',
    title: 'Draw execution',
    body: 'Winning numbers are generated using a cryptographically secure random number generator. The seed and output are logged with a timestamp.',
  },
  {
    step: '2',
    title: 'Publication',
    body: 'Winning numbers are published alongside the full list of subscriber numbers for that draw. Anyone can independently verify the result.',
  },
  {
    step: '3',
    title: 'Winner notification',
    body: 'Matched subscribers are contacted via email and in-app notification. They have 48 hours to confirm their identity and claim.',
  },
  {
    step: '4',
    title: 'Independent verification',
    body: 'Claims are cross-checked against the subscriber database. Identity is verified before any payment is released.',
  },
  {
    step: '5',
    title: 'Payment',
    body: 'Verified winners receive their prize within 5 working days via bank transfer. Payment confirmation is sent to the winner.',
  },
];

export default function Trust() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <section className="border-b border-border">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center lg:px-8 lg:py-24">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold">
            Trust & fairness
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            How we keep things fair
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            We believe transparency is not optional. Here is exactly how odds work, how the prize pool is calculated, and how we verify every draw.
          </p>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-[1800px] px-5 py-12 lg:px-8 lg:py-16">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            How odds work
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-soft">
            Each subscriber has five numbers per draw. Five winning numbers are generated randomly. The table below shows the match tiers, typical prizes, and approximate odds.
          </p>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-sunken">
                  <th className="px-4 py-3 font-semibold text-ink">Tier</th>
                  <th className="px-4 py-3 font-semibold text-ink">Matches</th>
                  <th className="px-4 py-3 font-semibold text-ink">Prize</th>
                  <th className="px-4 py-3 font-semibold text-ink">Odds</th>
                  <th className="px-4 py-3 font-semibold text-ink">Notes</th>
                </tr>
              </thead>
              <tbody>
                {oddsTable.map((row) => (
                  <tr key={row.tier} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-3 font-medium text-ink">{row.tier}</td>
                    <td className="px-4 py-3 font-mono text-ink">{row.matches}</td>
                    <td className="px-4 py-3 font-mono font-semibold text-gold">{row.prize}</td>
                    <td className="px-4 py-3 font-mono text-ink-soft">{row.odds}</td>
                    <td className="px-4 py-3 text-ink-soft">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-xs text-ink-soft/70">
            Odds are approximate and depend on the total number of active subscribers in a given draw. With ~2,800 subscribers, each subscriber holds 5 numbers from a pool of ~14,000 numbers.
          </p>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-[1800px] px-5 py-12 lg:px-8 lg:py-16">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Prize pool formula
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-soft">
            The prize pool is built from subscriber fees minus the charity contribution portion. Here is the breakdown for a typical month:
          </p>

          <div className="mt-8 rounded-[var(--radius-card)] border border-border bg-surface p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <span className="text-sm text-ink-soft">Active subscribers</span>
                <span className="font-mono text-sm font-semibold text-ink">2,847</span>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-4">
                <span className="text-sm text-ink-soft">Monthly fee per subscriber</span>
                <span className="font-mono text-sm font-semibold text-ink">£25.00</span>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-4">
                <span className="text-sm text-ink-soft">Average charity contribution (15%)</span>
                <span className="font-mono text-sm font-semibold text-rose">-£3.75</span>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-4">
                <span className="text-sm text-ink-soft">Per subscriber to prize pool</span>
                <span className="font-mono text-sm font-semibold text-accent-deep">£21.25</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-ink">Total monthly prize pool</span>
                <span className="font-mono text-lg font-bold text-gold">
                  £{(2847 * 21.25).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>

          <p className="mt-4 text-xs text-ink-soft/70">
            Actual amounts vary based on subscriber count and individual charity contribution percentages. The above uses the current average.
          </p>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-[1800px] px-5 py-12 lg:px-8 lg:py-16">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Simulation before publication
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-soft">
            Before any draw is published, we run a full simulation against all active subscriber numbers. This ensures:
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Prize coverage',
                body: 'The prize pool can cover all potential payouts at every tier before the draw goes live.',
              },
              {
                title: 'No impossible states',
                body: 'The system verifies that no combination of matches would exceed the available pool.',
              },
              {
                title: 'Fair distribution',
                body: 'We confirm that the number distribution does not create unintended clustering or bias.',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-[var(--radius-card)] border border-border bg-surface p-5">
                <h3 className="text-sm font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1800px] px-5 py-12 lg:px-8 lg:py-16">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Winner verification steps
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-soft">
            Every winner goes through a structured verification process before payment. This protects both the winner and the integrity of the draw.
          </p>

          <div className="mt-8 space-y-0">
            {verificationSteps.map((vs, i) => (
              <div key={vs.step} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-deep font-mono text-xs font-bold text-white">
                    {vs.step}
                  </div>
                  {i < verificationSteps.length - 1 && (
                    <div className="h-full w-px bg-border" />
                  )}
                </div>
                <div className="pb-8">
                  <h3 className="text-sm font-semibold text-ink">{vs.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{vs.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
