import { Card, CardActionArea, LinearProgress, Typography } from "@mui/material";
import { ArrowUpRight, Building2, MapPin } from "lucide-react";
import type { FC } from "react";
import { Link as RouterLink } from "react-router-dom";

import type { ObjectCardData } from "../model/objects-page.types";

import styles from "./objects-page.module.css";

export const ObjectCard: FC<ObjectCardData> = ({
  object,
  taskCount,
  acceptedCount,
  reviewCount,
  progress
}) => {
  const reviewLabel: string =
    reviewCount > 0 ? `На проверке: ${String(reviewCount)}` : "Нет задач на проверке";

  return (
    <Card variant="outlined">
      <CardActionArea component={RouterLink} to={`/objects/${object.id}`} className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.icon}>
            <Building2 size={23} />
          </div>
          <ArrowUpRight size={19} color="#89959e" />
        </div>
        <Typography variant="h6" className={styles.title}>
          {object.name}
        </Typography>
        <div className={styles.address}>
          <MapPin size={16} className={styles.addressIcon} />
          <Typography variant="body2" color="text.secondary">
            {object.address}
          </Typography>
        </div>
        <div className={styles.progress}>
          <div className={styles.progressLabel}>
            <Typography variant="caption" color="text.secondary">
              Принято {acceptedCount} из {taskCount}
            </Typography>
            <Typography variant="caption" color="primary">
              {Math.round(progress)}%
            </Typography>
          </div>
          <LinearProgress variant="determinate" value={progress} className={styles.progressBar} />
          <Typography variant="body2" color="text.secondary" className={styles.review}>
            {reviewLabel}
          </Typography>
        </div>
      </CardActionArea>
    </Card>
  );
};
