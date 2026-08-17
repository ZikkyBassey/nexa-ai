import { createFileRoute, Link, useServerFn } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import ReactMarkdown from "react-markdown";

import { SiteShell } from "@/components/nexa/site-shell";
import { Button } from "@/components/ui/button";
import { askNexa } from "@/lib/ai.functions";
import { shortAddress } from "@/lib/format";

const TITLE = "Ask Nexa — AI Solana analyst";
const DESCRIPTION =
  "Chat with an AI agent that reads live Solana data before answering, and links to every wallet, token and transaction it used.";

export const Route = createFileRoute("/chat")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search["q"] === "string" ? search["q"] : undefined,
  }),
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
  component: ChatPage,
});

interface Citation {
  kind: "wallet" | "transaction" | "token";
  value: string;
}

interface Turn {
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
}

function CitationLink({ citation }: { citation: Citation }) {
  const label = shortAddress(citation.value, 5);
  if (citation.kind === "transaction") {
    return (
      <Link
        to="/tx/$signature"
        params={{ signature: citation.value }}
        className="mono rounded-md border border-border px-2 py-0.5 text-xs hover:text-primary"
      >
        tx {label}
      </Link>
    );
  }
  if (citation.kind === "token") {
    return (
      <Link
        to="/token/$mint"
        params={{ mint: citation.value }}
        className="mono rounded-md border border-border px-2 py-0.5 text-xs hover:text-primary"
      >
        token {label}
      </Link>
    );
  }
  return (
    <Link
      to="/wallet/$address"
      params={{ address: citation.value }}
      className="mono rounded-md border border-border px-2 py-0.5 text-xs hover:text-primary"
    >
      wallet {label}
    </Link>
  );
}

function ChatPage() {
  const { q } = Route.useSearch();
  const ask = useServerFn(askNexa);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const started = useRef(false);

  async function send(question: string) {
    const trimmed = question.trim();
    if (!trimmed || busy) return;
    const history: Turn[] = [...turns, { role: "user", content: trimmed }];
    setTurns(history);
    setInput("");
    setBusy(true);
    try {
      const result = await ask({
        data: { messages: history.map(({ role, content }) => ({ role, content })) },
      });
      setTurns([
        ...history,
        { role: "assistant", content: result.answer, citations: result.citations },
      ]);
    } catch {
      setTurns([
        ...history,
        { role: "assistant", content: "Something went wrong reaching the agent. Try again." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (q && !started.current) {
      started.current = true;
      void send(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  function submit(event: FormEvent) {
    event.preventDefault();
    void send(input);
  }

  return (
    <SiteShell>
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-8">
        <div>
          <h1 className="text-2xl font-semibold">Ask Nexa</h1>
          <p className="text-sm text-muted-foreground">
            The agent fetches live Solana data before answering and cites what it used.
          </p>
        </div>

        <div className="min-h-[40vh] space-y-4">
          {turns.length === 0 && !busy ? (
            <p className="text-sm text-muted-foreground">
              Try: “Explain what this wallet has been doing this week”.
            </p>
          ) : null}
          {turns.map((turn, i) => (
            <div
              key={i}
              className={`rounded-2xl border border-border p-4 text-sm ${
                turn.role === "user" ? "bg-secondary/50" : "bg-card"
              }`}
            >
              <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
                {turn.role === "user" ? "You" : "Nexa"}
              </p>
              <div className="prose prose-invert max-w-none prose-p:my-2 prose-headings:text-base">
                <ReactMarkdown>{turn.content}</ReactMarkdown>
              </div>
              {turn.citations && turn.citations.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {turn.citations.map((citation, j) => (
                    <CitationLink key={`${citation.value}-${j}`} citation={citation} />
                  ))}
                </div>
              ) : null}
            </div>
          ))}
          {busy ? (
            <div className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
              Investigating on-chain data…
            </div>
          ) : null}
        </div>

        <form onSubmit={submit} className="sticky bottom-4 flex gap-2 rounded-xl border border-border bg-card p-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about a wallet, transaction or token…"
            aria-label="Message"
            className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <Button type="submit" disabled={busy}>
            Send
          </Button>
        </form>
      </div>
    </SiteShell>
  );
}
