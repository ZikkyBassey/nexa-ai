import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Bot, ShieldCheck, Wallet } from "lucide-react";

import { SearchBar } from "@/components/nexa/search-bar";
import { SiteShell } from "@/components/nexa/site-shell";

const TITLE = "Nexa — Understand Solana activity in plain English";
const DESCRIPTION =
  "Ask questions about any Solana wallet, transaction, or token. Nexa's AI agent investigates real on-chain data and explains it in plain English.";

export const Route = createFileRoute("/")({
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
  component: Index,
});

const EXAMPLES = [
  "What happened in this wallet today?",
  "Explain this transaction like I'm a beginner",
  "Is this token distribution concentrated?",
  "Summarise the last 10 swaps for this address",
];

const FEATURES = [
  {
    icon: Wallet,
    title: "Wallet intelligence",
    body: "Balances, token holdings, and an activity timeline with AI summaries of what the wallet actually did.",
  },
  {
    icon: Activity,
    title: "Transaction decoding",
    body: "Programs, instructions, and transfers decoded into a readable story — with raw JSON one click away.",
  },
  {
    icon: Bot,
    title: "Grounded AI agent",
    body: "The agent calls live chain data before answering, and separates confirmed facts from interpretation.",
  },
  {
    icon: ShieldCheck,
    title: "No guessing",
    body: "If something can't be verified on-chain, Nexa says so instead of inventing numbers.",
  },
];

function Index() {
  return (
    <SiteShell showSearch={false}>
      <section className="mx-auto max-w-3xl px-4 pb-16 pt-16 text-center sm:pt-24">
        <span className="inline-flex rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
          Solana mainnet · AI-powered explorer
        </span>
        <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl">
          Understand blockchain activity in plain English.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Paste an address, a signature, or just ask a question. Nexa investigates the chain and
          shows you the transactions behind every answer.
        </p>

        <div className="mt-8">
          <SearchBar />
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {EXAMPLES.map((example) => (
            <Link
              key={example}
              to="/chat"
              search={{ q: example }}
              className="rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              {example}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-20 sm:grid-cols-2">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="rounded-2xl border border-border bg-card p-6 text-left">
            <feature.icon className="size-5 text-primary" />
            <h2 className="mt-3 text-lg font-semibold">{feature.title}</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">{feature.body}</p>
          </div>
        ))}
      </section>
    </SiteShell>
  );
}
