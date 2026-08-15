/**
 * Chain-agnostic domain types.
 *
 * Every UI component consumes these shapes only — never raw RPC payloads —
 * so adding Ethereum/Base later means writing a new ChainAdapter, not touching
 * the interface layer.
 */

export type ChainId = "solana" | "ethereum" | "base";

export type DataSource = "live" | "demo";

export interface SourceMeta {
  /** Where the data came from. "demo" must always be surfaced in the UI. */
  source: DataSource;
  /** Human readable reason when we fell back to demo data. */
  note?: string;
  fetchedAt: string;
}

export interface TokenHolding {
  mint: string;
  symbol?: string;
  name?: string;
  logoURI?: string;
  amount: number;
  decimals: number;
  uiAmountString: string;
}

export interface ActivityItem {
  signature: string;
  slot: number;
  blockTime: number | null;
  status: "success" | "failed";
  fee: number | null;
  /** Short human label, e.g. "Swap", "Transfer", "Unknown" */
  kind: string;
  /** Net native-token change for the queried address, in whole units (SOL). */
  netChange: number | null;
  programs: string[];
}

export interface WalletOverview {
  chain: ChainId;
  address: string;
  nativeSymbol: string;
  nativeBalance: number;
  tokens: TokenHolding[];
  activity: ActivityItem[];
  meta: SourceMeta;
}

export interface TransferLeg {
  from: string | null;
  to: string | null;
  amount: number;
  symbol: string;
  mint?: string;
}

export interface TransactionDetail {
  chain: ChainId;
  signature: string;
  status: "success" | "failed";
  error?: string | null;
  slot: number;
  blockTime: number | null;
  fee: number;
  feeSymbol: string;
  signer: string | null;
  accounts: string[];
  programs: string[];
  instructions: { program: string; type: string; summary?: string }[];
  nativeTransfers: TransferLeg[];
  tokenTransfers: TransferLeg[];
  logs: string[];
  raw: unknown;
  meta: SourceMeta;
}

export interface TokenDetail {
  chain: ChainId;
  mint: string;
  name?: string;
  symbol?: string;
  logoURI?: string;
  decimals: number;
  supply: number;
  holders?: { address: string; amount: number; share: number }[];
  activity: ActivityItem[];
  market?: { priceUsd?: number; source?: string };
  meta: SourceMeta;
}

/**
 * Implement this once per chain. `src/lib/chains/registry.server.ts` resolves
 * the right adapter from a ChainId.
 */
export interface ChainAdapter {
  id: ChainId;
  nativeSymbol: string;
  isAddress(value: string): boolean;
  isTxSignature(value: string): boolean;
  getWallet(address: string, opts?: { limit?: number }): Promise<WalletOverview>;
  getTransaction(signature: string): Promise<TransactionDetail>;
  getToken(mint: string): Promise<TokenDetail>;
}
