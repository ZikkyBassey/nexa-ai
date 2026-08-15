/**
 * Public (read-only) blockchain server functions.
 * All RPC access and any provider credentials stay on the server.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const AddressInput = z.object({
  address: z.string().min(32).max(64),
  chain: z.enum(["solana"]).default("solana"),
});

const SignatureInput = z.object({
  signature: z.string().min(43).max(96),
  chain: z.enum(["solana"]).default("solana"),
});

export const fetchWallet = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AddressInput.parse(input))
  .handler(async ({ data }) => {
    const { getAdapter } = await import("./chains/registry.server");
    return getAdapter(data.chain).getWallet(data.address);
  });

export const fetchTransaction = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SignatureInput.parse(input))
  .handler(async ({ data }) => {
    const { getAdapter } = await import("./chains/registry.server");
    return getAdapter(data.chain).getTransaction(data.signature);
  });

export const fetchToken = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AddressInput.parse(input))
  .handler(async ({ data }) => {
    const { getAdapter } = await import("./chains/registry.server");
    return getAdapter(data.chain).getToken(data.address);
  });
