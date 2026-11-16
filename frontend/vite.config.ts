import react from "@vitejs/plugin-react";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },

  server: {
    // Vite forwards these paths to your Express server on port 3000.
    proxy: {
      "/providers": "http://localhost:3000",
      "/api": "http://localhost:3000",
      "/users": "http://localhost:3000",
      "/health": "http://localhost:3000",
    },
  },
});
