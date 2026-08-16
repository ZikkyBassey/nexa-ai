import { Link } from "@tanstack/react-router";
import { Hexagon } from "lucide-react";
import type { ReactNode } from "react";

import { SearchBar } from "./search-bar";

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
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <Hexagon className="size-5 text-primary" />
            Nexa
          </Link>
          <nav className="order-3 flex w-full gap-4 overflow-x-auto text-sm text-muted-foreground md:order-2 md:w-auto">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="whitespace-nowrap transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="order-2 ml-auto flex items-center gap-2 md:order-3">
            {showSearch ? (
              <div className="hidden w-72 lg:block">
                <SearchBar size="sm" placeholder="Search or ask…" />
              </div>
            ) : null}
            <Link
              to="/auth"
              className="rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-secondary"
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border py-8 text-sm text-muted-foreground">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4">
          <p>Nexa — AI-powered Solana explorer.</p>
          <p>Data from Solana mainnet RPC. Not financial advice.</p>
        </div>
      </footer>
    </div>
  );
}
