# Nexa AI

Build a production-quality MVP of an AI-powered crypto explorer called “Nexa” (name can be changed later).

CORE IDEA:

Nexa is an agentic blockchain explorer. Instead of forcing users to understand raw blockchain data, users can ask questions in natural language and the AI agent investigates blockchain data and explains the answer clearly.

PRIMARY TARGET:

Start with Solana. Architect the backend so Ethereum/Base can be added later.

MAIN USER EXPERIENCE:

The homepage should immediately show a large AI search box:

“Ask anything about a wallet, transaction, token or address…”

Example prompts:

- “What happened in this wallet today?”

- “Explain this transaction like I’m a beginner.”

- “What tokens did this wallet buy recently?”

- “Show me the biggest transactions from this wallet.”

- “What is this token?”

- “Compare these two wallets.”

FEATURES:

1. AI BLOCKCHAIN AGENT

Create an agent that:

- Understands natural-language blockchain questions.

- Detects wallet addresses, transaction signatures and token addresses.

- Retrieves the relevant blockchain data.

- Analyzes the data.

- Gives a concise human-readable answer.

- Shows the underlying transactions/data used to reach the answer.

- Never invents blockchain information.

- Clearly says when data cannot be verified.

2. WALLET EXPLORER

When a wallet address is entered, display:

- SOL balance

- Token holdings

- Recent transactions

- Recent transfers

- Wallet activity timeline

- Basic portfolio overview

- AI-generated wallet summary

Add:

“Ask this wallet” button.

3. TRANSACTION EXPLORER

For a transaction signature, display:

- Status

- Timestamp

- Sender

- Recipients

- SOL transferred

- Tokens transferred

- Fees

- Programs involved

- Instructions

- Raw blockchain details

Add an AI section:

“Explain this transaction”

The explanation should use simple language such as:

“You swapped approximately X SOL for Y tokens through [program]. The transaction fee was X SOL.”

4. TOKEN PAGE

For a token address, show:

- Token name

- Symbol

- Mint address

- Supply

- Decimals

- Holder information where available

- Recent transactions

- Basic market information if an API is connected

Add:

“Ask about this token”

5. AI CHAT

Create a persistent chat interface where users can ask follow-up questions.

Example:

User:

“What happened to this wallet?”

Agent:

“Today it received 4.2 SOL and swapped 2.1 SOL for TOKEN X.”

User:

“Who did it receive the SOL from?”

Agent:

“Wallet ABC... sent 4.2 SOL at 14:32 UTC.”

The agent should maintain context during the conversation.

6. WALLET WATCHLIST

Allow users to save wallets and tokens.

Users can later view:

- Recent activity

- Important movements

- AI-generated summaries

For the MVP, use authentication and a database.

7. ALERTS

Create the architecture for wallet alerts.

Examples:

- Large transfer

- New token purchase

- SOL received

- SOL sent

Allow users to configure alerts, but if real-time notifications require infrastructure that is not available, implement the UI and backend structure with clear TODOs.

8. SEARCH

Create a universal search bar that accepts:

- Wallet addresses

- Transaction signatures

- Token addresses

- Natural-language questions

Automatically determine what the user entered and route it appropriately.

9. UI/UX

Design should feel like a modern professional crypto intelligence platform.

Style:

- Dark-first interface

- Minimal

- Fast

- Professional

- Responsive

- Mobile-friendly

- Excellent typography

- Subtle animations

- Clear cards and data visualization

- Avoid unnecessary gradients and visual clutter

Navigation:

- Home

- Explore

- Wallets

- Tokens

- Watchlist

- Alerts

- API

- Pricing

10. PRICING

Create a pricing page with:

FREE:

- Basic explorer

- Limited AI queries

- Basic wallet tracking

PRO:

- More AI queries

- Advanced wallet analysis

- More watchlists

- Advanced alerts

- Export reports

Do NOT implement real payments unless payment credentials are provided. Build the pricing UI and subscription architecture so Stripe can be added later.

11. API

Create an API section explaining that developers can access:

- Wallet data

- Transaction data

- Token data

- AI analysis

Create placeholder API documentation and architecture for future API keys and usage limits.

12. BACKEND

Use a clean architecture.

Recommended stack:

- React/Next.js

- TypeScript

- Tailwind CSS

- Supabase for authentication/database

- Solana RPC provider/API

- LLM API for the AI agent

Keep all API keys server-side.

Use environment variables for:

SOLANA_RPC_URL

LLM_API_KEY

SUPABASE_URL

SUPABASE_ANON_KEY

Do not expose secrets in frontend code.

13. IMPORTANT AGENT RULES

The AI must:

- Ground answers in retrieved blockchain data.

- Never fabricate wallet balances, transactions, prices or addresses.

- Cite/link to the relevant transaction or wallet page inside the app.

- Distinguish between confirmed facts and AI interpretation.

- Handle invalid addresses gracefully.

- Handle missing data gracefully.

- Show loading states while investigating.

14. LANDING PAGE COPY

Hero:

“Understand Blockchain Activity in Plain English.”

Subtitle:

“An AI-powered blockchain explorer that investigates wallets, transactions and tokens for you.”

CTA:

“Start Exploring”

Secondary CTA:

“Try an Example”

Below the hero, show example questions users can click.

15. DEMO MODE

If API credentials are not available, create a realistic demo mode using clearly labeled mock blockchain data.

Make it extremely easy to replace mock data with real Solana APIs later.

16. DATABASE

Create tables/structures for:

- users

- watchlists

- watched_wallets

- watched_tokens

- alerts

- conversations

- messages

- subscriptions

- API_keys

- usage

17. SECURITY

Implement:

- Server-side API calls

- Environment variables

- Authentication

- Basic rate limiting architecture

- Input validation

- No private keys or seed phrases

- Never request or store users' private keys

18. PERFORMANCE

Prioritize:

- Fast search

- Streaming AI responses

- Skeleton loaders

- Caching where appropriate

- Pagination for transactions

- Lazy loading

19. MVP PRIORITY

Do NOT overbuild.

The first working version must prioritize:

1. Search

2. Solana wallet lookup

3. Transaction lookup

4. AI transaction explanation

5. AI wallet summary

6. AI chat

7. Basic authentication

8. Watchlist

9. Clean responsive UI

Build these features fully before adding advanced features.

20. IMPORTANT DEVELOPMENT REQUIREMENT

Create reusable components and a clean folder structure.

Do not hard-code blockchain data throughout the UI.

Separate:

- UI

- blockchain data services

- AI agent logic

- database

- authentication

- API routes

Include clear comments showing where real Solana RPC/API credentials need to be connected.

Before finishing, make sure:

- The app runs without errors.

- All navigation works.

- Search works in demo mode.

- Wallet and transaction pages work with demo data.

- AI chat works with a clearly marked mock/fallback response if no LLM key is configured.

- The design is polished and responsive.

- No secret keys are exposed client-side.

Build the MVP now, focusing on a polished experience rather than a huge number of features.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3f4d8da2-fd48-461f-a323-c85eb99de408).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
