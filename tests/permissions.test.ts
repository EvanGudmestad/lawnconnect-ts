import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import { auth } from "../src/auth.js";
import * as domain from "../src/domain/providers.js";

vi.mock("../src/domain/providers.js", () => ({
  findProviders: vi.fn(),
  findProviderById: vi.fn(),
  insertProvider: vi.fn(),
  updateProviderById: vi.fn(),
  deleteProviderById: vi.fn(),
}));

const pat = { user: { id: "64f0c0ffee0c0ffee0c0ff01", name: "Pat Provider" } };
const providerId = "64f0c0ffee0c0ffee0c0ffee";

beforeEach(() => {
  vi.mocked(auth.api.getSession).mockResolvedValue(pat as never);
  vi.mocked(auth.api.userHasPermission).mockReset();
  vi.mocked(domain.insertProvider).mockReset();
  vi.mocked(domain.updateProviderById).mockReset();
  vi.mocked(domain.deleteProviderById).mockReset();
});

describe("signed in, but the role may not", () => {
  beforeEach(() => {
    vi.mocked(auth.api.userHasPermission).mockResolvedValue({
      success: false,
    } as never);
  });

  it("POST /providers answers 403 and never touches the database", async () => {
    const res = await request(app)
      .post("/providers")
      .send({ name: "Green Acres", email: "a@b.example" });
    expect(res.status).toBe(403);
    expect(res.body).toEqual({ error: "Your role may not provider:create" });
    expect(domain.insertProvider).not.toHaveBeenCalled();
  });

  it("PATCH /providers/:id answers 403 even with a perfectly good body", async () => {
    const res = await request(app)
      .patch(`/providers/${providerId}`)
      .send({ phone: "555-0199" });
    expect(res.status).toBe(403);
    expect(res.body).toEqual({ error: "Your role may not provider:update" });
    expect(domain.updateProviderById).not.toHaveBeenCalled();
  });

  it("DELETE /providers/:id answers 403", async () => {
    const res = await request(app).delete(`/providers/${providerId}`);
    expect(res.status).toBe(403);
    expect(domain.deleteProviderById).not.toHaveBeenCalled();
  });

  it("PATCH /users/:id/role answers 403", async () => {
    const res = await request(app)
      .patch("/users/64f0c0ffee0c0ffee0c0ff02/role")
      .send({ role: "provider" });
    expect(res.status).toBe(403);
    expect(res.body).toEqual({ error: "Your role may not user:set-role" });
  });
});

describe("the permission check asks about the right permission", () => {
  it("asks 'provider:delete' for DELETE, using the signed-in person's id", async () => {
    vi.mocked(auth.api.userHasPermission).mockResolvedValue({
      success: true,
    } as never);
    vi.mocked(domain.deleteProviderById).mockResolvedValue(true);
    await request(app).delete(`/providers/${providerId}`);
    expect(auth.api.userHasPermission).toHaveBeenCalledWith({
      body: { userId: pat.user.id, permissions: { provider: ["delete"] } },
    });
  });
});

describe("PATCH /users/:id/role", () => {
  beforeEach(() => {
    vi.mocked(auth.api.userHasPermission).mockResolvedValue({
      success: true,
    } as never);
  });

  it("rejects a role that does not exist with 400", async () => {
    const res = await request(app)
      .patch("/users/64f0c0ffee0c0ffee0c0ff02/role")
      .send({ role: "wizard" });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("ValidationFailed");
  });

  it("refuses to change your own role with 400", async () => {
    const res = await request(app)
      .patch(`/users/${pat.user.id}/role`)
      .send({ role: "admin" });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "You cannot change your own role" });
    expect(auth.api.setRole).not.toHaveBeenCalled();
  });
});
