import { listProvidersQuerySchema } from "../../src/schemas/providerSchemas";
import type { ListProvidersQuery } from "../../src/schemas/providerSchemas";

export type Sort = NonNullable<ListProvidersQuery["sort"]>;

// Anything typed into the address bar can say anything: ?sort=sideways&page=-4.
// These two accept only real choices and fall back to a safe default.
export function sortOrName(value: string | null): Sort {
  const parsed = listProvidersQuerySchema.shape.sort.safeParse(
    value ?? undefined,
  );
  return parsed.success && parsed.data ? parsed.data : "name";
}

export function pageOrOne(value: string | null): number {
  const page = Number(value);
  return Number.isInteger(page) && page >= 1 ? page : 1;
}
