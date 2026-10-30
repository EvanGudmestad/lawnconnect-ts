import * as z from "zod";

export const serviceNames = [
  "mowing",
  "edging",
  "fertilizing",
  "leaf-cleanup",
] as const;

// What the customer sends. The length limit also protects your free token budget.
export const assistantInputSchema = z.strictObject({
  request: z.string().min(1, "Tell us what you need").max(500),
});

// What the assistant must send back. The model has to fit this shape
// or the answer is thrown away.
export const assistantSuggestionSchema = z.object({
  // "other" lets the assistant say "we do not offer that" instead of failing.
  service: z.enum([...serviceNames, "other"]),
  urgency: z.enum(["low", "medium", "high"]),
  // Models often write null for "not given", so null is allowed here and
  // turned into "no zip" by the agent.
  zip: z
    .string()
    .regex(/^\d{5}$/)
    .nullish(),
  providerIds: z.array(z.string().regex(/^[0-9a-f]{24}$/)).max(3),
  reason: z.string().min(1).max(300),
});

export type AssistantInput = z.infer<typeof assistantInputSchema>;
export type AssistantSuggestion = z.infer<typeof assistantSuggestionSchema>;
