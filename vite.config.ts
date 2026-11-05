import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "**/demo-credentials.txt", "**/.artifacts/**"]
    }
  },
  build: { target: "es2022" },
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: {
    environment: "node",
    include: ["src/**/*.spec.ts", "supabase/tests/**/*.spec.ts"],
    maxWorkers: 2,
    testTimeout: 15000,
    hookTimeout: 30000
  }
});
