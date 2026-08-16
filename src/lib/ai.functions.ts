import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const AskInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      }),
    )
    .min(1)
    .max(20),
});

export const askNexa = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AskInput.parse(input))
  .handler(async ({ data }) => {
    const { runAgent } = await import("./agent/agent.server");
    return runAgent(data.messages);
  });
