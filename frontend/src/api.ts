import { z } from "zod";
import type { CreateProviderInput } from "./schemas/providerForm";
import { providerSchema } from "./types";
import type { Provider } from "./types";
import type { Sort } from "./searchParams";

type FieldProblem = { path: string; message: string };

export class ApiError extends Error {
  status: number;
  details: FieldProblem[];

  constructor(status: number, message: string, details: FieldProblem[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

async function send(path: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(path, init);
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    let details: FieldProblem[] = [];
    try {
      const body: unknown = await res.json();
      if (typeof body === "object" && body !== null) {
        if ("error" in body && typeof body.error === "string")
          message = body.error;
        if ("details" in body && Array.isArray(body.details))
          details = body.details;
      }
    } catch {
      // The server did not send JSON. The generic message above is enough.
    }
    throw new ApiError(res.status, message, details);
  }
  return res;
}

async function getJson<T>(
  path: string,
  schema: z.ZodType<T>,
  init?: RequestInit,
): Promise<T> {
  const res = await send(path, init);
  return schema.parse(await res.json());
}

function withBody(method: string, body: unknown): RequestInit {
  return {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

export type ProviderDraft = CreateProviderInput;

export function listProviders(): Promise<Provider[]> {
  return getJson("/providers", z.array(providerSchema));
}

export type SearchParams = {
  zip?: string;
  service?: string;
  sort?: Sort;
  page?: number;
  limit?: number;
};

// Only the filters that have a value go into the address, so a default search
// is just /providers and a filtered one is something like /providers?zip=63101&page=2
export function searchProviders(params: SearchParams): Promise<Provider[]> {
  const query = new URLSearchParams();
  if (params.zip) query.set("zip", params.zip);
  if (params.service) query.set("service", params.service);
  if (params.sort) query.set("sort", params.sort);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  const text = query.toString();
  return getJson(
    `/providers${text ? `?${text}` : ""}`,
    z.array(providerSchema),
  );
}

export function getProvider(id: string): Promise<Provider> {
  return getJson(`/providers/${id}`, providerSchema);
}
export function createProvider(draft: ProviderDraft): Promise<Provider> {
  return getJson("/providers", providerSchema, withBody("POST", draft));
}
export function updateProvider(
  id: string,
  changes: Partial<ProviderDraft>,
): Promise<Provider> {
  return getJson(
    `/providers/${id}`,
    providerSchema,
    withBody("PATCH", changes),
  );
}
export async function deleteProvider(id: string): Promise<void> {
  await send(`/providers/${id}`, { method: "DELETE" });
}
