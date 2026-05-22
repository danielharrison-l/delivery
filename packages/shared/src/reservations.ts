import { z } from "zod";
import { customerSchema } from "./customers";

export const reservationStatusSchema = z.enum(["PENDING", "CONFIRMED", "CANCELLED"]);

export const createReservationSchema = z.object({
  customerId: z.string().uuid(),
  reservationDate: z.string().datetime(),
  peopleCount: z.coerce.number().int().min(1).max(20),
  notes: z.string().trim().max(500).optional().or(z.literal(""))
});

export const reservationSchema = z.object({
  id: z.string().uuid(),
  reservationDate: z.string().datetime(),
  peopleCount: z.number().int(),
  status: reservationStatusSchema,
  notes: z.string().nullable(),
  customerId: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  customer: customerSchema.optional()
});

export const reservationsSchema = z.array(reservationSchema);

export type CreateReservationInput = z.infer<typeof createReservationSchema>;
export type ReservationResponse = z.infer<typeof reservationSchema>;
