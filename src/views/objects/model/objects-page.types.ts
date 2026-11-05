import type { ConstructionObject } from "@/entities/object";

export type ObjectCardData = {
  object: ConstructionObject;
  taskCount: number;
  acceptedCount: number;
  reviewCount: number;
  progress: number;
};

export type ObjectStatistic = {
  label: string;
  value: number;
};

export type UseObjectsPageResult = {
  cards: ObjectCardData[];
  statistics: ObjectStatistic[];
  isManager: boolean;
  loading: boolean;
  error: Error | null;
  refreshError: Error | null;
  editing: boolean;
  retry: () => void;
  openEditor: () => void;
  closeEditor: () => void;
};
