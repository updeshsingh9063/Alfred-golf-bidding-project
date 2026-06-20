import { Link } from "react-router-dom";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-sunken text-ink-soft">
        {icon}
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold text-ink">
        {title}
      </h3>
      <p className="mt-1 max-w-sm text-sm text-ink-soft">{description}</p>
      {action && action.href && (
        <Link
          to={action.href}
          className="mt-5 inline-flex rounded-[999px] bg-accent-deep px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-deep-hov"
        >
          {action.label}
        </Link>
      )}
      {action && action.onClick && (
        <button
          onClick={action.onClick}
          className="mt-5 inline-flex rounded-[999px] bg-accent-deep px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-deep-hov"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
