import { createFileRoute, Link } from "@tanstack/react-router";

import { SearchBar } from "@/components/nexa/search-bar";
import { SiteShell } from "@/components/nexa/site-shell";

const TITLE = "Explore Solana — Nexa";
const DESCRIPTION =
  "Jump into well-known Solana tokens and programs, or start from an example question and let the Nexa agent investigate.";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ExplorePage,
});

const TOKENS = [
  { mint: "So11111111111111111111111111111111111111112", label: "Wrapped SOL" },
  { mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", label: "USDC" },
  { mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", label: "USDT" },
  { mint: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN", label: "Jupiter (JUP)" },
];

const QUESTIONS = [
  "What are the most common program interactions on Solana?",
  "How do I read a Solana swap transaction?",
  "What does a failed transaction usually mean?",
];

function ExplorePage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-4xl space-y-8 px-4 py-10">
        <div>
          <h1 className="text-2xl font-semibold">Explore</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Start from a known token, or ask anything.
          </p>
        </div>

        <SearchBar />

        <section>
          <h2 className="text-sm font-medium text-muted-foreground">Popular tokens</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {TOKENS.map((token) => (
              <Link
                key={token.mint}
                to="/token/$mint"
                params={{ mint: token.mint }}
                className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/50"
              >
                <p className="font-medium">{token.label}</p>
                <p className="mono truncate text-xs text-muted-foreground">{token.mint}</p>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium text-muted-foreground">Example questions</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {QUESTIONS.map((question) => (
              <Link
                key={question}
                to="/chat"
                search={{ q: question }}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {question}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
