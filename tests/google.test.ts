// Provided for the LawnConnect reference build, Day 47 (Section 10.6 of the Build Guide).
// Copy it into the tests folder of lawconnect-ts as it is.
//
// These tests run your real src/auth.ts and your real app, but with a pretend
// database and a pretend Google. They need no .env values, no Atlas and no
// internet, and they never touch your real client ID or secret.

import {
  describe,
  it,
  expect,
  vi,
  beforeAll,
  beforeEach,
  afterAll,
} from "vitest";
import request from "supertest";
import { readFileSync } from "node:fs";

// The shared tests/setup.ts replaces src/auth.ts with a fake. This file wants
// your real one, so it turns that fake off, for this file only.
vi.unmock("../src/auth.js");

// Pretend settings. Set before anything is imported.
const env = vi.hoisted(() => {
  const values = {
    BETTER_AUTH_URL: "http://localhost:3000",
    BETTER_AUTH_SECRET: "test-secret-test-secret-test-secret-1234",
    CLIENT_ORIGIN: "http://localhost:5173",
    GOOGLE_CLIENT_ID: "test-client-id.apps.googleusercontent.com",
    GOOGLE_CLIENT_SECRET: "test-client-secret",
    // db.ts insists on these two being set; the tests never connect to anything.
    MONGO_URI: "mongodb://127.0.0.1:1",
    DB_NAME: "never-connected",
  };
  Object.assign(process.env, values);
  // better-auth turns its address checks OFF when it thinks it is running in a
  // test. These tests want them ON, like in the real server, so they tell it
  // this is not a test.
  process.env.NODE_ENV = "development";
  process.env.TEST = "false";
  return values;
});

// A pretend database: better-auth keeps its people and sessions in these lists.
const tables = vi.hoisted(
  () =>
    ({
      user: [],
      session: [],
      account: [],
      verification: [],
    }) as Record<string, any[]>,
);

vi.mock("../src/db.js", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../src/db.js")>()),
  connectToDatabase: async () => ({}),
}));
vi.mock("better-auth/adapters/mongodb", async () => {
  const { memoryAdapter } = await import("better-auth/adapters/memory");
  return { mongodbAdapter: () => memoryAdapter(tables) };
});

// Pretend Google. When your server swaps the one-time code for the person's
// details, this answers instead of Google. The code IS the email address, so a
// test chooses who "signed in at Google" by choosing the code.
const realFetch = globalThis.fetch;
function pretendGoogle(input: any, init?: any) {
  const url = typeof input === "string" ? input : (input.url ?? String(input));
  if (!url.startsWith("https://oauth2.googleapis.com/token")) {
    return realFetch(input, init);
  }
  const code = new URLSearchParams(String(init?.body ?? "")).get("code");
  const part = (o: object) =>
    Buffer.from(JSON.stringify(o)).toString("base64url");
  const idToken = [
    part({ alg: "none", typ: "JWT" }),
    part({
      iss: "https://accounts.google.com",
      aud: env.GOOGLE_CLIENT_ID,
      sub: `google-${code}`,
      email: code,
      email_verified: true,
      name: "Dana Google",
    }),
    "x",
  ].join(".");
  return Promise.resolve(
    new Response(
      JSON.stringify({
        access_token: "pretend-access-token",
        id_token: idToken,
        token_type: "Bearer",
        expires_in: 3600,
      }),
      { status: 200, headers: { "content-type": "application/json" } },
    ),
  );
}

const ORIGIN = "http://localhost:5173";
const AFTER_LOGIN = "http://localhost:3000/api/auth/get-session";

let app: Parameters<typeof request>[0];

beforeAll(async () => {
  vi.stubGlobal("fetch", pretendGoogle);
  app = (await import("../src/app.js")).app;
});

afterAll(() => {
  vi.unstubAllGlobals();
});

beforeEach(() => {
  for (const list of Object.values(tables)) list.length = 0;
});

// Ask your server to start a Google login. Returns the answer.
function startLogin(
  agent: ReturnType<typeof request.agent>,
  callbackURL = AFTER_LOGIN,
) {
  return agent
    .post("/api/auth/sign-in/social")
    .set("Origin", ORIGIN)
    .send({ provider: "google", callbackURL });
}

const stateIn = (res: { body: { url: string } }) =>
  new URL(res.body.url).searchParams.get("state") as string;

