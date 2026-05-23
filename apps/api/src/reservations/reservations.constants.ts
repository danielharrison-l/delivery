import { Prisma } from "@prisma/client";
import { customerSelect } from "../customers/customers.constants";

export const reservationSelect = {
  id: true,
  reservationDate: true,
  peopleCount: true,
  status: true,
  notes: true,
  customerId: true,
  createdAt: true,
  updatedAt: true,
  customer: {
    select: customerSelect
  }
} satisfies Prisma.ReservationSelect;
