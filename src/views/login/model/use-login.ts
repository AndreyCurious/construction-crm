import { useState } from "react";
import type { ChangeEvent, SubmitEvent } from "react";

import { getApi } from "@/shared/api";
import { DEMO_PASSWORD } from "@/shared/api/demo/demo.accounts";

type UseLoginResult = {
  email: string;
  password: string;
  pending: boolean;
  error: unknown;
  changeEmail: (event: ChangeEvent<HTMLInputElement>) => void;
  changePassword: (event: ChangeEvent<HTMLInputElement>) => void;
  selectAccount: (email: string) => void;
  submit: (event: SubmitEvent<HTMLFormElement>) => void;
};

export function useLogin(): UseLoginResult {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const changeEmail = (event: ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
  };

  const changePassword = (event: ChangeEvent<HTMLInputElement>): void => {
    setPassword(event.target.value);
  };

  const selectAccount = (email: string): void => {
    setEmail(email);
    setPassword(DEMO_PASSWORD);
    setError(null);
  };

  const submit = (event: SubmitEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setPending(true);
    setError(null);

    void getApi()
      .signIn({ email: email.trim(), password })
      .catch(setError)
      .finally(() => {
        setPending(false);
      });
  };

  return { email, password, pending, error, changeEmail, changePassword, selectAccount, submit };
}
