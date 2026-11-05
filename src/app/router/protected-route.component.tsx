import { Alert, Button } from "@mui/material";
import type { FC } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useSession } from "@/entities/session";
import { getApi } from "@/shared/api";
import { LoadingState } from "@/shared/ui/page-state";

import styles from "../app.module.css";

export const ProtectedRoute: FC = () => {
  const { identity, profile, loading, error, refreshError, retryProfile } = useSession();

  const reload = (): void => {
    window.location.reload();
  };

  const signOut = (): void => {
    void getApi().signOut().catch(reload);
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorActions}>
          <Alert severity="error">
            Не удалось загрузить профиль. Проверьте подключение и наличие профиля пользователя в базе.
          </Alert>
          <Button onClick={reload}>Повторить</Button>
          <Button onClick={signOut}>Выйти из аккаунта</Button>
        </div>
      </div>
    );
  }

  if (!identity || !profile) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {refreshError && (
        <Alert
          severity="warning"
          action={
            <Button color="inherit" onClick={retryProfile}>
              Повторить
            </Button>
          }
        >
          Не удалось обновить профиль. Показаны последние загруженные данные.
        </Alert>
      )}
      <Outlet />
    </>
  );
};
