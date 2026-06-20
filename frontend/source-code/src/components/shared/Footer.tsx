import { Link } from "react-router-dom";

const footerLinks = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "Charities", href: "/charities" },
  { label: "Pricing", href: "/pricing" },
  { label: "Trust & Transparency", href: "/trust" },
];

export function Footer() {
  return (
    <footer className="bg-accent-deep">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <Link to="/" className="font-display text-xl font-bold text-white">
              Alfred
            </Link>
            <p className="mt-2 max-w-xs text-sm text-white/50">
              The lottery where every ticket gives back. Win prizes, support
              charities.
            </p>
          </div>

          <nav className="flex flex-col gap-2">
            {footerLinks.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                className="text-sm text-white/60 transition-colors hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-2">
            <Link
              to="/charities"
              className="text-sm text-white/60 transition-colors hover:text-white"
            >
              Charity Directory
            </Link>
            <Link
              to="/trust"
              className="text-sm text-white/60 transition-colors hover:text-white"
            >
              Trust & Transparency
            </Link>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} Alfred. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
