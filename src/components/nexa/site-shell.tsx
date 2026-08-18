import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState, type ReactNode } from "react";

import { SearchBar } from "./search-bar";
import { NexaMark } from "./nexa-mark";

const NAV = [
  { to: "/explore", label: "Explore" },
  { to: "/chat", label: "AI Chat" },
  { to: "/watchlist", label: "Watchlist" },
  { to: "/pricing", label: "Pricing" },
  { to: "/api", label: "API" },
] as const;

export function SiteShell({
  children,
  showSearch = true,
}: {
  children: ReactNode;
  showSearch?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-display text-[17px] font-semibold tracking-tight">
            <NexaMark className="size-7" />
            Nexa
          </Link>

          <nav className="ml-4 hidden items-center gap-1 rounded-full border border-border/70 bg-card/50 p-1 text-sm text-muted-foreground md:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-full px-3 py-1.5 transition-colors hover:text-foreground"
                activeProps={{ className: "bg-secondary text-foreground" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {showSearch ? (
              <div className="hidden w-64 xl:block">
                <SearchBar size="sm" placeholder="Search or ask…" />
              </div>
            ) : null}
            <Link
              to="/auth"
              className="hidden rounded-full border border-border px-4 py-1.5 text-sm transition-colors hover:bg-secondary sm:inline-flex"
            >
              Sign in
            </Link>
            <Link
              to="/chat"
              className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Try the agent
            </Link>
            <button
              type="button"
              aria-label="Toggle navigation"
              onClick={() => setOpen((v) => !v)}
              className="rounded-full border border-border p-2 md:hidden"
            >
              <Menu className="size-4" />
            </button>
          </div>
        </div>

        {open ? (
          <nav className="border-t border-border bg-background px-4 py-3 text-sm md:hidden">
            <div className="grid gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
              <Link to="/auth" onClick={() => setOpen(false)} className="rounded-lg px-2 py-2 text-muted-foreground">
                Sign in
              </Link>
            </div>
          </nav>
        ) : null}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-16 border-t border-border/70">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-display font-semibold">
              <NexaMark className="size-6" />
              Nexa
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              An AI investigator for Solana. Every answer is grounded in transactions you can open
              and verify yourself.
            </p>
          </div>
          <FooterCol
            title="Product"
            links={[
              { to: "/explore", label: "Explore" },
              { to: "/chat", label: "AI Chat" },
              { to: "/watchlist", label: "Watchlist" },
            ]}
          />
          <FooterCol
            title="Developers"
            links={[
              { to: "/api", label: "API" },
              { to: "/pricing", label: "Pricing" },
            ]}
          />
          <FooterCol
            title="Account"
            links={[
              { to: "/auth", label: "Sign in" },
              { to: "/watchlist", label: "Saved items" },
            ]}
          />
        </div>
        <div className="border-t border-border/70 py-5">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} Nexa. Solana mainnet data.</p>
            <p>Not financial advice.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { to: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{title}</p>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map((link) => (
          <li key={link.label}>
            <Link to={link.to} className="text-muted-foreground transition-colors hover:text-foreground">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
