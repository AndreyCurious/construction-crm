const source: unknown = import.meta.env.VITE_DATA_SOURCE;
const url: unknown = import.meta.env.VITE_SUPABASE_URL;
const key: unknown = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

function isSupabaseUrl(value: string): boolean {
  try {
    const parsed = new URL(value);

    return /^https?:\/\//i.test(value) && (parsed.protocol === "https:" || parsed.protocol === "http:");
  } catch {
    return false;
  }
}

function isPublicKey(value: string): boolean {
  if (/^sb_publishable_[a-zA-Z0-9_-]+$/.test(value)) {
    return true;
  }

  const parts = value.split(".");
  const payload = parts[1];

  if (parts.length !== 3 || !payload || parts.some(part => !/^[a-zA-Z0-9_-]+$/.test(part))) {
    return false;
  }

  try {
    const claims: unknown = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));

    return typeof claims === "object" && claims !== null && "role" in claims && claims.role === "anon";
  } catch {
    return false;
  }
}

export const isDemo = source === "demo";
export const supabaseUrl = typeof url === "string" ? url.trim() : "";
export const supabaseKey = typeof key === "string" ? key.trim() : "";
export const isConfigured = isDemo || (isSupabaseUrl(supabaseUrl) && isPublicKey(supabaseKey));
