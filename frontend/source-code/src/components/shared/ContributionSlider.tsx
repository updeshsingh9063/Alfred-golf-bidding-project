import { cn } from "../../lib/utils";

interface ContributionSliderProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  monthlyAmount: number;
}

export function ContributionSlider({
  value,
  onChange,
  min = 10,
  monthlyAmount,
}: ContributionSliderProps) {
  const charityAmount = (monthlyAmount * value) / 100;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-ink">
          Charity contribution
        </label>
        <span className="font-mono text-sm font-bold text-rose">
          {value}%
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={80}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          "h-2 w-full cursor-pointer appearance-none rounded-full bg-surface-sunken",
          "[&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5",
          "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full",
          "[&::-webkit-slider-thumb]:bg-rose [&::-webkit-slider-thumb]:shadow-md",
          "[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5",
          "[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0",
          "[&::-moz-range-thumb]:bg-rose [&::-moz-range-thumb]:shadow-md",
        )}
      />

      <div className="flex items-center justify-between text-xs text-ink-soft">
        <span>
          <span className="font-mono font-semibold text-rose">
            £{charityAmount.toFixed(2)}
          </span>{" "}
          / month to charity
        </span>
        <span>
          <span className="font-mono font-semibold text-ink">
            £{(monthlyAmount - charityAmount).toFixed(2)}
          </span>{" "}
          to prize pool
        </span>
      </div>
    </div>
  );
}
