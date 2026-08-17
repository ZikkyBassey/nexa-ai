import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { ActivityList, SourceBadge, Stat } from "@/components/nexa/data-bits";
import { SiteShell } from "@/components/nexa/site-shell";
import { Button } from "@/components/ui/button";
import { fetchWallet } from "@/lib/chain.functions";
import { formatAmount, shortAddress } from "@/lib/format";
import { addToWatchlist } from "@/lib/watchlist";

export const Route = createFileRoute("/wallet/$address")({
  loader: ({ params }) => fetchWallet({ data: { address: params.address, chain: "solana" } }),
  head: ({ params }) => {
    const title = `Wallet ${shortAddress(params.address, 6)} — Nexa`;
    const description = `Balances, token holdings and recent Solana activity for wallet ${params.address}.`;
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
  component: WalletPage,
});

function WalletPage() {
  const wallet = Route.useLoaderData();
  const { address } = Route.useParams();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);

  async function watch() {
    setSaving(true);
    setSaved(await addToWatchlist({ kind: "wallet", address }));
    setSaving(false);
  }

  return (
    <SiteShell>
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Solana wallet</p>
            <h1 className="mono truncate text-xl font-semibold sm:text-2xl">{address}</h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <SourceBadge meta={wallet.meta} />
            <Button variant="secondary" size="sm" onClick={watch} disabled={saving}>
              {saving ? "Saving…" : "Add to watchlist"}
            </Button>
            <Button size="sm" asChild>
              <Link to="/chat" search={{ q: `Summarise wallet ${address}` }}>
                Ask this wallet
              </Link>
            </Button>
          </div>
        </div>
        {saved ? <p className="text-sm text-muted-foreground">{saved}</p> : null}

        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="SOL balance" value={`${formatAmount(wallet.nativeBalance)} SOL`} />
          <Stat label="Token holdings" value={String(wallet.tokens.length)} />
          <Stat label="Recent transactions" value={String(wallet.activity.length)} />
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground">Activity timeline</h2>
            <ActivityList items={wallet.activity} />
          </div>
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground">Portfolio</h2>
            {wallet.tokens.length === 0 ? (
              <p className="text-sm text-muted-foreground">No SPL tokens held.</p>
            ) : (
              <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
                {wallet.tokens.map((token) => (
                  <li key={token.mint} className="flex items-center gap-3 p-3 text-sm">
                    <Link
                      to="/token/$mint"
                      params={{ mint: token.mint }}
                      className="truncate transition-colors hover:text-primary"
                    >
                      {token.symbol ?? shortAddress(token.mint, 5)}
                    </Link>
                    <span className="ml-auto text-muted-foreground">
                      {formatAmount(token.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
