import { CircularProgress } from "@mui/material";
import type { FC } from "react";

import styles from "./page-state.module.css";

export const LoadingState: FC = () => (
  <div role="status" aria-label="Загрузка" className={styles.loading}>
    <CircularProgress size={30} />
  </div>
);
