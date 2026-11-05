import { Button, Divider, Typography } from "@mui/material";
import { Building2, ClipboardList } from "lucide-react";
import type { FC } from "react";
import { NavLink } from "react-router-dom";

import styles from "./app-layout.module.css";

type AppSidebarProps = {
  isManager: boolean;
  role: string;
};

export const AppSidebar: FC<AppSidebarProps> = ({ isManager, role }) => (
  <aside className={styles.sidebar}>
    <div className={styles.brand}>
      <div className={styles.logo}>
        <Building2 size={25} />
      </div>
      <div>
        <Typography className={styles.brandName}>Объекты и задачи</Typography>
        <Typography variant="caption" color="text.secondary">
          Рабочее пространство
        </Typography>
      </div>
    </div>
    <Typography variant="caption" className={styles.navigationLabel}>
      УПРАВЛЕНИЕ
    </Typography>
    <nav aria-label="Главная навигация" className={styles.navigation}>
      <Button
        component={NavLink}
        to="/objects"
        startIcon={<Building2 size={19} />}
        className={styles.navigationItem}
      >
        Объекты
      </Button>
      <Button
        component={NavLink}
        to="/tasks"
        startIcon={<ClipboardList size={19} />}
        className={styles.navigationItem}
      >
        {isManager ? "Все задачи" : "Мои задачи"}
      </Button>
    </nav>
    <div className={styles.role}>
      <Divider className={styles.divider} />
      <Typography variant="body2" className={styles.roleName}>
        {role}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {isManager ? "Управление всей командой" : "Личные задачи и объекты"}
      </Typography>
    </div>
  </aside>
);
