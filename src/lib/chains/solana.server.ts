/**
 * Solana chain adapter — SERVER ONLY.
 *
 * Talks to a Solana JSON-RPC endpoint. The endpoint is read from the
 * SOLANA_RPC_URL environment variable at call time.
 *
 * >>> CONNECT REAL CREDENTIALS HERE <<<
 * The default below is the free public mainnet endpoint. It is heavily rate
 * limited and does not support every method. For production set SOLANA_RPC_URL
 * to a dedicated provider URL, e.g.
 *   https://mainnet.helius-rpc.com/?api-key=YOUR_KEY
 *   https://your-endpoint.quiknode.pro/YOUR_KEY/
 * Nothing else in the codebase needs to change.
 */
import { demoToken, demoTransaction, demoWallet } from "./demo";
import { isSolanaAddress, isSolanaSignature } from "./detect";
import type {
  ActivityItem,
  ChainAdapter,
  TokenDetail,
  TokenHolding,
  TransactionDetail,
  TransferLeg,
  WalletOverview,
} from "./types";

const DEFAULT_RPC = "https://api.mainnet-beta.solana.com";
const LAMPORTS = 1_000_000_000;
const TOKEN_PROGRAM = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";

const PROGRAM_NAMES: Record<string, string> = {
  "11111111111111111111111111111111": "System Program",
  TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA: "Token Program",
  TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb: "Token-2022 Program",
  ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL: "Associated Token Program",
  ComputeBudget111111111111111111111111111111: "Compute Budget",
  JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4: "Jupiter Aggregator v6",
  whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc: "Orca Whirlpools",
  "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8": "Raydium AMM v4",
  Stake11111111111111111111111111111111111111: "Stake Program",
  Vote111111111111111111111111111111111111111: "Vote Program",
};

function programName(id: string): string {
  return PROGRAM_NAMES[id] ?? id;
}

function rpcUrl(): string {
  return process.env["SOLANA_RPC_URL"] || DEFAULT_RPC;
}

interface RpcCall {
  method: string;
  params: unknown[];
}

async function rpc<T>(call: RpcCall): Promise<T> {
  const res = await fetch(rpcUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, ...call }),
  });
  if (!res.ok) throw new Error(`Solana RPC ${res.status}`);
  const json = (await res.json()) as { result?: T; error?: { message: string } };
  if (json.error) throw new Error(json.error.message);
  return json.result as T;
}

async function rpcBatch<T>(calls: RpcCall[]): Promise<(T | null)[]> {
  if (calls.length === 0) return [];
  const res = await fetch(rpcUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(calls.map((c, i) => ({ jsonrpc: "2.0", id: i, ...c }))),
  });
  if (!res.ok) throw new Error(`Solana RPC ${res.status}`);
  const json = (await res.json()) as { id: number; result?: T }[];
  const out: (T | null)[] = calls.map(() => null);
  for (const entry of json) out[entry.id] = entry.result ?? null;
  return out;
}

/** Token metadata (name/symbol/logo) from Jupiter's public token API. */
async function tokenMeta(mint: string): Promise<{ name?: string; symbol?: string; logoURI?: string }> {
  try {
    const res = await fetch(`https://tokens.jup.ag/token/${mint}`);
    if (!res.ok) return {};
    const json = (await res.json()) as { name?: string; symbol?: string; logoURI?: string } | null;
    return json ?? {};
  } catch {
    return {};
  }
}

const liveMeta = () => ({ source: "live" as const, fetchedAt: new Date().toISOString() });

/* ------------------------------------------------------------------ */
/* Transaction parsing                                                 */
/* ------------------------------------------------------------------ */

interface ParsedTx {
  slot: number;
  blockTime: number | null;
  transaction: {
    signatures: string[];
    message: {
      accountKeys: { pubkey: string; signer: boolean }[];
      instructions: { program?: string; programId: string; parsed?: { type?: string; info?: Record<string, unknown> } }[];
    };
  };
  meta: {
    err: unknown;
    fee: number;
    preBalances: number[];
    postBalances: number[];
    preTokenBalances?: TokenBalanceEntry[];
    postTokenBalances?: TokenBalanceEntry[];
    logMessages?: string[];
    innerInstructions?: { instructions: { programId: string }[] }[];
  } | null;
}

interface TokenBalanceEntry {
  accountIndex: number;
  mint: string;
  owner?: string;
  uiTokenAmount: { uiAmount: number | null; decimals: number };
}

function classify(programs: string[]): string {
  if (programs.some((p) => /Jupiter|Whirlpool|Raydium|Aggregator|AMM/i.test(p))) return "Swap";
  if (programs.some((p) => /Stake/i.test(p))) return "Stake";
  if (programs.some((p) => /Token/i.test(p))) return "Token transfer";
  if (programs.some((p) => /System/i.test(p))) return "Transfer";
  return "Unknown";
}

