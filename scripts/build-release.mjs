import { spawnSync } from "node:child_process";
import { loadEnv } from "vite";

const environment = { ...loadEnv("production", process.cwd(), "VITE_"), ...process.env };
const url = environment.VITE_SUPABASE_URL?.trim();
const key = environment.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

function isSupabaseUrl(value) {
  try {
    const parsed = new URL(value);

    return /^https?:\/\//i.test(value) && (parsed.protocol === "https:" || parsed.protocol === "http:");
  } catch {
    return false;
  }
}

function isPublicKey(value) {
  if (!value) {
    return false;
  }
  if (/^sb_publishable_[a-zA-Z0-9_-]+$/.test(value)) {
    return true;
  }

  const parts = value.split(".");
  const payload = parts[1];

  if (parts.length !== 3 || !payload || parts.some(part => !/^[a-zA-Z0-9_-]+$/.test(part))) {
    return false;
  }

  try {
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));

    return claims.role === "anon";
  } catch {
    return false;
  }
}

if (!isSupabaseUrl(url) || !isPublicKey(key)) {
  console.error("Для релизной сборки укажите корректный VITE_SUPABASE_URL и публичный publishable/anon key.");
  process.exit(1);
}

const env = {
  ...environment,
  VITE_DATA_SOURCE: "supabase",
  VITE_SUPABASE_URL: url,
  VITE_SUPABASE_PUBLISHABLE_KEY: key
};
for (const args of [
  ["node_modules/typescript/bin/tsc", "-b"],
  ["node_modules/vite/bin/vite.js", "build"]
]) {
  const result = spawnSync(process.execPath, args, { cwd: process.cwd(), env, stdio: "inherit" });

  if (result.error || result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
