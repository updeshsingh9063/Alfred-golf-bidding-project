import { useState, useEffect } from "react";

interface DrawCountdownProps {
  targetDate: string;
}

function calcRemaining(target: string) {
  const diff = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export function DrawCountdown({ targetDate }: DrawCountdownProps) {
  const [time, setTime] = useState(calcRemaining(targetDate));

  useEffect(() => {
    const id = setInterval(() => setTime(calcRemaining(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const segments: { label: string; value: number }[] = [
    { label: "Days", value: time.days },
    { label: "Hrs", value: time.hours },
    { label: "Min", value: time.minutes },
    { label: "Sec", value: time.seconds },
  ];

  return (
    <div className="inline-flex items-center gap-1 rounded-[12px] bg-accent-deep px-3 py-2">
      {segments.map((s, i) => (
        <div key={s.label} className="flex items-center gap-1">
          {i > 0 && (
            <span className="font-mono text-sm font-bold text-white/40">:</span>
          )}
          <div className="flex flex-col items-center">
            <span className="font-mono text-lg font-bold leading-none text-white">
              {String(s.value).padStart(2, "0")}
            </span>
            <span className="mt-0.5 text-[9px] font-medium uppercase tracking-wider text-white/50">
              {s.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
