export type PaginationParams = {
  page: number;
  limit: number;
};

export type PaginationDatabaseParams = {
  skip: number;
  take: number;
};

export type PaginatedRepositoryResult<TRecord> = {
  data: TRecord[];
  total: number;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginatedResult<TItem> = {
  data: TItem[];
  meta: PaginationMeta;
};
