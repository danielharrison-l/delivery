import { Injectable, NotFoundException } from "@nestjs/common";
import type { CreateReservationInput } from "@repo/shared";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ReservationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany() {
    return this.prisma.reservation.findMany({
      include: { customer: { omit: { passwordHash: true } } },
      orderBy: { reservationDate: "asc" }
    });
  }

  async create(data: CreateReservationInput) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: data.customerId }
    });

    if (!customer) {
      throw new NotFoundException("Customer not found");
    }

    return this.prisma.reservation.create({
      data: {
        reservationDate: new Date(data.reservationDate),
        peopleCount: data.peopleCount,
        notes: data.notes || undefined,
        customerId: data.customerId
      },
      include: { customer: { omit: { passwordHash: true } } }
    });
  }
}
