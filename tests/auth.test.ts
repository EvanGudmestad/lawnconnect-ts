import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import { auth } from "../src/auth.js";

// Same stand-in as providers.test.ts: no test may reach a real database.
vi.mock("../src/domain/providers.js", () => ({
  findProviders: vi.fn(),
  findProviderById: vi.fn(),
  insertProvider: vi.fn(),
  updateProviderById: vi.fn(),
  deleteProviderById: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(auth.api.getSession).mockResolvedValue({
    user: { id: "64f0c0ffee0c0ffee0c0ff01", name: "Pat Provider" },
  } as never);
});

describe("nobody signed in", () => {
  beforeEach(() => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null as never);
  });

  it.each([
    ["get", "/providers"],
    ["get", "/providers/64f0c0ffee0c0ffee0c0ffee"],
    ["post", "/providers"],
    ["patch", "/providers/64f0c0ffee0c0ffee0c0ffee"],
    ["delete", "/providers/64f0c0ffee0c0ffee0c0ffee"],
    ["get", "/api/me"],
  ] as const)("%s %s answers 401", async (method, path) => {
    const res = await request(app)[method](path);
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Please sign in first" });
  });

  it("GET /health stays public", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
  });
});

describe("GET /api/me", () => {
  it("returns the signed-in person and their role from the session", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: {
        id: "64f0c0ffee0c0ffee0c0ff01",
        name: "Pat Provider",
        role: "provider",
      },
    } as never);
    const res = await request(app).get("/api/me");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      userId: "64f0c0ffee0c0ffee0c0ff01",
      fullName: "Pat Provider",
      role: "provider",
    });
  });
  it('shows "none" for an account with no role field', async () => {
    const res = await request(app).get("/api/me");
    expect(res.body.role).toBe("none");
  });
});
