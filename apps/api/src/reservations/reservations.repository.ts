import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { getPaginationDatabaseParams } from "../common/pagination/pagination.utils";
import { PrismaService } from "../prisma/prisma.service";
import { reservationSelect } from "./reservations.constants";
import type { ReservationsRepositoryContract } from "./reservations.repository.contract";
import type {
  ReservationFindManyQuery,
  ReservationPaginatedRecords,
  ReservationRecord
} from "./reservations.types";

@Injectable()
export class ReservationsRepository implements ReservationsRepositoryContract {
  constructor(private readonly prisma: PrismaService) {}

  async findManyPaginated(query: ReservationFindManyQuery): Promise<ReservationPaginatedRecords> {
    const pagination = getPaginationDatabaseParams(query);
    const where = this.toWhereInput(query);

    const [reservations, total] = await this.prisma.$transaction([
      this.prisma.reservation.findMany({
        where,
        select: reservationSelect,
        orderBy: { reservationDate: "asc" },
        skip: pagination.skip,
        take: pagination.take
      }),
      this.prisma.reservation.count({ where })
    ]);

    return { data: reservations, total };
  }

  async findById(id: string): Promise<ReservationRecord | null> {
    return this.prisma.reservation.findUnique({
      where: { id },
      select: reservationSelect
    });
  }

  async customerExists(id: string): Promise<boolean> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      select: { id: true }
    });

    return Boolean(customer);
  }

  async create(data: Prisma.ReservationCreateInput): Promise<ReservationRecord> {
    return this.prisma.reservation.create({
      data,
      select: reservationSelect
    });
  }

  async updateStatus(id: string, data: Prisma.ReservationUpdateInput): Promise<ReservationRecord> {
    return this.prisma.reservation.update({
      where: { id },
      data,
      select: reservationSelect
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.reservation.delete({
      where: { id }
    });
  }

  private toWhereInput(query: ReservationFindManyQuery): Prisma.ReservationWhereInput {
    return {
      status: query.status,
      customerId: query.customerId,
      reservationDate: query.date ? this.toDateFilter(query.date) : undefined
    };
  }

  private toDateFilter(date: string): Prisma.DateTimeFilter {
    const start = new Date(`${date}T00:00:00.000Z`);
    const end = new Date(`${date}T23:59:59.999Z`);

    return {
      gte: start,
      lte: end
    };
  }
}
