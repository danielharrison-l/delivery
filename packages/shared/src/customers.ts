import { z } from "zod";
import { paginationMetaSchema, paginationQuerySchema } from "./pagination";

export const createCustomerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(8).max(20).optional().or(z.literal("")),
  address: z.string().trim().min(5).max(255).optional().or(z.literal(""))
});

export const customerRoleSchema = z.enum(["CUSTOMER", "ADMIN"]);

export const updateCustomerSchema = createCustomerSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  { message: "Informe pelo menos um campo para atualizar." }
);

export const customerSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().nullable(),
  role: customerRoleSchema,
  address: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export const customersSchema = z.array(customerSchema);

export const customerListQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().min(1).max(100).optional()
});

export const paginatedCustomersSchema = z.object({
  data: customersSchema,
  meta: paginationMetaSchema
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
export type CustomerRole = z.infer<typeof customerRoleSchema>;
export type CustomerResponse = z.infer<typeof customerSchema>;
export type CustomerListQuery = z.infer<typeof customerListQuerySchema>;
export type PaginatedCustomersResponse = z.infer<typeof paginatedCustomersSchema>;
