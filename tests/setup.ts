import { vi } from "vitest";

// Stand-in for auth.ts: importing your app must never need BETTER_AUTH_* or Atlas.
vi.mock("../src/auth.js", () => ({
  auth: {
    handler: vi.fn(async () => new Response(null, { status: 404 })),
    api: { getSession: vi.fn().mockResolvedValue(null) },
  },
}));
