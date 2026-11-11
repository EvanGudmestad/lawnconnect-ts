import { z } from "zod";
import { providerSchema } from "./types";
import type { Provider } from "./types";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function send(path: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(path, init);
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body: unknown = await res.json();
      if (
        typeof body === "object" &&
        body !== null &&
        "error" in body &&
        typeof body.error === "string"
      ) {
        message = body.error;
      }
    } catch {
      // The server did not send JSON. The generic message above is enough.
    }
    throw new ApiError(res.status, message);
  }
  return res;
}

export async function listProviders(): Promise<Provider[]> {
  const res = await send("/providers");
  return z.array(providerSchema).parse(await res.json());
}

export type ProviderDraft = Omit<
  Provider,
  "id" | "createdBy" | "updatedBy" | "updatedAt"
>;

function withBody(method: string, body: unknown): RequestInit {
  return {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

export async function createProvider(draft: ProviderDraft): Promise<Provider> {
  const res = await send("/providers", withBody("POST", draft));
  return providerSchema.parse(await res.json());
}

export async function deleteProvider(id: string): Promise<void> {
  await send(`/providers/${id}`, { method: "DELETE" });
}

export async function getProvider(id: string): Promise<Provider> {
  const res = await send(`/providers/${id}`);
  return providerSchema.parse(await res.json());
}

export async function updateProvider(
  id: string,
  changes: Partial<ProviderDraft>,
): Promise<Provider> {
  const res = await send(`/providers/${id}`, withBody("PATCH", changes));
  return providerSchema.parse(await res.json());
}
