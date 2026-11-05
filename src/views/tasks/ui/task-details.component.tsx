import { Button, Divider, Link, Paper, Typography } from "@mui/material";
import type { FC } from "react";
import { Link as RouterLink } from "react-router-dom";

import type { Task, TaskAction, TaskStatus } from "@/entities/task";

import type { TaskDetail } from "../model/task-page.types";

import styles from "./task-page.module.css";

type TaskDetailsProps = {
  task: Task;
  objectName: string;
  details: TaskDetail[];
  actions: TaskAction[];
  actionHint: string;
  onTransition: (status: TaskStatus) => void;
};

export const TaskDetails: FC<TaskDetailsProps> = ({
  task,
  objectName,
  details,
  actions,
  actionHint,
  onTransition
}) => (
  <Paper variant="outlined" className={styles.details}>
    <Typography variant="h6" className={styles.sectionTitle}>
      Описание
    </Typography>
    <Typography color={task.description ? "text.primary" : "text.secondary"} className={styles.description}>
      {task.description || "Описание не добавлено."}
    </Typography>
    <Divider className={styles.divider} />
    <div className={styles.metadata}>
      <div>
        <Typography variant="body2" color="text.secondary" className={styles.label}>
          Объект
        </Typography>
        <Link component={RouterLink} to={`/objects/${task.object_id}`} underline="hover">
          {objectName}
        </Link>
      </div>
      {details.map(detail => (
        <div key={detail.label}>
          <Typography variant="body2" color="text.secondary" className={styles.label}>
            {detail.label}
          </Typography>
          <Typography variant="body2" className={styles.detailValue}>
            {detail.value}
          </Typography>
        </div>
      ))}
    </div>
    <Divider className={styles.divider} />
    {actions.length === 0 ? (
      <Typography variant="body2" color="text.secondary">
        {actionHint}
      </Typography>
    ) : (
      <div className={styles.workflowActions}>
        {actions.map(action => (
          <Button
            key={action.status}

            onClick={() => {
              onTransition(action.status);
            }}
            variant={action.status === "revision" ? "outlined" : "contained"}
            color={action.status === "revision" ? "warning" : "primary"}
          >
            {action.label}
          </Button>
        ))}
      </div>
    )}
  </Paper>
);
