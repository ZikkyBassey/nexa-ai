import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { SiteShell } from "@/components/nexa/site-shell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { shortAddress } from "@/lib/format";

const TITLE = "Your watchlist — Nexa";
const DESCRIPTION = "Track the Solana wallets and tokens you care about and revisit them in one click.";

export const Route = createFileRoute("/watchlist")({
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
  component: WatchlistPage,
});

interface Item {
  id: string;
  kind: string;
  address: string;
  label: string | null;
}

function WatchlistPage() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  async function load() {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      setSignedIn(false);
      return;
    }
    setSignedIn(true);
    const { data } = await supabase
      .from("watchlist_items")
      .select("id, kind, address, label")
      .order("created_at", { ascending: false });
    setItems(data ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function remove(id: string) {
    await supabase.from("watchlist_items").delete().eq("id", id);
    void load();
  }

  return (
    <SiteShell>
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
        <h1 className="text-2xl font-semibold">Watchlist</h1>

        {signedIn === false ? (
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">Sign in to build your watchlist.</p>
            <Button className="mt-4" asChild>
              <Link to="/auth">Sign in</Link>
            </Button>
          </div>
        ) : null}

        {signedIn && items && items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nothing saved yet — open a wallet or token and hit “Add to watchlist”.
          </p>
        ) : null}

        {items && items.length > 0 ? (
          <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 p-3 text-sm">
                {item.kind === "token" ? (
                  <Link to="/token/$mint" params={{ mint: item.address }} className="mono truncate hover:text-primary">
                    {item.label ?? shortAddress(item.address, 6)}
                  </Link>
                ) : (
                  <Link
                    to="/wallet/$address"
                    params={{ address: item.address }}
                    className="mono truncate hover:text-primary"
                  >
                    {item.label ?? shortAddress(item.address, 6)}
                  </Link>
                )}
                <span className="rounded-md bg-secondary px-2 py-0.5 text-xs">{item.kind}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto"
                  onClick={() => void remove(item.id)}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </SiteShell>
  );
}
