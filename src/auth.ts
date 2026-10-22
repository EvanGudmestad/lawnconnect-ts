import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { connectToDatabase } from "./db.js";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set - add it to your .env file`);
  return value;
}

const db = await connectToDatabase();

export const auth = betterAuth({
  baseURL: requireEnv("BETTER_AUTH_URL"),
  secret: requireEnv("BETTER_AUTH_SECRET"),
  trustedOrigins: [requireEnv("CLIENT_ORIGIN")],
  database: mongodbAdapter(db),
  emailAndPassword: { enabled: true },
});
