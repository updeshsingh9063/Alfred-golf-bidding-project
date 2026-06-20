import { cn } from "../../lib/utils";

interface PrizePoolBarProps {
  prizePercent?: number;
  charityPercent?: number;
  platformPercent?: number;
}

export function PrizePoolBar({
  prizePercent = 40,
  charityPercent = 35,
  platformPercent = 25,
}: PrizePoolBarProps) {
  const segments = [
    { label: "Prize Pool", value: prizePercent, color: "bg-accent-deep" },
    { label: "Charity", value: charityPercent, color: "bg-rose" },
    { label: "Platform", value: platformPercent, color: "bg-surface-sunken" },
  ];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex h-4 w-full overflow-hidden rounded-full">
        {segments.map((s) => (
          <div
            key={s.label}
            className={cn("transition-all duration-500", s.color)}
            style={{ width: `${s.value}%` }}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-4">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <span className={cn("h-2.5 w-2.5 rounded-full", s.color)} />
            <span className="text-xs text-ink-soft">
              {s.label}{" "}
              <span className="font-mono font-semibold text-ink">
                {s.value}%
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
