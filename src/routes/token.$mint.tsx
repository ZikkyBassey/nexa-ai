import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { ActivityList, SourceBadge, Stat } from "@/components/nexa/data-bits";
import { SiteShell } from "@/components/nexa/site-shell";
import { Button } from "@/components/ui/button";
import { fetchToken } from "@/lib/chain.functions";
import { formatCompact, shortAddress } from "@/lib/format";
import { addToWatchlist } from "@/lib/watchlist";

export const Route = createFileRoute("/token/$mint")({
  loader: ({ params }) => fetchToken({ data: { address: params.mint, chain: "solana" } }),
  head: ({ params }) => {
    const title = `Token ${shortAddress(params.mint, 6)} — Nexa`;
    const description = `Supply, decimals, top holders and recent activity for Solana token ${params.mint}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: TokenPage,
});

function TokenPage() {
  const token = Route.useLoaderData();
  const { mint } = Route.useParams();
  const [saved, setSaved] = useState<string | null>(null);

  return (
    <SiteShell>
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Token</p>
            <h1 className="truncate text-xl font-semibold sm:text-2xl">
              {token.name ?? "Unknown token"}{" "}
              {token.symbol ? (
                <span className="text-muted-foreground">({token.symbol})</span>
              ) : null}
            </h1>
            <p className="mono truncate text-xs text-muted-foreground">{mint}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <SourceBadge meta={token.meta} />
            <Button
              variant="secondary"
              size="sm"
              onClick={async () => setSaved(await addToWatchlist({ kind: "token", address: mint }))}
            >
              Add to watchlist
            </Button>
            <Button size="sm" asChild>
              <Link to="/chat" search={{ q: `Tell me about the Solana token ${mint}` }}>
                Ask about this token
              </Link>
            </Button>
          </div>
        </div>
        {saved ? <p className="text-sm text-muted-foreground">{saved}</p> : null}

        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="Supply" value={formatCompact(token.supply)} />
          <Stat label="Decimals" value={String(token.decimals)} />
          <Stat label="Tracked holders" value={String(token.holders?.length ?? 0)} />
        </div>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground">Top holders</h2>
            {token.holders && token.holders.length > 0 ? (
              <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card text-sm">
                {token.holders.map((holder) => (
                  <li key={holder.address} className="flex items-center gap-3 p-3">
                    <Link
                      to="/wallet/$address"
                      params={{ address: holder.address }}
                      className="mono truncate text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {shortAddress(holder.address, 6)}
                    </Link>
                    <span className="ml-auto whitespace-nowrap">
                      {(holder.share * 100).toFixed(2)}%
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Holder data unavailable.</p>
            )}
          </div>
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground">Recent activity</h2>
            <ActivityList items={token.activity} />
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
