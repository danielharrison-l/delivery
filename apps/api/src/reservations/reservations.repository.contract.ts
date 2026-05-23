import type { Prisma } from "@prisma/client";
import type { PaginatedRepositoryContract } from "../common/pagination/pagination.contract";
import type { ReservationFindManyQuery, ReservationRecord } from "./reservations.types";

export interface ReservationsRepositoryContract
  extends PaginatedRepositoryContract<ReservationRecord, ReservationFindManyQuery> {
  findById(id: string): Promise<ReservationRecord | null>;
  customerExists(id: string): Promise<boolean>;
  create(data: Prisma.ReservationCreateInput): Promise<ReservationRecord>;
  updateStatus(id: string, data: Prisma.ReservationUpdateInput): Promise<ReservationRecord>;
  delete(id: string): Promise<void>;
}
