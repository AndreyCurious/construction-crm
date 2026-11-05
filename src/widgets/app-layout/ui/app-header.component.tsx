import { Avatar, Button, Typography } from "@mui/material";
import { LogOut } from "lucide-react";
import type { FC } from "react";

import styles from "./app-layout.module.css";

type AppHeaderProps = {
  fullName: string;
  initials: string;
  role: string;
  email: string;
  section: string;
  signingOut: boolean;
  onSignOut: () => void;
};

export const AppHeader: FC<AppHeaderProps> = ({
  fullName,
  initials,
  role,
  email,
  section,
  signingOut,
  onSignOut
}) => (
  <header className={styles.header}>
    <Typography color="text.secondary" variant="body2" className={styles.breadcrumb}>
      Рабочее пространство <span className={styles.separator}>/</span>
      {section}
    </Typography>
    <div className={styles.user}>
      <Avatar className={styles.avatar}>{initials}</Avatar>
      <div>
        <Typography variant="body2" className={styles.userName}>
          {fullName}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {role}
        </Typography>
      </div>
      <Button
        aria-label="Выйти"
        title={`Выйти из ${email || "аккаунта"}`}
        color="inherit"
        disabled={signingOut}
        onClick={onSignOut}
        className={styles.signOut}
      >
        <LogOut size={17} />
      </Button>
    </div>
  </header>
);