function programsOf(tx: ParsedTx): string[] {
  const ids = new Set<string>();
  for (const ix of tx.transaction.message.instructions) ids.add(ix.programId);
  for (const inner of tx.meta?.innerInstructions ?? []) {
    for (const ix of inner.instructions) ids.add(ix.programId);
  }
  return [...ids].map(programName).filter((p) => p !== "Compute Budget");
}

function toActivity(tx: ParsedTx, forAddress?: string): ActivityItem {
  const keys = tx.transaction.message.accountKeys.map((k) => k.pubkey);
  const index = forAddress ? keys.indexOf(forAddress) : -1;
  const pre = tx.meta?.preBalances ?? [];
  const post = tx.meta?.postBalances ?? [];
  const netChange =
    index >= 0 && pre[index] != null && post[index] != null
      ? ((post[index] as number) - (pre[index] as number)) / LAMPORTS
      : null;
  const programs = programsOf(tx);
  return {
    signature: tx.transaction.signatures[0] ?? "",
    slot: tx.slot,
    blockTime: tx.blockTime,
    status: tx.meta?.err ? "failed" : "success",
    fee: tx.meta ? tx.meta.fee / LAMPORTS : null,
    kind: classify(programs),
    netChange,
    programs,
  };
}

/* ------------------------------------------------------------------ */
/* Adapter                                                             */
/* ------------------------------------------------------------------ */

async function getWallet(address: string, opts?: { limit?: number }): Promise<WalletOverview> {
  const limit = opts?.limit ?? 15;
  try {
    const [balanceRes, tokenRes, sigRes] = await Promise.all([
      rpc<{ value: number }>({ method: "getBalance", params: [address] }),
      rpc<{ value: { account: { data: { parsed: { info: { mint: string; tokenAmount: { uiAmount: number | null; decimals: number; uiAmountString: string } } } } } }[] }>({
        method: "getTokenAccountsByOwner",
        params: [address, { programId: TOKEN_PROGRAM }, { encoding: "jsonParsed" }],
      }),
      rpc<{ signature: string }[]>({
        method: "getSignaturesForAddress",
        params: [address, { limit }],
      }),
    ]);

    const rawTokens = (tokenRes.value ?? [])
      .map((entry) => entry.account.data.parsed.info)
      .filter((info) => (info.tokenAmount.uiAmount ?? 0) > 0)
      .sort((a, b) => (b.tokenAmount.uiAmount ?? 0) - (a.tokenAmount.uiAmount ?? 0))
      .slice(0, 20);

    const metas = await Promise.all(rawTokens.map((t) => tokenMeta(t.mint)));
    const tokens: TokenHolding[] = rawTokens.map((t, i) => ({
      mint: t.mint,
      amount: t.tokenAmount.uiAmount ?? 0,
      decimals: t.tokenAmount.decimals,
      uiAmountString: t.tokenAmount.uiAmountString,
      ...metas[i],
    }));

    const signatures = (sigRes ?? []).map((s) => s.signature);
    const txs = await rpcBatch<ParsedTx>(
      signatures.slice(0, 12).map((sig) => ({
        method: "getTransaction",
        params: [sig, { encoding: "jsonParsed", maxSupportedTransactionVersion: 0 }],
      })),
    );

    const activity = txs
      .filter((tx): tx is ParsedTx => Boolean(tx))
      .map((tx) => toActivity(tx, address));

    return {
      chain: "solana",
      address,
      nativeSymbol: "SOL",
      nativeBalance: (balanceRes?.value ?? 0) / LAMPORTS,
      tokens,
      activity,
      meta: liveMeta(),
    };
  } catch (error) {
    console.error("[solana] getWallet failed", error);
    return demoWallet(address);
  }
}

