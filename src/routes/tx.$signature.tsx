import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { SourceBadge, Stat } from "@/components/nexa/data-bits";
import { SiteShell } from "@/components/nexa/site-shell";
import { Button } from "@/components/ui/button";
import { fetchTransaction } from "@/lib/chain.functions";
import { formatAmount, formatTime, shortAddress } from "@/lib/format";

export const Route = createFileRoute("/tx/$signature")({
  loader: ({ params }) =>
    fetchTransaction({ data: { signature: params.signature, chain: "solana" } }),
  head: ({ params }) => {
    const title = `Transaction ${shortAddress(params.signature, 6)} — Nexa`;
    const description = `Decoded Solana transaction ${params.signature}: transfers, programs, fees and a plain-English explanation.`;
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
  component: TxPage,
});

function TxPage() {
  const tx = Route.useLoaderData();
  const [showRaw, setShowRaw] = useState(false);

  return (
    <SiteShell>
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Transaction</p>
            <h1 className="mono truncate text-lg font-semibold sm:text-xl">{tx.signature}</h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <SourceBadge meta={tx.meta} />
            <Button size="sm" asChild>
              <Link
                to="/chat"
                search={{ q: `Explain transaction ${tx.signature} like I'm a beginner` }}
              >
                Explain this transaction
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-4">
          <Stat label="Status" value={tx.status === "failed" ? "Failed" : "Success"} />
          <Stat label="Fee" value={`${formatAmount(tx.fee, 6)} ${tx.feeSymbol}`} />
          <Stat label="Slot" value={String(tx.slot)} />
          <Stat label="Time" value={formatTime(tx.blockTime)} />
        </div>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground">Transfers</h2>
            <div className="space-y-2">
              {[...tx.nativeTransfers, ...tx.tokenTransfers].length === 0 ? (
                <p className="text-sm text-muted-foreground">No value transfers detected.</p>
              ) : (
                [...tx.nativeTransfers, ...tx.tokenTransfers].map((leg, i) => (
                  <div
                    key={`${leg.from}-${leg.to}-${i}`}
                    className="flex items-center gap-2 rounded-lg border border-border bg-card p-3 text-sm"
                  >
                    <span className="mono text-muted-foreground">{shortAddress(leg.from)}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="mono text-muted-foreground">{shortAddress(leg.to)}</span>
                    <span className="ml-auto whitespace-nowrap text-primary">
                      {formatAmount(leg.amount)} {leg.symbol}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground">Programs & instructions</h2>
            <div className="flex flex-wrap gap-2">
              {tx.programs.map((program) => (
                <span
                  key={program}
                  className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground"
                >
                  {program}
                </span>
              ))}
            </div>
            <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card text-sm">
              {tx.instructions.map((ix, i) => (
                <li key={i} className="p-3">
                  <p className="font-medium">
                    {ix.program} · <span className="text-muted-foreground">{ix.type}</span>
                  </p>
                  {ix.summary ? (
                    <p className="mono mt-1 break-all text-xs text-muted-foreground">{ix.summary}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="space-y-2">
          <Button variant="secondary" size="sm" onClick={() => setShowRaw((v) => !v)}>
            {showRaw ? "Hide raw JSON" : "Show raw JSON"}
          </Button>
          {showRaw ? (
            <pre className="mono max-h-96 overflow-auto rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground">
              {tx.raw}
            </pre>
          ) : null}
        </section>
      </div>
    </SiteShell>
  );
}
