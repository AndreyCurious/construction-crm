import { Link } from "@mui/material";
import { ArrowUpRight } from "lucide-react";
import type { FC } from "react";
import { Link as RouterLink } from "react-router-dom";

import { StatusChip } from "@/entities/task";

import type { TaskListRow } from "../model/task-list.types";

import styles from "./task-cards.module.css";

type TaskCardsProps = {
  rows: TaskListRow[];
  showObject: boolean;
};

export const TaskCards: FC<TaskCardsProps> = ({ rows, showObject }) => (
  <ul className={styles.list} aria-label="Список задач">
    {rows.map(row => (
      <li key={row.id} className={styles.card}>
        <StatusChip status={row.status} />
        <Link
          component={RouterLink}
          to={`/tasks/${row.id}`}
          underline="hover"
          color="text.primary"
          className={styles.title}
        >
          {row.title}
          <ArrowUpRight size={16} className={styles.icon} />
        </Link>
        <dl className={styles.details}>
          {showObject && (
            <div>
              <dt>Объект</dt>
              <dd>{row.objectName}</dd>
            </div>
          )}
          <div>
            <dt>Исполнитель</dt>
            <dd>{row.assigneeName}</dd>
          </div>
          <div>
            <dt>Создана</dt>
            <dd>{row.createdAt}</dd>
          </div>
        </dl>
      </li>
    ))}
  </ul>
);
