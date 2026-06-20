import { cn } from "../../lib/utils";

interface StatusPillProps {
  status: string;
  variant?: "default" | "success" | "warning" | "danger" | "gold";
}

const variantStyles: Record<string, string> = {
  default: "bg-surface-sunken text-ink-soft",
  success: "bg-success/10 text-success",
  warning: "bg-gold-soft text-gold",
  danger: "bg-danger/10 text-danger",
  gold: "bg-gold-soft text-gold",
};

export function StatusPill({ status, variant = "default" }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[999px] px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
      )}
    >
      {status}
    </span>
  );
}
