import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import * as domain from "../src/domain/providers.js";

vi.mock("../src/domain/providers.js", () => ({
  findProviders: vi.fn(),
  findProviderById: vi.fn(),
  insertProvider: vi.fn(),
  updateProviderById: vi.fn(),
  deleteProviderById: vi.fn(),
}));

const sampleProvider = {
  id: "64f0c0ffee0c0ffee0c0ffee",
  name: "Green Acres Lawn Care",
  email: "contact@greenacres.example",
  phone: "555-0101",
  serviceAreaZipCodes: ["63108"],
  servicesOffered: ["mowing"],
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe("POST /providers", () => {
  it("rejects a body with no name with 400 ValidationFailed", async () => {
    const res = await request(app)
      .post("/providers")
      .send({ email: "contact@greenacres.example" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("ValidationFailed");
    expect(domain.insertProvider).not.toHaveBeenCalled();
  });

  it("creates a provider and returns 201", async () => {
    vi.mocked(domain.insertProvider).mockResolvedValue(sampleProvider);

    const res = await request(app)
      .post("/providers")
      .send({
        name: "Green Acres Lawn Care",
        email: "contact@greenacres.example",
        phone: "555-0101",
        serviceAreaZipCodes: ["63108"],
        servicesOffered: ["mowing"],
      });

    expect(res.status).toBe(201);
    expect(res.body).toEqual(sampleProvider);
  });
});

describe("GET /providers", () => {
  it("passes the validated query to findProviders and returns the list", async () => {
    vi.mocked(domain.findProviders).mockResolvedValue([sampleProvider]);

    const res = await request(app)
      .get("/providers")
      .query({ zip: "63108", service: "mowing", page: "2", limit: "5" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual([sampleProvider]);
    expect(domain.findProviders).toHaveBeenCalledWith({
      zip: "63108",
      service: "mowing",
      page: 2,
      limit: 5,
    });
  });

  it("rejects an invalid sort value with 400, before findProviders is ever called", async () => {
    const res = await request(app).get("/providers").query({ sort: "zip" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("ValidationFailed");
    expect(domain.findProviders).not.toHaveBeenCalled();
  });
});

describe("GET /providers/:id", () => {
  it("returns the provider when it exists", async () => {
    vi.mocked(domain.findProviderById).mockResolvedValue(sampleProvider);

    const res = await request(app).get(`/providers/${sampleProvider.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(sampleProvider);
    expect(domain.findProviderById).toHaveBeenCalledWith(sampleProvider.id);
  });

  it("returns 404 when no provider has that id", async () => {
    vi.mocked(domain.findProviderById).mockResolvedValue(null);

    const res = await request(app).get(`/providers/${sampleProvider.id}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Provider not found");
  });
});

describe("PATCH /providers/:id", () => {
  it("updates only the fields that were sent and returns the updated provider", async () => {
    const updated = { ...sampleProvider, phone: "555-0199" };
    vi.mocked(domain.updateProviderById).mockResolvedValue(updated);

    const res = await request(app)
      .patch(`/providers/${sampleProvider.id}`)
      .send({ phone: "555-0199" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(updated);
    expect(domain.updateProviderById).toHaveBeenCalledWith(sampleProvider.id, {
      phone: "555-0199",
    });
  });
});

describe("DELETE /providers/:id", () => {
  it("returns 204 with no body when the provider was deleted", async () => {
    vi.mocked(domain.deleteProviderById).mockResolvedValue(true);

    const res = await request(app).delete(`/providers/${sampleProvider.id}`);

    expect(res.status).toBe(204);
    expect(res.body).toEqual({});
  });

  it("returns 404 when there was nothing to delete", async () => {
    vi.mocked(domain.deleteProviderById).mockResolvedValue(false);

    const res = await request(app).delete(`/providers/${sampleProvider.id}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Provider not found");
  });
});
