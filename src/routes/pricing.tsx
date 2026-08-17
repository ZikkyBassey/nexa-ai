import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { SiteShell } from "@/components/nexa/site-shell";
import { Button } from "@/components/ui/button";

const TITLE = "Pricing — Nexa";
const DESCRIPTION =
  "Nexa pricing: a free tier for everyday exploration and a Pro tier with deeper AI analysis, alerts and API access.";

export const Route = createFileRoute("/pricing")({
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
  component: PricingPage,
});

const PLANS = [
  {
    name: "Free",
    price: "$0",
    note: "For curious explorers",
    features: [
      "Wallet, transaction and token explorer",
      "20 AI questions per day",
      "5 watchlist items",
      "Live Solana mainnet data",
    ],
    cta: "Start exploring",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$29",
    note: "per month, for analysts",
    features: [
      "Unlimited AI investigations",
      "Unlimited watchlist and alerts",
      "Deeper multi-step agent analysis",
      "API access (coming soon)",
    ],
    cta: "Join the waitlist",
    highlight: true,
  },
];

function PricingPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-center text-3xl font-semibold">Simple pricing</h1>
        <p className="mt-2 text-center text-muted-foreground">
          Payments aren't live yet — Pro is a preview of what's coming.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-6 ${
                plan.highlight ? "border-primary/60 bg-card" : "border-border bg-card/60"
              }`}
            >
              <p className="text-sm text-muted-foreground">{plan.name}</p>
              <p className="mt-2 text-3xl font-semibold">{plan.price}</p>
              <p className="text-xs text-muted-foreground">{plan.note}</p>
              <ul className="mt-5 space-y-2 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="mt-6 w-full" variant={plan.highlight ? "default" : "secondary"} asChild>
                <Link to={plan.highlight ? "/auth" : "/explore"}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
