import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Eye, Heart, CreditCard, ChevronRight, Quote } from 'lucide-react';
import { Navbar } from '../../components/shared/Navbar';
import { Footer } from '../../components/shared/Footer';
import { TicketCard } from '../../components/shared/TicketCard';
import { mockRecentWinners } from '../../lib/mock-data';
import { useFetch } from '../../lib/hooks';

const acts = [
  {
    tag: 'Act I',
    title: 'Play',
    body: 'Log your Stableford scores after every round. Five scores, five draw numbers. No lottery tickets to buy, no numbers to pick — your game does the work for you.',
    image: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800&q=80',
    reverse: false,
  },
  {
    tag: 'Act II',
    title: 'Give',
    body: 'A portion of every subscription goes directly to the charity you choose. You pick the cause — ocean conservation, youth education, medical relief — and your contribution is tracked transparently, month after month.',
    video: '/community-fun.mp4',
    reverse: true,
  },
  {
    tag: 'Act III',
    title: 'Win',
    body: 'Every month, scores are matched against winning numbers. Five matches takes the jackpot. Four or three matches still pay. It is a prize draw where every entry is earned through sport.',
    image: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=800&q=80',
    reverse: false,
  },
];

const trustPoints = [
  { icon: Shield, label: 'Fair odds, published in advance' },
  { icon: Eye, label: 'Verified draws, independently audited' },
  { icon: Heart, label: 'Charity contributions guaranteed' },
  { icon: CreditCard, label: 'Secure payments via Stripe' },
];

export default function Home() {
  const navigate = useNavigate();
  const { data: featuredData } = useFetch<any>('/charities/featured');
  const spotlight = featuredData?.charity;

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      {/* Hero Section with Video Background */}
      <section className="relative h-screen min-h-[600px] overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          >
            <source src="/hero-golf.mp4" type="video/mp4" />
          </video>
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/50 to-ink/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex h-full items-center">
          <div className="mx-auto max-w-[1800px] px-5 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-2xl lg:max-w-4xl 2xl:max-w-5xl"
            >
              <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-gold lg:text-base">
                Golf &times; Charity &times; Prize Draw
              </p>
              <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-7xl 2xl:text-8xl">
                Your game funds{' '}
                <span className="text-gold">something greater.</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80 lg:text-xl 2xl:max-w-3xl 2xl:text-2xl">
                Log your golf scores. They become draw numbers. Win prizes. Fund charity. It&apos;s that simple.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => {
                    alert('Please login first to access this page.');
                    navigate('/login?mode=signup', { state: { from: '/subscribe' } });
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-accent-deep transition-colors hover:bg-gold-soft"
                >
                  Start your subscription
                  <ArrowRight size={16} />
                </button>
                <Link
                  to="/how-it-works"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-white transition-colors hover:text-gold"
                >
                  See how it works
                  <ChevronRight size={14} />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Ticket Card - positioned on right side */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="absolute right-5 bottom-20 hidden w-full max-w-sm lg:right-8 lg:block"
        >
          <TicketCard scores={[34, 28, 38, 31, 42]} status="active" title="Your numbers" subtitle="June 2026 Draw" />
        </motion.div>
      </section>

      {/* Three Acts */}
      {acts.map((act) => (
        <section key={act.tag} className="border-t border-border">
          <div className="mx-auto grid max-w-[1800px] items-center gap-10 px-5 py-16 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
            <div className={act.reverse ? 'lg:order-2' : ''}>
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-gold lg:text-base">
                {act.tag}
              </p>
              <h2 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-6xl">
                {act.title}
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-soft lg:text-xl 2xl:max-w-2xl 2xl:text-2xl">
                {act.body}
              </p>
            </div>
            <div className={act.reverse ? 'lg:order-1' : ''}>
              <div className="overflow-hidden rounded-[var(--radius-card)] bg-surface-sunken">
                {act.video ? (
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="aspect-[4/3] w-full object-cover"
                  >
                    <source src={act.video} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={act.image}
                    alt={act.title}
                    className="aspect-[4/3] w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/800x600/1B4A47/C9A24B?text=Alfred+Golf";
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Recent Winners Ticker */}
      <section className="border-t border-border bg-surface-sunken">
        <div className="mx-auto max-w-[1800px] px-5 py-12 lg:px-8">
          <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-gold">
            Recent winners
          </p>
          <div className="relative overflow-hidden">
            <motion.div
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              className="flex gap-6 whitespace-nowrap"
            >
              {[...mockRecentWinners, ...mockRecentWinners].map((w, i) => (
                <div
                  key={i}
                  className="inline-flex items-center gap-3 rounded-full border border-border bg-surface px-5 py-2.5"
                >
                  <span className="text-sm font-medium text-ink">{w.name}</span>
                  <span className="text-ink-soft">&middot;</span>
                  <span className="font-mono text-sm font-bold text-gold">
                    £{w.amount.toLocaleString()}
                  </span>
                  <span className="text-ink-soft">&middot;</span>
                  <span className="text-sm text-ink-soft">{w.charity}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Charity Spotlight */}
      {spotlight && (
        <section className="border-t border-border">
        <div className="mx-auto grid max-w-[1800px] items-center gap-10 px-5 py-16 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
          <div className="overflow-hidden rounded-[var(--radius-card)] bg-surface-sunken">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="aspect-[4/3] w-full object-cover"
            >
              <source src="/ocean-conservancy.mp4" type="video/mp4" />
            </video>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-gold lg:text-base">
              Charity spotlight
            </p>
            <h2 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-6xl">
              {spotlight.name}
            </h2>
            {spotlight.quote && (
              <div className="mt-5 flex gap-3">
                <Quote size={24} className="mt-2 shrink-0 text-gold lg:mt-3 lg:h-8 lg:w-8" />
                <p className="font-display text-xl italic leading-relaxed text-ink lg:text-2xl 2xl:text-3xl">
                  {spotlight.quote}
                </p>
              </div>
            )}
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-soft lg:text-xl 2xl:max-w-2xl 2xl:text-2xl">
              {spotlight.description}
            </p>
            <Link
              to={`/charities/${spotlight._id || spotlight.id}`}
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent-deep transition-colors hover:text-accent-deep-hov"
            >
              Learn more about this charity
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>
      )}

      {/* Trust Strip */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-[1800px] px-5 py-12 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trustPoints.map((tp) => (
              <div key={tp.label} className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-sunken">
                  <tp.icon size={18} className="text-accent-deep" />
                </div>
                <p className="pt-2 text-sm font-medium leading-snug text-ink">{tp.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-accent-deep">
        <div className="mx-auto max-w-[1800px] px-5 py-16 text-center lg:px-8 lg:py-20">
          <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
            Join 2,847 players giving back through golf
          </h2>
          <p className="mx-auto mt-3 max-w-md text-base text-white/70">
            Subscribe today. Your first draw numbers are waiting.
          </p>
          <Link
            to="/pricing"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-accent-deep transition-colors hover:bg-gold-soft"
          >
            Subscribe now
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
