import type { Identity, SignInInput } from "@/shared/model/crm.types";

import type { AuthApi, AuthListener } from "../api.types";
import type { CrmSupabaseClient } from "./supabase.types";

function toIdentity(
  user: {
    id: string;
    email?: string;
  } | null
): Identity | null {
  if (!user) {
    return null;
  }

  return { id: user.id, email: user.email ?? "" };
}

export function createSupabaseAuthApi(client: CrmSupabaseClient): AuthApi {
  return {
    async getIdentity(): Promise<Identity | null> {
      const { data, error } = await client.auth.getSession();

      if (error) {
        throw error;
      }

      return toIdentity(data.session?.user ?? null);
    },

    subscribe(listener: AuthListener): () => void {
      let currentIdentity: Identity | null | undefined;
      const { data } = client.auth.onAuthStateChange((_event, session) => {
        const nextIdentity = toIdentity(session?.user ?? null);

        if (
          currentIdentity !== undefined &&
          currentIdentity?.id === nextIdentity?.id &&
          currentIdentity?.email === nextIdentity?.email
        ) {
          return;
        }

        currentIdentity = nextIdentity;
        listener(nextIdentity);
      });

      return () => {
        data.subscription.unsubscribe();
      };
    },

    async signIn(input: SignInInput): Promise<Identity> {
      const { data, error } = await client.auth.signInWithPassword(input);

      if (error) {
        throw error;
      }

      const user = toIdentity(data.user);

      if (!user) {
        throw new Error("Не удалось войти в аккаунт");
      }

      return user;
    },

    async signOut(): Promise<void> {
      const { error } = await client.auth.signOut();

      if (error) {
        throw error;
      }
    }
  };
}
