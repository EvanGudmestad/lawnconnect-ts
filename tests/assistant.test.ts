import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { APICallError, NoObjectGeneratedError } from "ai";

const getSession = vi.fn();
vi.mock("../src/auth.js", () => ({
  auth: { handler: vi.fn(), api: { getSession } },
}));

const suggestService = vi.fn();
// Same stand-in as providers.test.ts: no test may reach a real database.
vi.mock("../src/domain/providers.js", () => ({
  findProviders: vi.fn(),
  findProviderById: vi.fn(),
  insertProvider: vi.fn(),
  updateProviderById: vi.fn(),
  deleteProviderById: vi.fn(),
}));

vi.mock("../src/agent/assistant.js", () => ({ suggestService }));

const { app } = await import("../src/app.js");

const body = { request: "My lawn needs mowing before Saturday, zip 63101." };
const suggestion = {
  service: "mowing",
  urgency: "high",
  providerIds: [],
  reason: "Mowing needed soon.",
};

// What the AI SDK throws when Groq answers with an error.
function groqError(statusCode: number, extra: Partial<ConstructorParameters<typeof APICallError>[0]> = {}) {
  return new APICallError({
    message: `Groq answered ${statusCode}`,
    url: "https://api.groq.com/openai/v1/chat/completions",
    requestBodyValues: {},
    statusCode,
    ...extra,
  });
}

describe("POST /assistant", () => {
  beforeEach(() => {
    suggestService.mockReset();
    vi.spyOn(console, "error").mockImplementation(() => {}); // the 502 tests log on purpose
    getSession.mockResolvedValue({ user: { id: "u1", name: "Dana Dev" } });
  });

  it("is 401 when signed out, and never calls the assistant", async () => {
    getSession.mockResolvedValue(null);
    const res = await request(app).post("/assistant").send(body);
    expect(res.status).toBe(401);
    expect(suggestService).not.toHaveBeenCalled();
  });

  it("returns the assistant's suggestion", async () => {
    suggestService.mockResolvedValue(suggestion);
    const res = await request(app).post("/assistant").send(body);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ suggestion });
  });

  it("is 400 for an empty body and never calls the assistant", async () => {
    const res = await request(app).post("/assistant").send({});
    expect(res.status).toBe(400);
    expect(suggestService).not.toHaveBeenCalled();
  });

  it("is 400 for an extra field, because the schema is strict", async () => {
    const res = await request(app)
      .post("/assistant")
      .send({ ...body, role: "admin" });
    expect(res.status).toBe(400);
  });

  it("is 400 for a request that is too long", async () => {
    const res = await request(app)
      .post("/assistant")
      .send({ request: "x".repeat(501) });
    expect(res.status).toBe(400);
  });

  it("answers 429 with retry-after when Groq's limit is reached", async () => {
    suggestService.mockRejectedValue(groqError(429, { responseHeaders: { "retry-after": "7" } }));
    const res = await request(app).post("/assistant").send(body);
    expect(res.status).toBe(429);
    expect(res.headers["retry-after"]).toBe("7");
    expect(res.body.error).toBe("The assistant is busy. Try again in 7 seconds.");
  });

  it("falls back to 60 seconds with no retry-after header", async () => {
    suggestService.mockRejectedValue(groqError(429));
    const res = await request(app).post("/assistant").send(body);
    expect(res.status).toBe(429);
    expect(res.headers["retry-after"]).toBe("60");
  });

  it("answers 502 when the answer does not fit the schema", async () => {
    suggestService.mockRejectedValue(
      new NoObjectGeneratedError({
        message: "No object generated: response did not match schema.",
        response: {} as never,
        usage: {} as never,
        finishReason: "stop",
      }),
    );
    const res = await request(app).post("/assistant").send(body);
    expect(res.status).toBe(502);
    expect(res.body.error).toMatch(/could not use/i);
  });

  it("answers 502 when the model answers in plain words", async () => {
    suggestService.mockRejectedValue(
      groqError(400, { responseBody: '{"error":{"code":"tool_use_failed"}}' }),
    );
    const res = await request(app).post("/assistant").send(body);
    expect(res.status).toBe(502);
    expect(res.body.error).toMatch(/could not use/i);
  });
});
