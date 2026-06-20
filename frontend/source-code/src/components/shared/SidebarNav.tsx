import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../lib/utils";
import { useAuth } from "../../lib/auth";

interface SidebarItem {
  label: string;
  href: string;
  icon: ReactNode;
}

interface SidebarNavProps {
  items: SidebarItem[];
  activePath: string;
  title: string;
  variant?: "dashboard" | "admin";
}

export function SidebarNav({
  items,
  activePath,
  title,
  variant = "dashboard",
}: SidebarNavProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 inline-flex items-center justify-center rounded-lg bg-surface p-2 shadow-ambient md:hidden"
        onClick={() => setCollapsed(!collapsed)}
        aria-label="Toggle sidebar"
      >
        {collapsed ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <aside
        className={cn(
          "fixed top-0 left-0 z-40 flex h-full w-64 flex-col border-r border-border bg-surface transition-transform duration-300",
          "md:translate-x-0",
          collapsed ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center border-b border-border px-5">
          <Link to="/" className="font-display text-lg font-bold text-ink">
            {title}
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="flex flex-col gap-1">
            {items.map((item) => {
              const isActive = activePath === item.href || activePath.startsWith(item.href + "/");
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={cn(
                      "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-accent-deep/5 text-accent-deep"
                        : "text-ink-soft hover:bg-surface-sunken hover:text-ink",
                    )}
                  >
                    {isActive && (
                      <span className="absolute top-1.5 bottom-1.5 left-0 w-[3px] rounded-r-full bg-accent-deep" />
                    )}
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-border px-3 py-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-surface-sunken hover:text-ink"
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center">
              <LogOut size={16} />
            </span>
            Log out
          </button>
          <p className="mt-2 px-3 text-[10px] font-medium uppercase tracking-wider text-ink-soft/50">
            {variant === "admin" ? "Admin Panel" : "Dashboard"}
          </p>
        </div>
      </aside>

      {collapsed && (
        <div
          className="fixed inset-0 z-30 bg-ink/20 md:hidden"
          onClick={() => setCollapsed(false)}
        />
      )}
    </>
  );
}
