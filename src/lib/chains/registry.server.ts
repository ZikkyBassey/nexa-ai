/**
 * Chain registry — SERVER ONLY.
 * Add Ethereum/Base by writing another ChainAdapter and registering it here.
 */
import { solanaAdapter } from "./solana.server";
import type { ChainAdapter, ChainId } from "./types";

const adapters: Partial<Record<ChainId, ChainAdapter>> = {
  solana: solanaAdapter,
  // ethereum: ethereumAdapter,  // TODO: implement ChainAdapter for EVM chains
  // base: baseAdapter,
};

export function getAdapter(chain: ChainId = "solana"): ChainAdapter {
  const adapter = adapters[chain];
  if (!adapter) throw new Error(`Chain "${chain}" is not supported yet`);
  return adapter;
}
