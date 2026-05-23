import { z } from "zod";

export const paginationConfig = {
  defaultPage: 1,
  defaultLimit: 10,
  minPage: 1,
  minLimit: 1,
  maxLimit: 50
} as const;

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(paginationConfig.minPage).default(paginationConfig.defaultPage),
  limit: z.coerce
    .number()
    .int()
    .min(paginationConfig.minLimit)
    .max(paginationConfig.maxLimit)
    .default(paginationConfig.defaultLimit)
});

export const paginationMetaSchema = z.object({
  page: z.number().int(),
  limit: z.number().int(),
  total: z.number().int(),
  totalPages: z.number().int()
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
export type PaginationMeta = z.infer<typeof paginationMetaSchema>;
export type PaginatedResponse<TItem> = {
  data: TItem[];
  meta: PaginationMeta;
};
