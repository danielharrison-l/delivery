import type { PaginatedRepositoryResult } from "./pagination.types";

export interface PaginatedRepositoryContract<TRecord, TQuery> {
  findManyPaginated(query: TQuery): Promise<PaginatedRepositoryResult<TRecord>>;
}
