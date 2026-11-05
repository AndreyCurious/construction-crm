import { Alert, Button } from "@mui/material";
import { Component } from "react";
import type { PropsWithChildren, ReactNode } from "react";

import styles from "./error-boundary.module.css";

type ErrorBoundaryState = {
  failed: boolean;
};

export class ErrorBoundary extends Component<PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { failed: true };
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.failed) {
      return (
        <div className={styles.container}>
          <Alert severity="error" className={styles.message}>
            Не удалось отобразить страницу. Обновите приложение.
          </Alert>
          <Button variant="outlined" onClick={this.handleReload}>
            Обновить
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
