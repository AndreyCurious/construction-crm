import { Alert, Button, InputAdornment, TextField, Typography } from "@mui/material";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import type { FC } from "react";
import { Navigate } from "react-router-dom";

import { useSession } from "@/entities/session";
import { isDemo } from "@/shared/config/environment";
import { getErrorMessage } from "@/shared/lib/errors";
import { LoadingState } from "@/shared/ui/page-state";

import { useLogin } from "../model/use-login";
import { DemoAccounts } from "./demo-accounts.component";
import { LoginIntro } from "./login-intro.component";

import styles from "./login-page.module.css";

export const LoginPage: FC = () => {
  const { identity, loading } = useSession();
  const login = useLogin();

  if (loading) {
    return <LoadingState />;
  }

  if (identity) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={styles.layout}>
      <LoginIntro />
      <div className={styles.formContainer}>
        <form onSubmit={login.submit} className={styles.form}>
          <Typography variant="h4" component="h2">
            Вход в систему
          </Typography>
          <Typography color="text.secondary" className={styles.description}>
            Введите данные вашей рабочей учётной записи
          </Typography>
          <div className={styles.fields}>
            {Boolean(login.error) && <Alert severity="error">{getErrorMessage(login.error)}</Alert>}
            <TextField
              required
              label="Email"
              type="email"
              autoComplete="username"
              value={login.email}
              onChange={login.changeEmail}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail size={18} />
                    </InputAdornment>
                  )
                }
              }}
            />
            <TextField
              required
              label="Пароль"
              type="password"
              autoComplete="current-password"
              value={login.password}
              onChange={login.changePassword}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockKeyhole size={18} />
                    </InputAdornment>
                  )
                }
              }}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={login.pending}
              endIcon={<ArrowRight size={18} />}
              className={styles.submit}
            >
              {login.pending ? "Входим…" : "Войти"}
            </Button>
          </div>
          <Typography variant="body2" color="text.secondary" className={styles.notice}>
            Доступ выдаёт администратор вашей команды.
          </Typography>
          {isDemo && <DemoAccounts onSelect={login.selectAccount} />}
        </form>
      </div>
    </div>
  );
};
