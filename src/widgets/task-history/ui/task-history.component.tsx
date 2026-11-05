import { Paper, Typography } from "@mui/material";
import { History } from "lucide-react";
import type { FC } from "react";

import type { TaskHistoryEntry } from "@/entities/task";

import { TaskHistoryItem } from "./task-history-item.component";

import styles from "./task-history.module.css";

type TaskHistoryProps = {
  entries: TaskHistoryEntry[];
};

export const TaskHistory: FC<TaskHistoryProps> = ({ entries }) => (
  <Paper variant="outlined" className={styles.container}>
    <header className={styles.header}>
      <History size={20} className={styles.icon} />
      <Typography variant="h6">История задачи</Typography>
      <Typography variant="body2" color="text.secondary" className={styles.count}>
        {entries.length}
      </Typography>
    </header>
    {entries.length === 0 && <Typography color="text.secondary">История пока пуста.</Typography>}
    <ol className={styles.entries}>
      {entries.map(entry => (
        <TaskHistoryItem key={entry.id} entry={entry} />
      ))}
    </ol>
  </Paper>
);
