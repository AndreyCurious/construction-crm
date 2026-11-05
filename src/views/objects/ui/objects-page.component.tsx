import { Button, Chip, Paper, Typography } from "@mui/material";
import { Plus } from "lucide-react";
import type { FC } from "react";

import { ObjectDialog } from "@/features/object-editor";
import { PageHeader } from "@/shared/ui/page-header";
import { EmptyState, ErrorState, LoadingState } from "@/shared/ui/page-state";

import { useObjectsPage } from "../model/use-objects-page";
import { ObjectCard } from "./object-card.component";

import styles from "./objects-page.module.css";

export const ObjectsPage: FC = () => {
  const page = useObjectsPage();
  const description: string = page.isManager
    ? "Строительные объекты и работа команды"
    : "Объекты, на которых вам назначены задачи";
  const emptyDescription: string = page.isManager
    ? "Добавьте первый строительный объект, чтобы назначать задачи команде."
    : "Объект появится здесь, когда вам назначат первую задачу.";

  if (page.loading) {
    return <LoadingState />;
  }

  if (page.error) {
    return <ErrorState error={page.error} retry={page.retry} />;
  }

  return (
    <>
      {page.refreshError && <ErrorState error={page.refreshError} retry={page.retry} />}
      <PageHeader
        title="Объекты"
        description={description}
        actions={
          page.isManager && (
            <Button variant="contained" startIcon={<Plus size={18} />} onClick={page.openEditor}>
              Добавить объект
            </Button>
          )
        }
      />
      <div className={styles.statistics}>
        {page.statistics.map(statistic => (
          <Paper key={statistic.label} variant="outlined" className={styles.statistic}>
            <Typography color="text.secondary" variant="body2">
              {statistic.label}
            </Typography>
            <Typography className={styles.statisticValue}>
              {statistic.value.toString().padStart(2, "0")}
            </Typography>
          </Paper>
        ))}
      </div>
      <div className={styles.heading}>
        <Typography variant="h6">{page.isManager ? "Все объекты" : "Доступные объекты"}</Typography>
        <Chip size="small" label={page.cards.length} className={styles.count} />
      </div>
      {page.cards.length === 0 ? (
        <Paper variant="outlined">
          <EmptyState title="Объектов пока нет" description={emptyDescription} />
        </Paper>
      ) : (
        <div className={styles.objects}>
          {page.cards.map(card => (
            <ObjectCard key={card.object.id} {...card} />
          ))}
        </div>
      )}
      {page.editing && <ObjectDialog onClose={page.closeEditor} />}
    </>
  );
};
