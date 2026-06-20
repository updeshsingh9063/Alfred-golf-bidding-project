import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "../../lib/auth";

const navLinks = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "Charities", href: "/charities" },
  { label: "Pricing", href: "/pricing" },
  { label: "Trust", href: "/trust" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, role, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border bg-surface shadow-ambient"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 lg:px-8">
        <Link to="/" className="font-display text-2xl font-bold text-ink">
          Alfred
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className="text-base font-medium text-ink-soft transition-colors hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="text-base font-medium text-ink-soft transition-colors hover:text-ink"
              >
                Login
              </Link>
              <Link
                to="/login?mode=signup"
                className="rounded-[999px] bg-accent-deep px-5 py-2.5 text-base font-medium text-white transition-colors hover:bg-accent-deep-hov"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              {role === 'admin' ? (
                <Link
                  to="/admin"
                  className="rounded-[999px] bg-ink px-5 py-2.5 text-base font-medium text-white transition-colors hover:bg-ink-soft"
                >
                  Admin Console
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="rounded-[999px] bg-accent-deep px-5 py-2.5 text-base font-medium text-white transition-colors hover:bg-accent-deep-hov"
                >
                  User Dashboard
                </Link>
              )}
              <button
                onClick={logout}
                className="text-base font-medium text-ink-soft transition-colors hover:text-ink ml-2"
              >
                Log out
              </button>
            </>
          )}
        </div>

        <button
          className="inline-flex items-center justify-center md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-surface px-5 pb-5 md:hidden">
          <nav className="flex flex-col gap-3 pt-4">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <hr className="border-border" />
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-ink-soft"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/login?mode=signup"
                  className="inline-flex w-fit rounded-[999px] bg-accent-deep px-4 py-2 text-sm font-medium text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={role === 'admin' ? "/admin" : "/dashboard"}
                  className="inline-flex w-fit rounded-[999px] bg-accent-deep px-4 py-2 text-sm font-medium text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  {role === 'admin' ? "Admin Console" : "User Dashboard"}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="text-left text-sm font-medium text-ink-soft"
                >
                  Log out
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
