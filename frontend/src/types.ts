import { z } from "zod";

const userRefSchema = z.object({ userId: z.string(), fullName: z.string() });

// What GET /providers sends back for one provider. Zod checks it when it arrives.
export const providerSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string().optional(),
  serviceAreaZipCodes: z.array(z.string()),
  servicesOffered: z.array(z.string()),
  createdBy: userRefSchema.optional(),
  updatedBy: userRefSchema.optional(),
  updatedAt: z.string().optional(),
});

export type Provider = z.infer<typeof providerSchema>;
