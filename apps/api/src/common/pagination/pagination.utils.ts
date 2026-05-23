import type {
  PaginatedResult,
  PaginationDatabaseParams,
  PaginationMeta,
  PaginationParams
} from "./pagination.types";

export function getPaginationDatabaseParams(params: PaginationParams): PaginationDatabaseParams {
  return {
    skip: (params.page - 1) * params.limit,
    take: params.limit
  };
}

export function createPaginationMeta(params: PaginationParams, total: number): PaginationMeta {
  return {
    page: params.page,
    limit: params.limit,
    total,
    totalPages: Math.ceil(total / params.limit)
  };
}

export function createPaginatedResult<TItem>(
  data: TItem[],
  params: PaginationParams,
  total: number
): PaginatedResult<TItem> {
  return {
    data,
    meta: createPaginationMeta(params, total)
  };
}
