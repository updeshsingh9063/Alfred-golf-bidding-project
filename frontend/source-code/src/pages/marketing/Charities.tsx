import { useState, useMemo } from 'react';
import { Search, Star } from 'lucide-react';
import { Navbar } from '../../components/shared/Navbar';
import { Footer } from '../../components/shared/Footer';
import { CharityCard } from '../../components/shared/CharityCard';
import { useCharities } from '../../lib/hooks';

export default function Charities() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const { data, loading } = useCharities();

  const charities = data?.charities || [];

  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(charities.map((c: any) => c.category || 'General')))] as string[];
  }, [charities]);

  const spotlight = charities.find((c: any) => c.isFeatured || c.isSpotlight);
  const rest = charities.filter((c: any) => c._id !== spotlight?._id);

  const filtered = rest.filter((c: any) => {
    const matchSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.shortDescription || c.description || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || (c.category || 'General') === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <section className="border-b border-border">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center lg:px-8 lg:py-24">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold">
            Charities
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Choose where your money goes
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            Every subscription funds real organisations doing meaningful work. Browse our directory and pick the cause that matters to you.
          </p>
        </div>
      </section>

      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1800px] px-5 py-8 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-sm flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
              <input
                type="text"
                placeholder="Search charities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-full border border-border bg-bg py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-ink-soft/50 focus:border-accent-deep focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                    category === cat
                      ? 'bg-accent-deep text-white'
                      : 'bg-surface-sunken text-ink-soft hover:bg-border'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="py-20 text-center text-ink-soft">Loading charities...</div>
      ) : (
        <>
          {spotlight && (
            <section className="border-b border-border">
              <div className="mx-auto max-w-[1800px] px-5 py-12 lg:px-8 lg:py-16">
                <div className="overflow-hidden rounded-[var(--radius-card)] border border-gold/30 bg-surface shadow-[var(--shadow-ambient)]">
                  <div className="grid lg:grid-cols-2">
                    <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto">
                      <img
                        src={spotlight.imageUrl || "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80"}
                        alt={spotlight.name}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-white">
                        <Star size={12} />
                        Spotlight
                      </span>
                    </div>
                    <div className="flex flex-col justify-center p-8 lg:p-12">
                      <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                        Featured charity
                      </p>
                      <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                        {spotlight.name}
                      </h2>
                      <p className="mt-3 text-base leading-relaxed text-ink-soft">
                        {spotlight.description}
                      </p>
                      <div className="mt-5 flex items-center gap-4 text-sm text-ink-soft">
                        <span>{spotlight.category || 'General'}</span>
                        <span>&middot;</span>
                        <span>{spotlight.region || 'Global'}</span>
                        <span>&middot;</span>
                        <span className="font-mono font-semibold text-accent-deep">
                          £{((spotlight.totalRaised || 0) / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })} raised
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          <section>
            <div className="mx-auto max-w-[1800px] px-5 py-12 lg:px-8 lg:py-16">
              {filtered.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((c: any) => (
                    <CharityCard
                      key={c._id}
                      charity={{
                        id: c._id,
                        name: c.name,
                        shortDescription: c.shortDescription || c.description?.slice(0, 80) || "",
                        category: c.category || "General",
                        imageUrl: c.imageUrl || "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80",
                        totalRaised: (c.totalRaised || 0) / 100,
                        isSpotlight: c.isFeatured || false
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center">
                  <p className="text-lg font-medium text-ink">No charities found</p>
                  <p className="mt-1 text-sm text-ink-soft">Try adjusting your search or filters.</p>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      <Footer />
    </div>
  );
}
