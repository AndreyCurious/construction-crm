import { Button, Paper, Typography } from "@mui/material";
import type { FC } from "react";

import { DEMO_ACCOUNTS, DEMO_PASSWORD } from "@/shared/api/demo/demo.accounts";

import styles from "./login-page.module.css";

type DemoAccountsProps = {
  onSelect: (email: string) => void;
};

export const DemoAccounts: FC<DemoAccountsProps> = ({ onSelect }) => (
  <Paper variant="outlined" className={styles.demo}>
    <Typography variant="body2" className={styles.demoTitle}>
      Локальная демонстрация
    </Typography>
    <Typography variant="caption" color="text.secondary">
      Выберите аккаунт — данные для входа заполнятся автоматически. Пароль: {DEMO_PASSWORD}
    </Typography>
    <div className={styles.accounts}>
      {DEMO_ACCOUNTS.map(account => (
        <Button
          key={account.id}

          variant="outlined"
          color="inherit"
          size="small"
          onClick={() => {
            onSelect(account.email);
          }}
        >
          {account.label} · {account.name}
        </Button>
      ))}
    </div>
  </Paper>
);
