import { supabase } from "@/integrations/supabase/client";

export type WatchKind = "wallet" | "token";

/** Adds an item to the signed-in user's watchlist. Returns a status message. */
export async function addToWatchlist(item: {
  kind: WatchKind;
  address: string;
  label?: string;
}): Promise<string> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return "Sign in to save items to your watchlist.";

  const { error } = await supabase.from("watchlist_items").insert({
    user_id: auth.user.id,
    kind: item.kind,
    address: item.address,
    chain: "solana",
    label: item.label ?? null,
  });

  if (error) return `Could not save: ${error.message}`;
  return "Saved to your watchlist.";
}