// The whole trip: start the login, "sign in at Google" as this email, come back.
async function signInWithGoogle(
  agent: ReturnType<typeof request.agent>,
  email: string,
) {
  const start = await startLogin(agent);
  return agent.get(
    `/api/auth/callback/google?code=${encodeURIComponent(email)}&state=${stateIn(start)}`,
  );
}

describe("Part 1: the Google settings", () => {
  it("refuses to start when GOOGLE_CLIENT_ID is missing", async () => {
    const saved = process.env.GOOGLE_CLIENT_ID;
    delete process.env.GOOGLE_CLIENT_ID;
    vi.resetModules();
    try {
      await expect(import("../src/auth.js")).rejects.toThrow(
        "GOOGLE_CLIENT_ID is not set - add it to your .env file",
      );
    } finally {
      process.env.GOOGLE_CLIENT_ID = saved;
    }
  });

  it("refuses to start when GOOGLE_CLIENT_SECRET is missing", async () => {
    const saved = process.env.GOOGLE_CLIENT_SECRET;
    delete process.env.GOOGLE_CLIENT_SECRET;
    vi.resetModules();
    try {
      await expect(import("../src/auth.js")).rejects.toThrow(
        "GOOGLE_CLIENT_SECRET is not set - add it to your .env file",
      );
    } finally {
      process.env.GOOGLE_CLIENT_SECRET = saved;
    }
  });

  it("keeps .env out of git", () => {
    const lines = readFileSync(".gitignore", "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim());
    expect(
      lines.some((l) => [".env", "/.env", ".env*", "*.env"].includes(l)),
    ).toBe(true);
  });
});

describe("Part 2: starting the login", () => {
  it("answers 200 with an address on Google to go to", async () => {
    const res = await startLogin(request.agent(app));
    expect(res.status).toBe(200);
    expect(res.body.redirect).toBe(true);
    const url = new URL(res.body.url);
    expect(url.origin + url.pathname).toBe(
      "https://accounts.google.com/o/oauth2/v2/auth",
    );
  });

  it("puts your client ID, your redirect address and the scopes in that address", async () => {
    const res = await startLogin(request.agent(app));
    const params = new URL(res.body.url).searchParams;
    expect(params.get("client_id")).toBe(env.GOOGLE_CLIENT_ID);
    expect(params.get("redirect_uri")).toBe(
      "http://localhost:3000/api/auth/callback/google",
    );
    expect(params.get("response_type")).toBe("code");
    expect(params.get("scope")?.split(" ").sort()).toEqual([
      "email",
      "openid",
      "profile",
    ]);
  });

  it("adds a state and a PKCE challenge", async () => {
    const res = await startLogin(request.agent(app));
    const params = new URL(res.body.url).searchParams;
    expect(params.get("state")?.length).toBeGreaterThan(10);
    expect(params.get("code_challenge")?.length).toBeGreaterThan(10);
    expect(params.get("code_challenge_method")).toBe("S256");
  });

  it("never puts the client secret in the answer", async () => {
    const res = await startLogin(request.agent(app));
    expect(JSON.stringify(res.body)).not.toContain(env.GOOGLE_CLIENT_SECRET);
  });

  it("refuses a callbackURL on another site (403 INVALID_CALLBACK_URL)", async () => {
    const res = await startLogin(
      request.agent(app),
      "http://evil.example.com/",
    );
    expect(res.status).toBe(403);
    expect(res.body).toEqual({
      message: "Invalid callbackURL",
      code: "INVALID_CALLBACK_URL",
    });
  });

  it("refuses a signed-in browser that sends no Origin (403 MISSING_OR_NULL_ORIGIN)", async () => {
    const agent = request.agent(app);
    await signInWithGoogle(agent, "dana@gmail.example");
    const res = await agent
      .post("/api/auth/sign-in/social")
      .send({ provider: "google", callbackURL: AFTER_LOGIN });
    expect(res.status).toBe(403);
    expect(res.body.code).toBe("MISSING_OR_NULL_ORIGIN");
  });

  it("answers 404 PROVIDER_NOT_FOUND for a provider you did not set up", async () => {
    const res = await request(app)
      .post("/api/auth/sign-in/social")
      .set("Origin", ORIGIN)
      .send({ provider: "github", callbackURL: AFTER_LOGIN });
    expect(res.status).toBe(404);
    expect(res.body.code).toBe("PROVIDER_NOT_FOUND");
  });
});

describe("Part 3: the trip back from Google", () => {
  it("signs the person in and sends the browser on to the callbackURL", async () => {
    const agent = request.agent(app);
    const res = await signInWithGoogle(agent, "dana@gmail.example");
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe(AFTER_LOGIN);
    const cookies = ([] as string[])
      .concat(res.headers["set-cookie"] ?? [])
      .join(";");
    expect(cookies).toContain("better-auth.session_token=");
  });

  it("shows the Google person on GET /api/me, with the role user (no real role yet)", async () => {
    const agent = request.agent(app);
    await signInWithGoogle(agent, "dana@gmail.example");
    const res = await agent.get("/api/me");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      userId: expect.any(String),
      fullName: "Dana Google",
      role: "user",
    });
  });

  it("lets the person in, but they cannot create a provider yet (403)", async () => {
    const agent = request.agent(app);
    await signInWithGoogle(agent, "dana@gmail.example");
    const res = await agent
      .post("/providers")
      .set("Origin", ORIGIN)
      .send({ name: "Green Thumb Lawn Care" });
    expect(res.status).toBe(403);
    expect(res.body).toEqual({ error: "Your role may not provider:create" });
  });

  it("does not create a second person when they sign in with Google again", async () => {
    await signInWithGoogle(request.agent(app), "dana@gmail.example");
    await signInWithGoogle(request.agent(app), "dana@gmail.example");
    expect(
      tables.user.filter((u) => u.email === "dana@gmail.example"),
    ).toHaveLength(1);
  });

  it("does not finish a login that was started somewhere else (state_mismatch)", async () => {
    // Start in one place (like Postman)...
    const start = await startLogin(request.agent(app));
    // ...and come back in another (like Chrome), which never got the state cookie.
    const chrome = request.agent(app);
    const res = await chrome.get(
      `/api/auth/callback/google?code=dana%40gmail.example&state=${stateIn(start)}`,
    );
    expect(res.status).toBe(302);
    expect(res.headers.location).toContain("error=state_mismatch");
    expect((await chrome.get("/api/me")).status).toBe(401);
  });

  it("does not merge with a password sign-up that has the same email (account_not_linked)", async () => {
    await request(app)
      .post("/api/auth/sign-up/email")
      .set("Origin", ORIGIN)
      .send({
        name: "Eve Email",
        email: "eve@gmail.example",
        password: "correct-horse-9",
      });

    const agent = request.agent(app);
    const res = await signInWithGoogle(agent, "eve@gmail.example");
    expect(res.headers.location).toContain("error=account_not_linked");
    expect((await agent.get("/api/me")).status).toBe(401);
    expect(
      tables.user.filter((u) => u.email === "eve@gmail.example"),
    ).toHaveLength(1);
  });
});

