import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Pencil, Hash, Trophy, Heart, ShieldCheck } from 'lucide-react';
import { Navbar } from '../../components/shared/Navbar';
import { Footer } from '../../components/shared/Footer';
import { TicketCard } from '../../components/shared/TicketCard';

const steps = [
  {
    icon: Pencil,
    number: '01',
    title: 'Log your scores',
    body: 'After each round, enter your Stableford score. Stableford is a points-based system that rewards consistent play — you earn points for pars, birdies, and better on each hole. We take your five most recent scores.',
    detail: 'Scores are tied to a date and course, so your numbers are verifiable and unique to your round.',
  },
  {
    icon: Hash,
    number: '02',
    title: 'Your scores become numbers',
    body: 'Each of your five Stableford scores maps directly to a draw number. No picking, no randomness — your actual golf performance generates your entry. Better rounds give you different numbers, but every active subscriber has an equal chance.',
    detail: 'For example: scores of 34, 28, 38, 31, 42 become draw numbers 34, 28, 38, 31, 42.',
  },
  {
    icon: Trophy,
    number: '03',
    title: 'Three ways to win',
    body: 'Each monthly draw matches five winning numbers against every subscriber\'s five numbers. The more matches, the bigger the prize.',
    tiers: [
      { matches: '5 matches', prize: 'Jackpot', desc: 'The top prize — typically £6,000–£10,000+ with rollovers' },
      { matches: '4 matches', prize: '£350–£500', desc: 'Second tier — multiple winners possible' },
      { matches: '3 matches', prize: '£50', desc: 'Third tier — dozens of winners each month' },
    ],
  },
  {
    icon: Heart,
    number: '04',
    title: 'Choose your charity',
    body: 'When you subscribe, you choose which charity receives your contribution portion. You can adjust the split at any time — from 10% to 80% of your monthly fee going to charity, with the remainder funding the prize pool.',
    detail: 'Contributions are transferred monthly. You can see exactly how much you have given and to which cause.',
  },
  {
    icon: ShieldCheck,
    number: '05',
    title: 'Verification & payout',
    body: 'Draws are run at the end of each month. Winning numbers are published alongside the full subscriber list for that draw. Winners are notified, verification is completed, and prizes are paid within 5 working days.',
    detail: 'All draw results are independently auditable. We publish a transparency report every quarter.',
  },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <section className="border-b border-border">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center lg:px-8 lg:py-24">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold">
            How it works
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Five steps from tee box to prize
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            Alfred turns your golf scores into a monthly prize draw entry — with every subscription funding real charities. Here is exactly how it works.
          </p>
        </div>
      </section>

      {steps.map((step, i) => (
        <section key={step.number} className="border-b border-border">
          <div className="mx-auto max-w-[1800px] px-5 py-16 lg:px-8 lg:py-24">
            <div className={`grid items-start gap-10 lg:grid-cols-2 lg:gap-16 ${i % 2 === 1 ? 'lg:[direction:rtl]' : ''}`}>
              <div className="lg:[direction:ltr]">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-deep/10">
                    <step.icon size={18} className="text-accent-deep" />
                  </div>
                  <span className="font-mono text-xs font-medium text-ink-soft">{step.number}</span>
                </div>
                <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                  {step.title}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-ink-soft">
                  {step.body}
                </p>
                {step.detail && (
                  <p className="mt-3 text-sm italic text-ink-soft/80">
                    {step.detail}
                  </p>
                )}

                {step.tiers && (
                  <div className="mt-6 overflow-hidden rounded-[var(--radius-card)] border border-border">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-border bg-surface-sunken">
                          <th className="px-4 py-3 font-semibold text-ink">Matches</th>
                          <th className="px-4 py-3 font-semibold text-ink">Prize</th>
                          <th className="hidden px-4 py-3 font-semibold text-ink sm:table-cell">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {step.tiers.map((t) => (
                          <tr key={t.matches} className="border-b border-border last:border-b-0">
                            <td className="px-4 py-3 font-mono font-semibold text-accent-deep">{t.matches}</td>
                            <td className="px-4 py-3 font-mono font-semibold text-gold">{t.prize}</td>
                            <td className="px-4 py-3 text-ink-soft">{t.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="lg:[direction:ltr]">
                {step.number === '01' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <TicketCard scores={[34, 28, 38, 31, 42]} status="active" title="Latest scores" subtitle="Royal Dornoch, Muirfield, North Berwick, Gullane, Luffness" />
                  </motion.div>
                )}

                {step.number === '02' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="rounded-[var(--radius-card)] border border-border bg-surface p-6"
                  >
                    <p className="mb-4 text-sm font-medium text-ink-soft">Score → Number mapping</p>
                    <div className="space-y-3">
                      {[
                        { score: 34, course: 'Royal Dornoch' },
                        { score: 28, course: 'Muirfield' },
                        { score: 38, course: 'North Berwick' },
                        { score: 31, course: 'Gullane' },
                        { score: 42, course: 'Luffness New' },
                      ].map((s, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <span className="w-28 text-xs text-ink-soft truncate">{s.course}</span>
                          <span className="font-mono text-lg font-bold text-ink-soft">{s.score}</span>
                          <span className="text-ink-soft">→</span>
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-deep font-mono text-sm font-bold text-white">
                            {s.score}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step.number === '03' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="rounded-[var(--radius-card)] border border-border bg-surface p-6"
                  >
                    <p className="mb-4 text-sm font-medium text-ink-soft">Prize structure</p>
                    <div className="space-y-4">
                      {[
                        { tier: 'Jackpot', matches: '5/5', color: 'bg-gold', amount: '£8,000+' },
                        { tier: 'Second', matches: '4/5', color: 'bg-accent-deep', amount: '£450' },
                        { tier: 'Third', matches: '3/5', color: 'bg-rose', amount: '£50' },
                      ].map((t) => (
                        <div key={t.tier} className="flex items-center gap-4">
                          <div className={`h-3 w-3 rounded-full ${t.color}`} />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-ink">{t.tier}</span>
                              <span className="font-mono text-sm font-bold text-ink">{t.amount}</span>
                            </div>
                            <p className="text-xs text-ink-soft">{t.matches} matching numbers</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step.number === '04' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="rounded-[var(--radius-card)] border border-border bg-surface p-6"
                  >
                    <p className="mb-4 text-sm font-medium text-ink-soft">Your monthly split</p>
                    <div className="flex h-6 w-full overflow-hidden rounded-full">
                      <div className="h-full bg-accent-deep" style={{ width: '85%' }} />
                      <div className="h-full bg-rose" style={{ width: '15%' }} />
                    </div>
                    <div className="mt-3 flex justify-between text-xs">
                      <span className="text-ink-soft">
                        <span className="font-mono font-semibold text-accent-deep">£21.25</span> prize pool
                      </span>
                      <span className="text-ink-soft">
                        <span className="font-mono font-semibold text-rose">£3.75</span> to charity
                      </span>
                    </div>
                    <p className="mt-4 text-xs leading-relaxed text-ink-soft">
                      Adjust the split anytime. You choose which charity receives your contribution.
                    </p>
                  </motion.div>
                )}

                {step.number === '05' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="rounded-[var(--radius-card)] border border-border bg-surface p-6"
                  >
                    <p className="mb-4 text-sm font-medium text-ink-soft">Verification timeline</p>
                    <div className="space-y-4">
                      {[
                        { day: 'Day 1', event: 'Draw executed, winning numbers published' },
                        { day: 'Day 2', event: 'Winners notified, proof submission opens' },
                        { day: 'Day 3–4', event: 'Independent verification of claims' },
                        { day: 'Day 5', event: 'Prizes paid to verified winners' },
                      ].map((v, idx) => (
                        <div key={idx} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="h-3 w-3 rounded-full bg-accent-deep" />
                            {idx < 3 && <div className="h-8 w-px bg-border" />}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-accent-deep">{v.day}</p>
                            <p className="text-sm text-ink-soft">{v.event}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="bg-accent-deep">
        <div className="mx-auto max-w-[1800px] px-5 py-16 text-center lg:px-8 lg:py-20">
          <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
            Ready to play?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-base text-white/70">
            Subscribe from £25/month. Cancel anytime.
          </p>
          <Link
            to="/pricing"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-accent-deep transition-colors hover:bg-gold-soft"
          >
            View pricing
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
