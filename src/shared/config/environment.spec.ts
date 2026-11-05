import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const PUBLISHABLE_KEY = "sb_publishable_test_key";

function legacyKey(role: string): string {
  return [btoa(JSON.stringify({ alg: "HS256" })), btoa(JSON.stringify({ role })), "signature"]
    .join(".")
    .replaceAll("=", "")
    .replaceAll("+", "-")
    .replaceAll("/", "_");
}

beforeEach(() => {
  vi.resetModules();
  vi.stubEnv("VITE_DATA_SOURCE", "supabase");
  vi.stubEnv("VITE_SUPABASE_URL", "https://crm.supabase.co");
  vi.stubEnv("VITE_SUPABASE_PUBLISHABLE_KEY", PUBLISHABLE_KEY);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("Настройки подключения", () => {
  it.each(["https://crm.supabase.co", "http://127.0.0.1:54321"])("принимает URL %s", async url => {
    vi.stubEnv("VITE_SUPABASE_URL", url);

    const environment = await import("./environment");

    expect(environment.isConfigured).toBe(true);
  });

  it("принимает legacy anon key", async () => {
    vi.stubEnv("VITE_SUPABASE_PUBLISHABLE_KEY", legacyKey("anon"));

    const environment = await import("./environment");

    expect(environment.isConfigured).toBe(true);
  });

  it.each(["", "not-a-url", "https://", "https:crm.supabase.co", "ftp://crm.supabase.co"])(
    "не ломает загрузку API при неверном URL: %s",
    async url => {
      vi.stubEnv("VITE_SUPABASE_URL", url);

      const environment = await import("./environment");
      const { getApi } = await import("../api/api-client");

      expect(environment.isConfigured).toBe(false);
      expect(getApi).toThrow("Приложение не настроено");
    }
  );

  it.each(["", "sb_publishable_", "sb_secret_test_key", legacyKey("service_role"), "invalid.key.value"])(
    "отклоняет отсутствующий, неверный или административный ключ: %s",
    async key => {
      vi.stubEnv("VITE_SUPABASE_PUBLISHABLE_KEY", key);

      const environment = await import("./environment");

      expect(environment.isConfigured).toBe(false);
    }
  );

  it("убирает пробелы вокруг параметров подключения", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", " https://crm.supabase.co ");
    vi.stubEnv("VITE_SUPABASE_PUBLISHABLE_KEY", ` ${PUBLISHABLE_KEY} `);

    const environment = await import("./environment");

    expect(environment.isConfigured).toBe(true);
    expect(environment.supabaseUrl).toBe("https://crm.supabase.co");
    expect(environment.supabaseKey).toBe(PUBLISHABLE_KEY);
  });

  it("позволяет деморежим без параметров Supabase", async () => {
    vi.stubEnv("VITE_DATA_SOURCE", "demo");
    vi.stubEnv("VITE_SUPABASE_URL", "");
    vi.stubEnv("VITE_SUPABASE_PUBLISHABLE_KEY", "");

    const environment = await import("./environment");

    expect(environment.isConfigured).toBe(true);
    expect(environment.isDemo).toBe(true);
  });
});
