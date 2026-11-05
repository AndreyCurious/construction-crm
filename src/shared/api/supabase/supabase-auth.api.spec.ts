import { createClient } from "@supabase/supabase-js";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { describe, expect, it, vi } from "vitest";

import type { Identity } from "@/shared/model/crm.types";

import type { Database } from "../database.types";
import { createSupabaseAuthApi } from "./supabase-auth.api";

function setupAuth() {
  const client = createClient<Database>("https://crm.example", "public-key", {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  });
  const unsubscribe = vi.fn();
  let notify: (event: AuthChangeEvent, session: Session | null) => void = () => {
    throw new Error("Auth subscription is not registered");
  };

  vi.spyOn(client.auth, "onAuthStateChange").mockImplementation(callback => {
    notify = (event, session) => {
      void callback(event, session);
    };

    return { data: { subscription: { id: "test-subscription", callback: notify, unsubscribe } } };
  });

  const emit = (event: AuthChangeEvent, identity: Identity | null): void => {
    const session: Session | null = identity
      ? {
          access_token: "test-access-token",
          refresh_token: "test-refresh-token",
          token_type: "bearer",
          expires_in: 3600,
          user: {
            ...identity,
            aud: "authenticated",
            app_metadata: {},
            user_metadata: {},
            created_at: "2026-11-05T00:00:00Z"
          }
        }
      : null;

    notify(event, session);
  };

  return { api: createSupabaseAuthApi(client), emit, unsubscribe };
}

describe("Уведомления сессии Supabase", () => {
  it("не повторяет уведомление при подтверждении сессии и обновлении токена", () => {
    const { api, emit } = setupAuth();
    const listener = vi.fn();
    const identity = { id: "first-user", email: "first@example.com" };

    api.subscribe(listener);
    emit("INITIAL_SESSION", identity);
    emit("SIGNED_IN", { ...identity });
    emit("TOKEN_REFRESHED", { ...identity });
    emit("SIGNED_IN", { ...identity });

    expect(listener).toHaveBeenCalledExactlyOnceWith(identity);
  });

  it("сообщает об изменении email, смене пользователя и выходе", () => {
    const { api, emit, unsubscribe } = setupAuth();
    const listener = vi.fn();
    const initial = { id: "first-user", email: "first@example.com" };
    const updated = { ...initial, email: "updated@example.com" };
    const other = { id: "second-user", email: "second@example.com" };
    const stop = api.subscribe(listener);

    emit("INITIAL_SESSION", null);
    emit("SIGNED_IN", initial);
    emit("USER_UPDATED", updated);
    emit("SIGNED_IN", other);
    emit("SIGNED_OUT", null);
    emit("SIGNED_OUT", null);
    stop();

    expect(listener.mock.calls).toEqual([[null], [initial], [updated], [other], [null]]);
    expect(unsubscribe).toHaveBeenCalledOnce();
  });
});
