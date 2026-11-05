import { Typography } from "@mui/material";
import type { FC } from "react";

import styles from "./page-state.module.css";

type EmptyStateProps = {
  title: string;
  description: string;
};

export const EmptyState: FC<EmptyStateProps> = ({ title, description }) => (
  <div className={styles.empty}>
    <Typography variant="h6">{title}</Typography>
    <Typography color="text.secondary" className={styles.description}>
      {description}
    </Typography>
  </div>
);
