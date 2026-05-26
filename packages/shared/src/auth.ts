import { z } from "zod";
import { customerSchema } from "./customers";

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(72),
  phone: z.string().trim().min(8).max(20).optional().or(z.literal(""))
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(8).max(20).optional().or(z.literal("")),
  address: z.string().trim().min(5).max(255).optional().or(z.literal(""))
});

export const loginSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(1).max(72)
});

export const authenticatedCustomerSchema = customerSchema;

export const authSessionSchema = z.object({
  customer: authenticatedCustomerSchema,
  accessToken: z.string()
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type AuthenticatedCustomerResponse = z.infer<typeof authenticatedCustomerSchema>;
export type AuthSessionResponse = z.infer<typeof authSessionSchema>;
