import { Chip, Typography } from "@mui/material";
import { Building2 } from "lucide-react";
import type { FC } from "react";

import styles from "./login-page.module.css";

export const LoginIntro: FC = () => (
  <div className={styles.intro}>
    <div className={styles.brand}>
      <Building2 size={29} />
      <Typography className={styles.brandName}>Объекты и задачи</Typography>
    </div>
    <div className={styles.introContent}>
      <Typography variant="overline" className={styles.eyebrow}>
        РАБОЧЕЕ ПРОСТРАНСТВО
      </Typography>
      <Typography component="h1" className={styles.headline}>
        Всё по объектам.
        <br />
        Каждая задача
        <br />
        под контролем.
      </Typography>
      <Typography className={styles.summary}>
        Назначайте работу, отслеживайте выполнение и принимайте результат в одном месте.
      </Typography>
      <div className={styles.tags}>
        {["Объекты", "Задачи", "История"].map(label => (
          <Chip key={label} label={label} variant="outlined" className={styles.tag} />
        ))}
      </div>
    </div>
    <Typography variant="caption" className={styles.caption}>
      Мини-CRM для строительной команды
    </Typography>
  </div>
);
