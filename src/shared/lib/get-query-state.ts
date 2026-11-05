type QuerySnapshot = {
  data: unknown;
  error: Error | null;
  isPending: boolean;
};

type QueryState = {
  loading: boolean;
  error: Error | null;
  refreshError: Error | null;
};

export function getQueryState(queries: QuerySnapshot[]): QueryState {
  return {
    loading: queries.some(query => query.isPending),
    error: queries.find(query => query.data === undefined && query.error)?.error ?? null,
    refreshError: queries.find(query => query.data !== undefined && query.error)?.error ?? null
  };
}
