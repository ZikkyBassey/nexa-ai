/**
 * Clearly-labelled demo data.
 *
 * Only used when the live Solana RPC is unreachable (rate-limited public
 * endpoint, network error). Everything returned carries meta.source = "demo"
 * so the UI can badge it. Replace nothing here to go live — set SOLANA_RPC_URL
 * to a dedicated provider (Helius / QuickNode / Triton) instead.
 */
import type {
  ActivityItem,
  TokenDetail,
  TransactionDetail,
  WalletOverview,
} from "./types";

const now = () => Math.floor(Date.now() / 1000);

function demoActivity(seed: string): ActivityItem[] {
  const kinds = ["Swap", "Transfer", "Token transfer", "Stake", "Unknown"];
  return Array.from({ length: 8 }, (_, i) => ({
    signature: `${seed.slice(0, 8)}Demo${"1".repeat(40)}${i}`,
    slot: 300_000_000 - i * 137,
    blockTime: now() - i * 3600,
    status: i === 5 ? ("failed" as const) : ("success" as const),
    fee: 0.000005,
    kind: kinds[i % kinds.length]!,
    netChange: [4.2, -2.1, 0.35, -0.02, 1.05, 0, -0.5, 0.12][i] ?? 0,
    programs: ["System Program", "Token Program"],
  }));
}

export function demoWallet(address: string): WalletOverview {
  return {
    chain: "solana",
    address,
    nativeSymbol: "SOL",
    nativeBalance: 18.4213,
    tokens: [
      {
        mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        symbol: "USDC",
        name: "USD Coin",
        amount: 1240.55,
        decimals: 6,
        uiAmountString: "1240.55",
      },
      {
        mint: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
        symbol: "JUP",
        name: "Jupiter",
        amount: 3120.0,
        decimals: 6,
        uiAmountString: "3120",
      },
    ],
    activity: demoActivity(address),
    meta: {
      source: "demo",
      note: "Live RPC unavailable — showing labelled demo data.",
      fetchedAt: new Date().toISOString(),
    },
  };
}

export function demoTransaction(signature: string): TransactionDetail {
  return {
    chain: "solana",
    signature,
    status: "success",
    slot: 299_881_204,
    blockTime: now() - 5400,
    fee: 0.000005,
    feeSymbol: "SOL",
    signer: "DemoWa11et1111111111111111111111111111111111",
    accounts: [
      "DemoWa11et1111111111111111111111111111111111",
      "DemoPoo1111111111111111111111111111111111111",
    ],
    programs: ["Jupiter Aggregator v6", "Token Program", "System Program"],
    instructions: [
      { program: "Jupiter Aggregator v6", type: "route", summary: "Swap SOL for USDC" },
      { program: "Token Program", type: "transfer", summary: "Transfer 210.44 USDC" },
    ],
    nativeTransfers: [
      {
        from: "DemoWa11et1111111111111111111111111111111111",
        to: "DemoPoo1111111111111111111111111111111111111",
        amount: 2.1,
        symbol: "SOL",
      },
    ],
    tokenTransfers: [
      {
        from: "DemoPoo1111111111111111111111111111111111111",
        to: "DemoWa11et1111111111111111111111111111111111",
        amount: 210.44,
        symbol: "USDC",
        mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      },
    ],
    logs: ["Program Jupiter invoke [1]", "Program log: route", "Program Jupiter success"],
    raw: { demo: true },
    meta: {
      source: "demo",
      note: "Live RPC unavailable — showing labelled demo data.",
      fetchedAt: new Date().toISOString(),
    },
  };
}

export function demoToken(mint: string): TokenDetail {
  return {
    chain: "solana",
    mint,
    name: "Demo Token",
    symbol: "DEMO",
    decimals: 6,
    supply: 1_000_000_000,
    holders: [
      { address: "DemoHo1der11111111111111111111111111111111", amount: 120_000_000, share: 0.12 },
      { address: "DemoHo1der22222222222222222222222222222222", amount: 80_000_000, share: 0.08 },
    ],
    activity: demoActivity(mint),
    meta: {
      source: "demo",
      note: "Live RPC unavailable — showing labelled demo data.",
      fetchedAt: new Date().toISOString(),
    },
  };
}
