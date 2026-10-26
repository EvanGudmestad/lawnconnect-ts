import { vi } from "vitest";

// Stand-in for auth.ts: importing your app must never need BETTER_AUTH_* or Atlas.
vi.mock("../src/auth.js", () => ({
  auth: {
    handler: vi.fn(async () => new Response(null, { status: 404 })),
    api: {
      // By default every permission check says yes,
      // so the Module 4 tests keep passing.
      userHasPermission: vi.fn().mockResolvedValue({ success: true }),
      setRole: vi
        .fn()
        .mockResolvedValue({ user: { id: "u9", role: "provider" } }),
      // By default every test is "signed in" as Pat Provider.
      getSession: vi.fn().mockResolvedValue({
        user: { id: "64f0c0ffee0c0ffee0c0ff01", name: "Pat Provider" },
      }),
    },
  },
}));
