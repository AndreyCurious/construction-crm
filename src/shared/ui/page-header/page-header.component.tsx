import { Typography } from "@mui/material";
import type { FC, ReactNode } from "react";

import styles from "./page-header.module.css";

type PageHeaderProps = {
  title: string;
  description: string;
  actions?: ReactNode;
};

export const PageHeader: FC<PageHeaderProps> = ({ title, description, actions }) => (
  <div className={styles.header}>
    <div className={styles.content}>
      <Typography variant="h4" component="h1" className={styles.title}>
        {title}
      </Typography>
      <Typography color="text.secondary" className={styles.description}>
        {description}
      </Typography>
    </div>
    {actions}
  </div>
);
