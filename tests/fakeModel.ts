// Provided file: copy it in as it is. You do not need to change it.
//
// A pretend model for tests. You queue the answers it will give, in order:
//   fakeModel(
//     askForTool("search_issues", { words: "login" }),
//     answer({ classification: "approved", ... }),
//   )
import { MockLanguageModelV4 } from "ai/test";

const usage = {
  inputTokens: { total: 1, noCache: 1, cacheRead: undefined, cacheWrite: undefined },
  outputTokens: { total: 1, text: 1, reasoning: undefined },
};

export const askForTool = (name: string, args: object) => ({
  content: [
    { type: "tool-call" as const, toolCallId: `call-${name}`, toolName: name, input: JSON.stringify(args) },
  ],
  finishReason: { unified: "tool-calls" as const, raw: undefined },
  usage,
  warnings: [],
});

export const sayText = (text: string) => ({
  content: [{ type: "text" as const, text }],
  finishReason: { unified: "stop" as const, raw: undefined },
  usage,
  warnings: [],
});

export const answer = (suggestion: object) => sayText(JSON.stringify(suggestion));

export function fakeModel(...steps: ReturnType<typeof sayText | typeof askForTool>[]) {
  return new MockLanguageModelV4({ doGenerate: steps });
}

export function brokenModel(error: Error) {
  return new MockLanguageModelV4({
    doGenerate: async () => {
      throw error;
    },
  });
}
