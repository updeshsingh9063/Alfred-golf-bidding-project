import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { cn } from "../../lib/utils";

interface Charity {
  id: string;
  name: string;
  shortDescription: string;
  imageUrl: string;
  category: string;
  totalRaised: number;
  isSpotlight: boolean;
}

interface CharityCardProps {
  charity: Charity;
}

export function CharityCard({ charity }: CharityCardProps) {
  return (
    <Link
      to={`/charities/${charity.id}`}
      className="group flex flex-col overflow-hidden rounded-[12px] border border-border bg-surface shadow-ambient transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-sunken">
        <img
          src={charity.imageUrl}
          alt={charity.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {charity.isSpotlight && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-[999px] bg-gold px-2.5 py-0.5 text-xs font-semibold text-white">
            <Star className="h-3 w-3" />
            Spotlight
          </span>
        )}
        <span className="absolute top-3 right-3 rounded-[999px] bg-ink/60 px-2.5 py-0.5 text-[10px] font-medium text-white">
          {charity.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-base font-semibold text-ink">
          {charity.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-ink-soft">
          {charity.shortDescription}
        </p>
        <div className="mt-auto pt-3">
          <p className={cn(
            "font-mono text-sm font-semibold",
            charity.isSpotlight ? "text-gold" : "text-accent-deep",
          )}>
            £{charity.totalRaised.toLocaleString()} raised
          </p>
        </div>
      </div>
    </Link>
  );
}