describe("Optional part: giving the Google person a role", () => {
  it("an admin can make the Google person a provider", async () => {
    // Ada signs up, and is made an admin by hand (the Compass step).
    const ada = request.agent(app);
    await ada
      .post("/api/auth/sign-up/email")
      .set("Origin", ORIGIN)
      .send({
        name: "Ada Admin",
        email: "ada@example.com",
        password: "correct-horse-9",
      });
    tables.user.find((u) => u.email === "ada@example.com")!.role = "admin";

    const dana = request.agent(app);
    await signInWithGoogle(dana, "dana@gmail.example");
    const { userId } = (await dana.get("/api/me")).body;

    const res = await ada
      .patch(`/users/${userId}/role`)
      .set("Origin", ORIGIN)
      .send({ role: "provider" });
    expect(res.status).toBe(200);
    expect((await dana.get("/api/me")).body.role).toBe("provider");
  });

  it("the Google person cannot give themselves a role (403)", async () => {
    const dana = request.agent(app);
    await signInWithGoogle(dana, "dana@gmail.example");
    const { userId } = (await dana.get("/api/me")).body;
    const res = await dana
      .patch(`/users/${userId}/role`)
      .set("Origin", ORIGIN)
      .send({ role: "admin" });
    expect(res.status).toBe(403);
    expect((await dana.get("/api/me")).body.role).toBe("user");
  });
});
