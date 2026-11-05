import { Alert } from "@mui/material";
import type { FC } from "react";
import { Outlet } from "react-router-dom";

import { isDemo } from "@/shared/config/environment";
import { getErrorMessage } from "@/shared/lib/errors";

import { useAppLayout } from "../model/use-app-layout";
import { AppHeader } from "./app-header.component";
import { AppSidebar } from "./app-sidebar.component";

import styles from "./app-layout.module.css";

export const AppLayout: FC = () => {
  const layout = useAppLayout();

  return (
    <div className={styles.layout}>
      <AppSidebar isManager={layout.isManager} role={layout.role} />
      <div className={styles.workspace}>
        <AppHeader
          fullName={layout.fullName}
          role={layout.role}
          initials={layout.initials}
          email={layout.email}
          section={layout.section}
          signingOut={layout.signingOut}
          onSignOut={layout.signOut}
        />
        {isDemo && (
          <Alert severity="warning" icon={false} className={styles.demo}>
            Демонстрационный режим · Данные хранятся в этом браузере. Supabase пока не подключён.
          </Alert>
        )}
        <main className={styles.content}>
          {Boolean(layout.error) && (
            <Alert severity="error" onClose={layout.clearError} className={styles.error}>
              {getErrorMessage(layout.error)}
            </Alert>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
};
