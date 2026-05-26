import { z } from "zod";

export const customerAddressBaseSchema = z.object({
  label: z.string().trim().min(2).max(40),
  street: z.string().trim().min(2).max(120),
  number: z.string().trim().min(1).max(20),
  neighborhood: z.string().trim().min(2).max(80),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(2),
  zipCode: z.string().trim().min(8).max(12).optional().or(z.literal("")),
  complement: z.string().trim().max(120).optional().or(z.literal("")),
  isDefault: z.boolean().optional()
});

export const createCustomerAddressSchema = customerAddressBaseSchema;

export const updateCustomerAddressSchema = customerAddressBaseSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  { message: "Informe pelo menos um campo para atualizar." }
);

export const customerAddressSchema = z.object({
  id: z.string().uuid(),
  label: z.string(),
  street: z.string(),
  number: z.string(),
  neighborhood: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string().nullable(),
  complement: z.string().nullable(),
  isDefault: z.boolean(),
  customerId: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export const customerAddressesSchema = z.array(customerAddressSchema);

export type CreateCustomerAddressInput = z.infer<typeof createCustomerAddressSchema>;
export type UpdateCustomerAddressInput = z.infer<typeof updateCustomerAddressSchema>;
export type CustomerAddressResponse = z.infer<typeof customerAddressSchema>;
