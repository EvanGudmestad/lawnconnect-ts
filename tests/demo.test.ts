import { describe, expect, it } from "vitest";
import { createProviderSchema } from "../src/schemas/providerSchemas.js";

describe("createProviderSchema", () => {
  it("accepts a valid provider and defaults the two array fields to empty arrays", () => {
    const result = createProviderSchema.safeParse({
      name: "Green Acres Lawn Care",
      email: "contact@greenacres.example",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.serviceAreaZipCodes).toEqual([]);
      expect(result.data.servicesOffered).toEqual([]);
    }
  });

  it("rejects an empty name", () => {
    const result = createProviderSchema.safeParse({
      name: "",
      email: "contact@greenacres.example",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an email that is not an email", () => {
    const result = createProviderSchema.safeParse({
      name: "Green Acres Lawn Care",
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });
});
