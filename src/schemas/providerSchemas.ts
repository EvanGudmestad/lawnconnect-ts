import * as z from "zod";

const providerFields = z.strictObject({
  name: z.string().min(1, "Provider name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  serviceAreaZipCodes: z.array(z.string()),
  servicesOffered: z.array(z.string()),
});

//POST needs every required field present, and defaults the array fields to empty arrays if not provided
export const createProviderSchema = providerFields.extend({
  serviceAreaZipCodes: z.array(z.string()).default([]),
  servicesOffered: z.array(z.string()).default([]),
});

export const updateProviderSchema = providerFields
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const listProvidersQuerySchema = z.object({
  zip: z.string().optional(),
  service: z.string().optional(),
  sort: z.enum(["name", "-name", "email", "-email"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type ListProvidersQuery = z.infer<typeof listProvidersQuerySchema>;

export type UpdateProviderInput = z.infer<typeof updateProviderSchema>;

export type CreateProviderInput = z.infer<typeof createProviderSchema>;
