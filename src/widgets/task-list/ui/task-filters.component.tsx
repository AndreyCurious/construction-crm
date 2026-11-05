import { InputAdornment, MenuItem, TextField, Typography } from "@mui/material";
import { Search } from "lucide-react";
import type { FC } from "react";

import { STATUS_LABELS } from "@/entities/task";

import type { TaskFiltersProps } from "../model/task-list.types";

import styles from "./task-list.module.css";

export const TaskFilters: FC<TaskFiltersProps> = ({
  search,
  status,
  count,
  onSearchChange,
  onStatusChange
}) => (
  <div className={styles.filters}>
    <TextField
      placeholder="Найти задачу"
      value={search}
      onChange={onSearchChange}
      className={styles.search}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Search size={17} />
            </InputAdornment>
          )
        },
        htmlInput: { "aria-label": "Поиск задач" }
      }}
    />
    <TextField select label="Статус" value={status} onChange={onStatusChange} className={styles.status}>
      <MenuItem value="all">Все статусы</MenuItem>
      {Object.entries(STATUS_LABELS).map(([value, label]) => (
        <MenuItem key={value} value={value}>
          {label}
        </MenuItem>
      ))}
    </TextField>
    <Typography variant="body2" color="text.secondary" className={styles.count}>
      Найдено: {count}
    </Typography>
  </div>
);
