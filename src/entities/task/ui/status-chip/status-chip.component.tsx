import { Chip } from "@mui/material";
import type { FC } from "react";

import { STATUS_LABELS } from "@/shared/lib/task-workflow";
import type { TaskStatus } from "@/shared/model/crm.types";

import styles from "./status-chip.module.css";

type StatusChipProps = {
  status: TaskStatus;
};

export const StatusChip: FC<StatusChipProps> = ({ status }) => (
  <Chip className={styles.chip} data-status={status} label={STATUS_LABELS[status]} size="small" />
);
