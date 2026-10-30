import { tool } from "ai";
import * as z from "zod";
import { findProviders } from "../domain/providers.js";
import { serviceNames } from "../schemas/assistantSchemas.js";

// Built fresh for each request so it can remember which provider ids
// it really handed to the model.
export function makeFindProvidersTool(seenIds: Set<string>) {
  return tool({
    description:
      "Find providers that offer a service in a zip code. Returns at most 5.",
    // The model picks these values, so the schema limits them
    // to values we accept.
    inputSchema: z.object({
      service: z.enum(serviceNames),
      zip: z
        .string()
        .regex(/^\d{5}$/)
        .describe("5-digit zip code from the request"),
    }),
    execute: async ({ service, zip }) => {
      const found = await findProviders({ service, zip, page: 1, limit: 5 });
      for (const provider of found) seenIds.add(provider.id);
      return found.map((p) => ({
        id: p.id,
        name: p.name,
        servicesOffered: p.servicesOffered,
      }));
    },
  });
}
