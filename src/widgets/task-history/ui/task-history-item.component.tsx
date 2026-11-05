import { Typography } from "@mui/material";
import { ArrowRight } from "lucide-react";
import type { FC } from "react";

import { STATUS_LABELS } from "@/entities/task";
import type { TaskHistoryEntry } from "@/entities/task";
import { formatDate } from "@/shared/lib/format-date";

import styles from "./task-history.module.css";

type TaskHistoryItemProps = {
  entry: TaskHistoryEntry;
};

export const TaskHistoryItem: FC<TaskHistoryItemProps> = ({ entry }) => {
  const previousStatus: string = entry.from_status ? STATUS_LABELS[entry.from_status] : "Создание задачи";
  const nextStatus: string = STATUS_LABELS[entry.to_status];

  return (
    <li className={styles.entry}>
      <div className={styles.author}>
        <Typography variant="body2" className={styles.name}>
          {entry.actor_name}
        </Typography>
        <Typography component="time" dateTime={entry.created_at} variant="caption" color="text.secondary">
          {formatDate(entry.created_at)}
        </Typography>
      </div>
      <div className={styles.transition}>
        <Typography variant="body2" color="text.secondary">
          {previousStatus}
        </Typography>
        <ArrowRight size={14} />
        <Typography variant="body2" className={styles.name}>
          {nextStatus}
        </Typography>
      </div>
      {entry.comment && (
        <Typography variant="body2" className={styles.comment}>
          {entry.comment}
        </Typography>
      )}
    </li>
  );
};
