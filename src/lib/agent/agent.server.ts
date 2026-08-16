/**
 * Nexa agent — SERVER ONLY.
 *
 * Grounds every answer in real chain data by exposing the ChainAdapter as
 * tools to the Lovable AI Gateway (OpenAI-compatible chat completions).
 */
import { getAdapter } from "../chains/registry.server";

export interface AgentMessage {
  role: "user" | "assistant";
  content: string;
}

export interface Citation {
  kind: "wallet" | "transaction" | "token";
  value: string;
}

export interface AgentResult {
  answer: string;
  citations: Citation[];
  degraded: boolean;
}

const SYSTEM_PROMPT = `You are Nexa, an AI blockchain analyst for Solana.

Rules:
- Only state on-chain facts that came back from a tool call in this conversation.
- Never invent balances, prices, addresses, or transaction signatures.
- Clearly separate "What the data shows" from "What this likely means".
- If a tool fails or data is unavailable, say so plainly.
- Explain in plain English, beginner friendly, using short markdown sections.
- Keep answers under 250 words unless the user asks for depth.`;

const tools = [
  {
    type: "function",
    function: {
      name: "get_wallet",
      description: "Fetch SOL balance, token holdings and recent activity for a Solana wallet address.",
      parameters: {
        type: "object",
        properties: { address: { type: "string", description: "Solana wallet address (base58)" } },
        required: ["address"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_transaction",
      description: "Fetch full details of a Solana transaction by signature.",
      parameters: {
        type: "object",
        properties: { signature: { type: "string", description: "Transaction signature (base58)" } },
        required: ["signature"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_token",
      description: "Fetch supply, decimals, metadata and top holders for a Solana token mint.",
      parameters: {
        type: "object",
        properties: { mint: { type: "string", description: "Token mint address (base58)" } },
        required: ["mint"],
        additionalProperties: false,
      },
    },
  },
] as const;

interface ToolCall {
  id: string;
  function: { name: string; arguments: string };
}

interface ChatMessage {
  role: string;
  content: string | null;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
}

async function runTool(name: string, args: Record<string, string>, citations: Citation[]) {
  const adapter = getAdapter("solana");
  if (name === "get_wallet" && args["address"]) {
    citations.push({ kind: "wallet", value: args["address"] });
    const wallet = await adapter.getWallet(args["address"]);
    return { ...wallet, activity: wallet.activity.slice(0, 8), tokens: wallet.tokens.slice(0, 10) };
  }
  if (name === "get_transaction" && args["signature"]) {
    citations.push({ kind: "transaction", value: args["signature"] });
    const tx = await adapter.getTransaction(args["signature"]);
    return { ...tx, raw: undefined, logs: tx.logs.slice(0, 12) };
  }
  if (name === "get_token" && args["mint"]) {
    citations.push({ kind: "token", value: args["mint"] });
    const token = await adapter.getToken(args["mint"]);
    return { ...token, activity: token.activity.slice(0, 5) };
  }
  return { error: `Unknown or invalid tool call: ${name}` };
}

export async function runAgent(history: AgentMessage[]): Promise<AgentResult> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) {
    return {
      answer: "The AI service isn't configured yet, so I can't analyse this right now.",
      citations: [],
      degraded: true,
    };
  }

  const citations: Citation[] = [];
  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.slice(-12).map((m) => ({ role: m.role, content: m.content })),
  ];

  try {
    for (let round = 0; round < 4; round++) {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model: "google/gemini-2.5-flash", messages, tools }),
      });

      if (res.status === 429) {
        return { answer: "Rate limit reached — please try again in a moment.", citations, degraded: true };
      }
      if (res.status === 402) {
        return { answer: "AI credits are exhausted for this workspace.", citations, degraded: true };
      }
      if (!res.ok) throw new Error(`AI gateway ${res.status}`);

      const json = (await res.json()) as {
        choices?: { message: ChatMessage }[];
      };
      const message = json.choices?.[0]?.message;
      if (!message) throw new Error("Empty AI response");

      messages.push(message);

      const calls = message.tool_calls ?? [];
      if (calls.length === 0) {
        return { answer: message.content ?? "No answer produced.", citations, degraded: false };
      }

      for (const call of calls) {
        let args: Record<string, string> = {};
        try {
          args = JSON.parse(call.function.arguments || "{}") as Record<string, string>;
        } catch {
          args = {};
        }
        let result: unknown;
        try {
          result = await runTool(call.function.name, args, citations);
        } catch (error) {
          result = { error: error instanceof Error ? error.message : "tool failed" };
        }
        messages.push({
          role: "tool",
          tool_call_id: call.id,
          content: JSON.stringify(result).slice(0, 12000),
        });
      }
    }
    return { answer: "I couldn't finish the investigation in time. Try a narrower question.", citations, degraded: true };
  } catch (error) {
    console.error("[agent] failed", error);
    return {
      answer: "Something went wrong while investigating that. Please try again.",
      citations,
      degraded: true,
    };
  }
}
