import { createFileRoute } from "@tanstack/react-router";

import { SiteShell } from "@/components/nexa/site-shell";

const TITLE = "Developer API — Nexa";
const DESCRIPTION =
  "Preview of the Nexa developer API: wallet, transaction, token and AI analysis endpoints for Solana data.";

export const Route = createFileRoute("/api")({
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
  component: ApiPage,
});

const ENDPOINTS = [
  { method: "GET", path: "/v1/wallet/:address", body: "Balance, holdings and recent activity." },
  { method: "GET", path: "/v1/tx/:signature", body: "Decoded transaction with transfers and programs." },
  { method: "GET", path: "/v1/token/:mint", body: "Supply, decimals, metadata and top holders." },
  { method: "POST", path: "/v1/ask", body: "Run the Nexa agent on a natural-language question." },
];

function ApiPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-12">
        <div>
          <h1 className="text-3xl font-semibold">Developer API</h1>
          <p className="mt-2 text-muted-foreground">
            The public API is in design. These are the endpoints planned for the first release —
            API key issuance arrives with the Pro tier.
          </p>
        </div>

        <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
          {ENDPOINTS.map((endpoint) => (
            <li key={endpoint.path} className="flex flex-wrap items-center gap-3 p-4 text-sm">
              <span className="rounded-md bg-secondary px-2 py-0.5 text-xs">{endpoint.method}</span>
              <span className="mono">{endpoint.path}</span>
              <span className="w-full text-muted-foreground sm:ml-auto sm:w-auto">
                {endpoint.body}
              </span>
            </li>
          ))}
        </ul>

        <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
          Authentication will use bearer API keys scoped per project, with per-minute rate limits by
          plan.
        </div>
      </div>
    </SiteShell>
  );
}
