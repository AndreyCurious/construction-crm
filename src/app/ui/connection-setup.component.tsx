import { Paper, Typography } from "@mui/material";
import type { FC } from "react";

import styles from "../app.module.css";

export const ConnectionSetup: FC = () => (
  <div className={styles.container}>
    <Paper variant="outlined" className={styles.panel}>
      <Typography variant="h5" className={styles.title}>
        Настройка подключения
      </Typography>
      <Typography>
        Проверьте URL Supabase и публичный publishable/anon key в .env.local. Инструкция — в
        docs/supabase-setup.md. После исправления перезапустите приложение.
      </Typography>
      <Typography className={styles.description} color="text.secondary">
        Для локального просмотра добавьте VITE_DATA_SOURCE=demo в .env.local.
      </Typography>
    </Paper>
  </div>
);
