import { Injectable } from "@nestjs/common";
import { DeliveryOrderStatus, ReservationStatus } from "@prisma/client";
import { customerAddressSelect } from "../addresses/addresses.constants";
import { deliveryOrderSelect } from "../delivery/delivery.constants";
import { menuCategorySelect, menuItemSelect } from "../menu/menu.constants";
import { PrismaService } from "../prisma/prisma.service";
import { reservationSelect } from "../reservations/reservations.constants";
import type { HomeRepositoryContract } from "./home.repository.contract";
import type { CustomerHomeRecords } from "./home.types";

@Injectable()
export class HomeRepository implements HomeRepositoryContract {
  constructor(private readonly prisma: PrismaService) {}

  async getCustomerHome(customerId: string): Promise<CustomerHomeRecords> {
    const now = new Date();
    const [defaultAddress, activeOrder, lastOrder, nextReservation, featuredItems, popularItems, categories] =
      await this.prisma.$transaction([
        this.prisma.customerAddress.findFirst({
          where: { customerId, isDefault: true },
          select: customerAddressSelect,
          orderBy: { createdAt: "desc" }
        }),
        this.prisma.deliveryOrder.findFirst({
          where: {
            customerId,
            status: { in: [DeliveryOrderStatus.PREPARING, DeliveryOrderStatus.OUT_FOR_DELIVERY] }
          },
          select: deliveryOrderSelect,
          orderBy: { createdAt: "desc" }
        }),
        this.prisma.deliveryOrder.findFirst({
          where: {
            customerId,
            status: { not: DeliveryOrderStatus.CANCELLED }
          },
          select: deliveryOrderSelect,
          orderBy: { createdAt: "desc" }
        }),
        this.prisma.reservation.findFirst({
          where: {
            customerId,
            reservationDate: { gte: now },
            status: { in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED] }
          },
          select: reservationSelect,
          orderBy: { reservationDate: "asc" }
        }),
        this.prisma.menuItem.findMany({
          where: { available: true, featured: true },
          select: menuItemSelect,
          orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
          take: 6
        }),
        this.prisma.menuItem.findMany({
          where: { available: true, popular: true },
          select: menuItemSelect,
          orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
          take: 6
        }),
        this.prisma.menuCategory.findMany({
          select: menuCategorySelect,
          orderBy: { name: "asc" },
          take: 8
        })
      ]);

    return {
      defaultAddress,
      activeOrder,
      lastOrder,
      nextReservation,
      featuredItems,
      popularItems,
      categories
    };
  }
}
