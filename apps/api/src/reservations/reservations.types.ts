import type {
  CreateReservationInput,
  PaginatedReservationsResponse,
  ReservationListQuery,
  ReservationResponse,
  UpdateReservationStatusInput
} from "@repo/shared";
import type { Prisma } from "@prisma/client";
import type { PaginatedRepositoryResult } from "../common/pagination/pagination.types";
import type { reservationSelect } from "./reservations.constants";

export type ReservationCreateData = CreateReservationInput;
export type ReservationStatusUpdateData = UpdateReservationStatusInput;
export type ReservationFindManyQuery = ReservationListQuery;
export type ReservationDto = ReservationResponse;
export type ReservationsPageDto = PaginatedReservationsResponse;
export type ReservationRecord = Prisma.ReservationGetPayload<{
  select: typeof reservationSelect;
}>;
export type ReservationPaginatedRecords = PaginatedRepositoryResult<ReservationRecord>;
