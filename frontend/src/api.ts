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