async function getTransaction(signature: string): Promise<TransactionDetail> {
  try {
    const tx = await rpc<ParsedTx | null>({
      method: "getTransaction",
      params: [signature, { encoding: "jsonParsed", maxSupportedTransactionVersion: 0 }],
    });
    if (!tx) throw new Error("Transaction not found");

    const keys = tx.transaction.message.accountKeys;
    const pre = tx.meta?.preBalances ?? [];
    const post = tx.meta?.postBalances ?? [];

    const nativeTransfers: TransferLeg[] = [];
    const senders: { key: string; delta: number }[] = [];
    const receivers: { key: string; delta: number }[] = [];
    keys.forEach((k, i) => {
      const delta = ((post[i] ?? 0) - (pre[i] ?? 0)) / LAMPORTS;
      if (delta < -0.0000001) senders.push({ key: k.pubkey, delta });
      if (delta > 0.0000001) receivers.push({ key: k.pubkey, delta });
    });
    for (const r of receivers) {
      nativeTransfers.push({
        from: senders[0]?.key ?? null,
        to: r.key,
        amount: Number(r.delta.toFixed(9)),
        symbol: "SOL",
      });
    }

    const tokenTransfers: TransferLeg[] = [];
    const preTb = tx.meta?.preTokenBalances ?? [];
    const postTb = tx.meta?.postTokenBalances ?? [];
    for (const after of postTb) {
      const before = preTb.find(
        (b) => b.accountIndex === after.accountIndex && b.mint === after.mint,
      );
      const delta = (after.uiTokenAmount.uiAmount ?? 0) - (before?.uiTokenAmount.uiAmount ?? 0);
      if (Math.abs(delta) < 1e-9) continue;
      const counterparty = preTb.find((b) => b.mint === after.mint && b.accountIndex !== after.accountIndex);
      tokenTransfers.push({
        from: delta > 0 ? (counterparty?.owner ?? null) : (after.owner ?? null),
        to: delta > 0 ? (after.owner ?? null) : (counterparty?.owner ?? null),
        amount: Math.abs(delta),
        symbol: after.mint.slice(0, 4),
        mint: after.mint,
      });
    }

    const metas = await Promise.all([...new Set(tokenTransfers.map((t) => t.mint!))].map(tokenMeta));
    const mints = [...new Set(tokenTransfers.map((t) => t.mint!))];
    tokenTransfers.forEach((t) => {
      const idx = mints.indexOf(t.mint!);
      const symbol = metas[idx]?.symbol;
      if (symbol) t.symbol = symbol;
    });

    return {
      chain: "solana",
      signature,
      status: tx.meta?.err ? "failed" : "success",
      error: tx.meta?.err ? JSON.stringify(tx.meta.err) : null,
      slot: tx.slot,
      blockTime: tx.blockTime,
      fee: (tx.meta?.fee ?? 0) / LAMPORTS,
      feeSymbol: "SOL",
      signer: keys.find((k) => k.signer)?.pubkey ?? null,
      accounts: keys.map((k) => k.pubkey),
      programs: programsOf(tx),
      instructions: tx.transaction.message.instructions.map((ix) => ({
        program: programName(ix.programId),
        type: ix.parsed?.type ?? "unknown",
        summary: ix.parsed?.info ? JSON.stringify(ix.parsed.info).slice(0, 220) : undefined,
      })),
      nativeTransfers,
      tokenTransfers,
      logs: tx.meta?.logMessages ?? [],
      raw: tx,
      meta: liveMeta(),
    };
  } catch (error) {
    console.error("[solana] getTransaction failed", error);
    return demoTransaction(signature);
  }
}

async function getToken(mint: string): Promise<TokenDetail> {
  try {
    const [info, largest, meta, sigs] = await Promise.all([
      rpc<{ value: { data: { parsed: { info: { decimals: number; supply: string } } } } | null }>({
        method: "getAccountInfo",
        params: [mint, { encoding: "jsonParsed" }],
      }),
      rpc<{ value: { address: string; uiAmount: number | null }[] }>({
        method: "getTokenLargestAccounts",
        params: [mint],
      }).catch(() => ({ value: [] })),
      tokenMeta(mint),
      rpc<{ signature: string }[]>({ method: "getSignaturesForAddress", params: [mint, { limit: 8 }] }).catch(
        () => [] as { signature: string }[],
      ),
    ]);

    const parsed = info?.value?.data?.parsed?.info;
    if (!parsed) throw new Error("Not a token mint");
    const decimals = parsed.decimals;
    const supply = Number(parsed.supply) / 10 ** decimals;

    const holders = (largest.value ?? []).slice(0, 10).map((h) => ({
      address: h.address,
      amount: h.uiAmount ?? 0,
      share: supply > 0 ? (h.uiAmount ?? 0) / supply : 0,
    }));

    const txs = await rpcBatch<ParsedTx>(
      (sigs ?? []).slice(0, 6).map((s) => ({
        method: "getTransaction",
        params: [s.signature, { encoding: "jsonParsed", maxSupportedTransactionVersion: 0 }],
      })),
    );

    return {
      chain: "solana",
      mint,
      decimals,
      supply,
      holders,
      activity: txs.filter((t): t is ParsedTx => Boolean(t)).map((t) => toActivity(t)),
      meta: liveMeta(),
      ...meta,
    };
  } catch (error) {
    console.error("[solana] getToken failed", error);
    return demoToken(mint);
  }
}

export const solanaAdapter: ChainAdapter = {
  id: "solana",
  nativeSymbol: "SOL",
  isAddress: isSolanaAddress,
  isTxSignature: isSolanaSignature,
  getWallet,
  getTransaction,
  getToken,
};
