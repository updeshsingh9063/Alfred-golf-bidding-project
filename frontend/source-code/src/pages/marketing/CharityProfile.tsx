import { useParams, Link } from 'react-router-dom';
import { ArrowRight, MapPin, Tag, TrendingUp, Quote } from 'lucide-react';
import { Navbar } from '../../components/shared/Navbar';
import { Footer } from '../../components/shared/Footer';
import { useFetch } from '../../lib/hooks';

export default function CharityProfile() {
  const { id } = useParams<{ id: string }>();
  const { data: charityData, loading } = useFetch<any>(`/charities/id/${id}`);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg">
        <Navbar />
        <div className="flex h-[60vh] items-center justify-center">Loading...</div>
        <Footer />
      </div>
    );
  }

  const charity = charityData?.charity;

  if (!charity) {
    return (
      <div className="min-h-screen bg-bg">
        <Navbar />
        <div className="mx-auto max-w-3xl px-5 py-24 text-center lg:px-8">
          <h1 className="font-display text-2xl font-semibold text-ink">Charity not found</h1>
          <p className="mt-2 text-ink-soft">The charity you are looking for does not exist.</p>
          <Link to="/charities" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent-deep">
            Back to directory <ArrowRight size={14} />
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <section className="relative">
        <div className="relative h-64 w-full overflow-hidden sm:h-80 lg:h-96">
          <img
            src={charity.imageUrl || "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80"}
            alt={charity.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10">
            <div className="mx-auto max-w-[1800px] lg:px-8">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gold">
                {charity.category || "General"}
              </p>
              <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {charity.name}
              </h1>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-[1800px] px-5 py-12 lg:px-8 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="font-display text-xl font-semibold text-ink">About</h2>
              <p className="mt-4 text-base leading-relaxed text-ink-soft">
                {charity.description}
              </p>

              {charity.quote && (
                <div className="mt-8 rounded-[var(--radius-card)] border border-border bg-surface p-6">
                  <Quote size={20} className="mb-3 text-gold" />
                  <p className="font-display text-lg italic leading-relaxed text-ink">
                    &ldquo;{charity.quote}&rdquo;
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="rounded-[var(--radius-card)] border border-border bg-surface p-5">
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-ink-soft">
                  Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-soft">
                      <TrendingUp size={16} className="text-gold" />
                    </div>
                    <div>
                      <p className="text-xs text-ink-soft">Total raised</p>
                      <p className="font-mono text-lg font-bold text-accent-deep">
                        £{((charity.totalRaised || 0) / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-sunken">
                      <Tag size={16} className="text-ink-soft" />
                    </div>
                    <div>
                      <p className="text-xs text-ink-soft">Category</p>
                      <p className="text-sm font-medium text-ink">{charity.category || "General"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-sunken">
                      <MapPin size={16} className="text-ink-soft" />
                    </div>
                    <div>
                      <p className="text-xs text-ink-soft">Region</p>
                      <p className="text-sm font-medium text-ink">{charity.region || "Global"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                to="/pricing"
                className="flex items-center justify-center gap-2 rounded-full bg-accent-deep px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-deep-hov"
              >
                Support this charity
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
