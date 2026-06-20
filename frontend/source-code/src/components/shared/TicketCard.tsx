import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface TicketCardProps {
  scores?: number[];
  status?: "active" | "won" | "pending" | "empty";
  title?: string;
  subtitle?: string;
  className?: string;
}

export function TicketCard({
  scores = [],
  status = "empty",
  title,
  subtitle,
  className,
}: TicketCardProps) {
  const isWon = status === "won";
  const isPending = status === "pending";
  const isActive = status === "active";

  return (
    <motion.div
      animate={
        isPending
          ? { boxShadow: ["0 8px 30px rgba(21,24,28,0.06)", "0 8px 30px rgba(27,74,71,0.15)", "0 8px 30px rgba(21,24,28,0.06)"] }
          : {}
      }
      transition={isPending ? { duration: 2, repeat: Infinity } : {}}
      className={cn(
        "relative flex items-stretch overflow-hidden",
        "rounded-l-[24px] rounded-r-[12px]",
        "bg-surface shadow-ambient",
        "border border-border",
        isWon && "border-gold bg-gold-soft/30",
        className,
      )}
    >
      <div className="flex flex-1 flex-col justify-center px-6 py-5">
        {title && (
          <p className={cn(
            "font-display text-lg font-semibold tracking-tight",
            isWon ? "text-gold" : "text-ink",
          )}>
            {title}
          </p>
        )}
        {subtitle && (
          <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>
        )}

        <div className="mt-4 flex flex-wrap gap-3">
          {scores.length > 0 ? (
            scores.map((n, i) => (
              <span
                key={i}
                className={cn(
                  "inline-flex h-10 w-10 items-center justify-center rounded-full font-mono text-base font-semibold",
                  isWon
                    ? "bg-gold text-white"
                    : isActive
                      ? "bg-accent-deep text-white"
                      : "bg-surface-sunken text-ink-soft",
                )}
              >
                {n}
              </span>
            ))
          ) : (
            <span className="text-xs italic text-ink-soft/60">No numbers selected</span>
          )}
        </div>
      </div>

      <div className="relative flex w-16 shrink-0 items-center justify-center border-l border-dashed border-border">
        <div className="pointer-events-none absolute -top-3 -right-3 h-6 w-6 rounded-full bg-bg" />
        <div className="pointer-events-none absolute -bottom-3 -right-3 h-6 w-6 rounded-full bg-bg" />

        {isWon && (
          <span className="font-display text-xs font-bold text-gold">WON</span>
        )}
        {isPending && (
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="font-mono text-[10px] font-medium text-ink-soft"
          >
            ...
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}
