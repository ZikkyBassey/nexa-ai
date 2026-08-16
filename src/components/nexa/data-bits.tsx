import { Link } from "@tanstack/react-router";
import { ArrowDownRight, ArrowUpRight, CircleAlert } from "lucide-react";

import type { ActivityItem, SourceMeta } from "@/lib/chains/types";
import { formatAmount, relativeTime, shortAddress } from "@/lib/format";

export function SourceBadge({ meta }: { meta: SourceMeta }) {
  const demo = meta.source === "demo";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${
        demo
          ? "border-destructive/40 bg-destructive/10 text-destructive"
          : "border-primary/40 bg-primary/10 text-primary"
      }`}
    >
      {demo ? <CircleAlert className="size-3" /> : <span className="size-1.5 rounded-full bg-primary" />}
      {demo ? "Demo data — live RPC unavailable" : "Live on-chain data"}
    </span>
  );
}

export function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 truncate text-xl font-semibold">{value}</p>
      {hint ? <p className="mt-1 truncate text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function ActivityList({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No recent activity found.</p>;
  }
  return (
    <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
      {items.map((item) => (
        <li key={item.signature} className="flex items-center gap-3 p-3 text-sm">
          <span
            className={`rounded-md px-2 py-0.5 text-xs ${
              item.status === "failed"
                ? "bg-destructive/15 text-destructive"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            {item.kind}
          </span>
          <Link
            to="/tx/$signature"
            params={{ signature: item.signature }}
            className="mono truncate text-muted-foreground transition-colors hover:text-foreground"
          >
            {shortAddress(item.signature, 6)}
          </Link>
          <span className="ml-auto whitespace-nowrap text-xs text-muted-foreground">
            {relativeTime(item.blockTime)}
          </span>
          {item.netChange != null && item.netChange !== 0 ? (
            <span
              className={`flex items-center gap-1 whitespace-nowrap text-xs ${
                item.netChange > 0 ? "text-primary" : "text-destructive"
              }`}
            >
              {item.netChange > 0 ? (
                <ArrowUpRight className="size-3" />
              ) : (
                <ArrowDownRight className="size-3" />
              )}
              {formatAmount(item.netChange)} SOL
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
