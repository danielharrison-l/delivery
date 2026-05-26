import { z } from "zod";
import { customerSchema } from "./customers";
import { paginationMetaSchema, paginationQuerySchema } from "./pagination";
import { getReservationDateValidationMessage } from "./restaurant";

export const reservationStatusSchema = z.enum(["PENDING", "CONFIRMED", "CANCELLED"]);

const createReservationBaseSchema = z.object({
  customerId: z.string().uuid(),
  reservationDate: z.string().datetime(),
  peopleCount: z.coerce.number().int().min(1).max(20),
  notes: z.string().trim().max(500).optional().or(z.literal(""))
});

export const createReservationSchema = createReservationBaseSchema.superRefine(validateReservationDate);

export const createAuthenticatedReservationSchema = createReservationBaseSchema
  .omit({
    customerId: true
  })
  .superRefine(validateReservationDate);

export const updateReservationStatusSchema = z.object({
  status: reservationStatusSchema
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

export const reservationListQuerySchema = paginationQuerySchema.extend({
  status: reservationStatusSchema.optional(),
  customerId: z.string().uuid().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
});

export const paginatedReservationsSchema = z.object({
  data: reservationsSchema,
  meta: paginationMetaSchema
});

function validateReservationDate(value: { reservationDate: string }, context: z.RefinementCtx): void {
  const message = getReservationDateValidationMessage(value.reservationDate);

  if (message) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["reservationDate"],
      message
    });
  }
}

export type CreateReservationInput = z.infer<typeof createReservationSchema>;
export type CreateAuthenticatedReservationInput = z.infer<typeof createAuthenticatedReservationSchema>;
export type UpdateReservationStatusInput = z.infer<typeof updateReservationStatusSchema>;
export type ReservationResponse = z.infer<typeof reservationSchema>;
export type ReservationListQuery = z.infer<typeof reservationListQuerySchema>;
export type PaginatedReservationsResponse = z.infer<typeof paginatedReservationsSchema>;
