import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  Bell,
  Bot,
  Layers,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";

import { SearchBar } from "@/components/nexa/search-bar";
import { SiteShell } from "@/components/nexa/site-shell";

const TITLE = "Nexa — Understand Solana activity in plain English";
const DESCRIPTION =
  "Ask questions about any Solana wallet, transaction, or token. Nexa's AI agent investigates real on-chain data and explains it in plain English, with citations.";

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

const TICKER = [
  "SOL transfers decoded",
  "Jupiter swaps",
  "SPL token holders",
  "Program instructions",
  "Failed tx reasons",
  "Wallet net flow",
  "Mint authority checks",
  "Whale movements",
];

const STEPS = [
  {
    n: "01",
    title: "Ask in plain language",
    body: "Paste an address or signature, or type a question the way you'd ask a friend.",
  },
  {
    n: "02",
    title: "The agent pulls chain data",
    body: "Nexa calls live RPC for balances, transfers, instructions and holders before it writes a word.",
  },
  {
    n: "03",
    title: "Answer with receipts",
    body: "Every claim links back to the wallet, token or transaction it came from. Verify in one click.",
  },
];

function Index() {
  return (
    <SiteShell showSearch={false}>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 aurora" />
        <div className="pointer-events-none absolute inset-0 grid-bg" />

        <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-16 sm:pt-24">
          <div className="mx-auto max-w-3xl text-center rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
              <span className="size-1.5 rounded-full bg-primary live-dot" />
              Solana mainnet · grounded AI agent
            </span>

            <h1 className="mt-6 font-display text-[2.6rem] font-semibold leading-[1.05] sm:text-6xl">
              The blockchain,
              <br />
              <span className="text-gradient">explained like a human.</span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
              Nexa reads wallets, transactions and tokens for you — then answers your questions with
              the on-chain evidence attached.
            </p>

            <div className="mx-auto mt-8 max-w-2xl glow-ring rounded-2xl">
              <SearchBar />
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {EXAMPLES.map((example) => (
                <Link
                  key={example}
                  to="/chat"
                  search={{ q: example }}
                  className="rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  {example}
                </Link>
              ))}
            </div>
          </div>

          {/* Product preview */}
          <div className="relative mx-auto mt-14 max-w-4xl">
            <div className="glass overflow-hidden rounded-2xl">
              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                <span className="size-2.5 rounded-full bg-destructive/70" />
                <span className="size-2.5 rounded-full bg-warning/70" />
                <span className="size-2.5 rounded-full bg-primary/70" />
                <span className="mono ml-3 text-xs text-muted-foreground">nexa / investigate</span>
              </div>
              <div className="grid gap-px bg-border md:grid-cols-[1.15fr_1fr]">
                <div className="space-y-3 bg-card p-5 text-left">
                  <p className="mono text-xs text-muted-foreground">you</p>
                  <p className="text-sm">What did this wallet do in the last 24 hours?</p>
                  <p className="mono pt-2 text-xs text-primary">nexa</p>
                  <p className="text-sm text-muted-foreground">
                    It made <span className="text-foreground">7 transactions</span>: 4 swaps on
                    Jupiter, 2 SOL transfers out and 1 failed instruction. Net flow is{" "}
                    <span className="text-destructive">−12.48 SOL</span>.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {["tx 5Kq…8fN", "tx 2Ab…91x", "wallet 7xK…dQ2"].map((cite) => (
                      <span
                        key={cite}
                        className="mono rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] text-primary"
                      >
                        {cite}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-3 bg-card p-5 text-left">
                  {[
                    { k: "Balance", v: "184.22 SOL" },
                    { k: "Tokens held", v: "14" },
                    { k: "24h transactions", v: "7" },
                    { k: "Success rate", v: "86%" },
                  ].map((row) => (
                    <div key={row.k} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{row.k}</span>
                      <span className="mono">{row.v}</span>
                    </div>
                  ))}
                  <div className="h-16 rounded-lg bg-gradient-to-t from-primary/25 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ticker */}
      <div className="relative overflow-hidden border-y border-border/70 py-3">
        <div className="marquee-track flex w-max gap-8 whitespace-nowrap text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {[...TICKER, ...TICKER].map((item, i) => (
            <span key={`${item}-${i}`} className="flex items-center gap-8">
              {item}
              <span className="size-1 rounded-full bg-primary/60" />
            </span>
          ))}
        </div>
      </div>

      {/* Bento */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="max-w-2xl font-display text-3xl font-semibold sm:text-4xl">
          One surface for everything happening on-chain.
        </h2>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Explorer-grade data with an analyst sitting on top of it.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <BentoCard
            className="md:col-span-2"
            icon={Bot}
            title="Grounded AI agent"
            body="The agent calls live chain tools before answering and separates confirmed facts from interpretation. If it can't verify something, it says so."
            to="/chat"
          />
          <BentoCard icon={Wallet} title="Wallet intelligence" body="Balances, holdings and an activity timeline that reads like a story." to="/explore" />
          <BentoCard icon={Activity} title="Transaction decoding" body="Programs, instructions and transfers, with raw JSON one click away." to="/explore" />
          <BentoCard icon={Layers} title="Token X-ray" body="Supply, metadata and top holders — concentration risk at a glance." to="/explore" />
          <BentoCard icon={Bell} title="Watchlist & alerts" body="Save the addresses you care about and pick up where you left off." to="/watchlist" />
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border/70 bg-card/30">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="grid gap-10 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.n}>
                <span className="mono text-sm text-primary">{step.n}</span>
                <h3 className="mt-3 font-display text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-20 sm:grid-cols-3">
        {[
          { icon: ShieldCheck, title: "No invented numbers", body: "Unverifiable claims are labelled, never guessed." },
          { icon: Sparkles, title: "Citations by default", body: "Each answer links to the exact entities it used." },
          { icon: Activity, title: "Live or clearly demo", body: "When RPC is unavailable, data is flagged as demo." },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-border bg-card p-6">
            <item.icon className="size-5 text-primary" />
            <h3 className="mt-3 font-display text-lg font-semibold">{item.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{item.body}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-4">
        <div className="relative overflow-hidden rounded-3xl border border-primary/25 p-10 text-center">
          <div className="pointer-events-none absolute inset-0 aurora opacity-80" />
          <div className="relative">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">
              Ask your first question in 10 seconds.
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              No wallet connection, no setup. Just paste something and see what Nexa finds.
            </p>
            <Link
              to="/chat"
              search={{ q: undefined }}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Open the AI investigator
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function BentoCard({
  icon: Icon,
  title,
  body,
  to,
  className = "",
}: {
  icon: typeof Bot;
  title: string;
  body: string;
  to: string;
  className?: string;
}) {
  return (
    <Link
      to={to}
      className={`card-hover group flex flex-col rounded-2xl border border-border bg-card p-6 ${className}`}
    >
      <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/12 text-primary">
        <Icon className="size-5" />
      </span>
      <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100">
        Open <ArrowRight className="size-3" />
      </span>
    </Link>
  );
}
