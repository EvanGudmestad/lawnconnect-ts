import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

// No baseURL on purpose: the browser talks to its own address, and in development
// Vite's proxy forwards /api to Express. That keeps the cookie on one origin.
export const authClient = createAuthClient({
  plugins: [adminClient()],
});
