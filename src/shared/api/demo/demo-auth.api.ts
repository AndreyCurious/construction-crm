import type { Identity, SignInInput } from "@/shared/model/crm.types";

import type { AuthApi, AuthListener } from "../api.types";
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from "./demo.accounts";
import type { DemoStore } from "./demo.store";

export function createDemoAuthApi(store: DemoStore): AuthApi {
  return {
    async getIdentity(): Promise<Identity | null> {
      return store.identity;
    },

    subscribe(listener: AuthListener): () => void {
      return store.subscribe(listener);
    },

    async signIn(input: SignInInput): Promise<Identity> {
      const email = input.email.trim().toLowerCase();
      const account = DEMO_ACCOUNTS.find(item => item.email === email);

      if (!account || input.password !== DEMO_PASSWORD) {
        throw new Error("Invalid login credentials");
      }

      const identity: Identity = { id: account.id, email: account.email };

      store.setIdentity(identity);

      return identity;
    },

    async signOut(): Promise<void> {
      store.setIdentity(null);
    }
  };
}
