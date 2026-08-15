/**
 * Client-safe input classification for the universal search bar.
 * No network access, no secrets — safe to import from components.
 */

const BASE58 = /^[1-9A-HJ-NP-Za-km-z]+$/;

export type DetectedKind = "wallet" | "transaction" | "token" | "question";

export interface DetectionResult {
  kind: DetectedKind;
  value: string;
  /** Any on-chain identifiers found inside a natural-language question. */
  entities: { kind: "wallet" | "transaction"; value: string }[];
}

export function isSolanaAddress(value: string): boolean {
  return value.length >= 32 && value.length <= 44 && BASE58.test(value);
}

export function isSolanaSignature(value: string): boolean {
  return value.length >= 64 && value.length <= 90 && BASE58.test(value);
}

/** Known mints get routed straight to the token page. */
const KNOWN_MINTS = new Set([
  "So11111111111111111111111111111111111111112",
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
  "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
]);

export function detectInput(input: string): DetectionResult {
  const value = input.trim();
  const words = value.split(/\s+/);

  if (words.length === 1) {
    if (isSolanaSignature(value)) return { kind: "transaction", value, entities: [] };
    if (isSolanaAddress(value)) {
      return {
        kind: KNOWN_MINTS.has(value) ? "token" : "wallet",
        value,
        entities: [],
      };
    }
  }

  const entities: DetectionResult["entities"] = [];
  for (const word of words) {
    const cleaned = word.replace(/[.,!?;:()"']/g, "");
    if (isSolanaSignature(cleaned)) entities.push({ kind: "transaction", value: cleaned });
    else if (isSolanaAddress(cleaned)) entities.push({ kind: "wallet", value: cleaned });
  }

  return { kind: "question", value, entities };
}

/** Where the search bar should navigate for a given input. */
export function routeForInput(input: string): { to: string; params?: Record<string, string>; search?: Record<string, string> } {
  const result = detectInput(input);
  switch (result.kind) {
    case "wallet":
      return { to: "/wallet/$address", params: { address: result.value } };
    case "transaction":
      return { to: "/tx/$signature", params: { signature: result.value } };
    case "token":
      return { to: "/token/$mint", params: { mint: result.value } };
    default:
      return { to: "/chat", search: { q: result.value } };
  }
}
