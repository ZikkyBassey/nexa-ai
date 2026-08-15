# Nexa — AI-Powered Solana Explorer (MVP)

An agentic blockchain explorer where people ask questions in plain English and an AI agent
investigates real Solana data, then explains it with the underlying transactions shown as evidence.

## What gets built

### 1. Landing page (`/`)
- Hero: "Understand Blockchain Activity in Plain English." with subtitle and a large AI search box.
- CTAs: "Start Exploring" and "Try an Example".
- Clickable example questions ("What happened in this wallet today?", "Explain this transaction like I'm a beginner", etc.).
- Dark-first, minimal, professional crypto-intelligence styling — no gradient soup.

### 2. Universal search
One input accepts a wallet address, transaction signature, token mint, or a natural-language
question. It classifies the input and routes to the wallet, transaction, token, or chat surface.
Invalid input gets a clear, friendly error.

### 3. Wallet explorer (`/wallet/$address`)
SOL balance, token holdings, recent transactions and transfers, an activity timeline, a portfolio
overview, an AI-generated wallet summary, plus "Ask this wallet" and "Add to watchlist".

### 4. Transaction explorer (`/tx/$signature`)
Status, timestamp, sender, recipients, SOL and token transfers, fee, programs involved,
instructions, and raw JSON in a collapsible panel. An "Explain this transaction" section streams a
beginner-level explanation.

### 5. Token page (`/token/$mint`)
Name, symbol, mint, supply, decimals, holder info where available, recent activity, and
"Ask about this token".

### 6. AI chat (`/chat`)
Persistent conversation with streamed responses and conversation memory. The agent uses tools to
fetch wallet, transaction, and token data, cites in-app links to what it used, separates confirmed
on-chain facts from interpretation, and says plainly when something cannot be verified. It never
invents balances, prices, or addresses.

### 7. Auth + watchlist
Email/password sign-in, then a watchlist of wallets and tokens with recent activity and AI
summaries. Conversations are saved per user.

### 8. Marketing/system pages
- `/explore` — trending and recently viewed entities plus example queries.
- `/pricing` — Free vs Pro tiers, UI only; subscription tables exist so payments can be added later.
- `/api` — placeholder developer docs describing wallet/transaction/token/AI endpoints and future API keys.
- `/alerts` — alert configuration UI (large transfer, new token buy, SOL in/out) backed by real tables;
  the delivery worker is left as a documented TODO.

## Technical notes

- **Stack:** TanStack Start + React + TypeScript + Tailwind, Lovable Cloud for auth and Postgres,
  Lovable AI Gateway for the agent (tool-calling + streaming). No secrets in client code.
- **Data:** live Solana mainnet JSON-RPC, called only from server functions. The RPC endpoint reads
  from a `SOLANA_RPC_URL` env var with a public mainnet default, so a Helius/QuickNode URL can be
  dropped in later. Token metadata comes from on-chain mint + Jupiter's public token list.
- **Chain abstraction:** a `ChainAdapter` interface (`getBalance`, `getTransaction`, `getToken`,
  `getActivity`) with a Solana implementation, so Ethereum/Base can be added without touching UI.
- **Layout:** `src/lib/chains/*` (data services), `src/lib/agent/*` (tools + prompt),
  `src/lib/*.functions.ts` (server functions), `src/components/*` (reusable UI). No hard-coded
  chain data in components.
- **Database:** profiles, watchlists, watched_wallets, watched_tokens, alerts, conversations,
  messages, subscriptions, api_keys, usage — all with RLS scoped to `auth.uid()` and explicit grants.
- **Resilience:** if RPC or the AI key fails, pages fall back to clearly labeled demo data rather
  than breaking; the swap point is a single module.
- **Performance:** skeleton loaders, streamed AI output, paginated transaction lists, cached RPC
  reads via TanStack Query.

## Out of scope for this pass

Real payments, real-time alert delivery, live API key issuance, and Ethereum/Base data — all
stubbed with architecture in place.
