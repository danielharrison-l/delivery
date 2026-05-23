import { Prisma } from "@prisma/client";
import { customersMapper } from "../customers/customers.mapper";
import type {
  ReservationCreateData,
  ReservationDto,
  ReservationRecord,
  ReservationStatusUpdateData
} from "./reservations.types";

function toDto(reservation: ReservationRecord): ReservationDto {
  return {
    ...reservation,
    reservationDate: reservation.reservationDate.toISOString(),
    createdAt: reservation.createdAt.toISOString(),
    updatedAt: reservation.updatedAt.toISOString(),
    customer: reservation.customer ? customersMapper.toDto(reservation.customer) : undefined
  };
}

function toCreateData(data: ReservationCreateData): Prisma.ReservationCreateInput {
  return {
    reservationDate: new Date(data.reservationDate),
    peopleCount: data.peopleCount,
    notes: data.notes || undefined,
    customer: {
      connect: { id: data.customerId }
    }
  };
}

function toStatusUpdateData(data: ReservationStatusUpdateData): Prisma.ReservationUpdateInput {
  return {
    status: data.status
  };
}

export const reservationsMapper = {
  toDto,
  toCreateData,
  toStatusUpdateData
} as const;
