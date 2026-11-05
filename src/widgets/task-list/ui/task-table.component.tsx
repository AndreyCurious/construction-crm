import { Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { ArrowUpRight } from "lucide-react";
import type { FC } from "react";
import { Link as RouterLink } from "react-router-dom";

import { StatusChip } from "@/entities/task";

import type { TaskListRow } from "../model/task-list.types";

import styles from "./task-list.module.css";

type TaskTableProps = {
  rows: TaskListRow[];
  showObject: boolean;
};

export const TaskTable: FC<TaskTableProps> = ({ rows, showObject }) => (
  <TableContainer>
    <Table className={styles.table} data-show-object={showObject} aria-label="Список задач">
      <TableHead>
        <TableRow>
          <TableCell>Задача</TableCell>
          {showObject && <TableCell>Объект</TableCell>}
          <TableCell>Исполнитель</TableCell>
          <TableCell>Статус</TableCell>
          <TableCell>Создана</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map(row => (
          <TableRow hover key={row.id}>
            <TableCell className={styles.titleCell}>
              <Link
                component={RouterLink}
                to={`/tasks/${row.id}`}
                underline="hover"
                color="text.primary"
                className={styles.link}
              >
                {row.title}
                <ArrowUpRight size={15} className={styles.linkIcon} />
              </Link>
            </TableCell>
            {showObject && <TableCell>{row.objectName}</TableCell>}
            <TableCell className={styles.assignee}>{row.assigneeName}</TableCell>
            <TableCell>
              <StatusChip status={row.status} />
            </TableCell>
            <TableCell className={styles.date}>{row.createdAt}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);
