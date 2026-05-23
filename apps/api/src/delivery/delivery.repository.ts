import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { getPaginationDatabaseParams } from "../common/pagination/pagination.utils";
import { PrismaService } from "../prisma/prisma.service";
import { deliveryMenuItemPriceSelect, deliveryOrderSelect } from "./delivery.constants";
import type { DeliveryRepositoryContract } from "./delivery.repository.contract";
import type {
  DeliveryMenuItemPriceRecord,
  DeliveryOrderFindManyQuery,
  DeliveryOrderPaginatedRecords,
  DeliveryOrderRecord
} from "./delivery.types";

@Injectable()
export class DeliveryRepository implements DeliveryRepositoryContract {
  constructor(private readonly prisma: PrismaService) {}

  async findManyPaginated(query: DeliveryOrderFindManyQuery): Promise<DeliveryOrderPaginatedRecords> {
    const pagination = getPaginationDatabaseParams(query);
    const where = this.toWhereInput(query);

    const [orders, total] = await this.prisma.$transaction([
      this.prisma.deliveryOrder.findMany({
        where,
        select: deliveryOrderSelect,
        orderBy: { createdAt: "desc" },
        skip: pagination.skip,
        take: pagination.take
      }),
      this.prisma.deliveryOrder.count({ where })
    ]);

    return { data: orders, total };
  }

  async findById(id: string): Promise<DeliveryOrderRecord | null> {
    return this.prisma.deliveryOrder.findUnique({
      where: { id },
      select: deliveryOrderSelect
    });
  }

  async customerExists(id: string): Promise<boolean> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      select: { id: true }
    });

    return Boolean(customer);
  }

  async findAvailableMenuItemsByIds(ids: string[]): Promise<DeliveryMenuItemPriceRecord[]> {
    return this.prisma.menuItem.findMany({
      where: {
        id: { in: ids },
        available: true
      },
      select: deliveryMenuItemPriceSelect
    });
  }

  async create(data: Prisma.DeliveryOrderCreateInput): Promise<DeliveryOrderRecord> {
    return this.prisma.deliveryOrder.create({
      data,
      select: deliveryOrderSelect
    });
  }

  async updateStatus(id: string, data: Prisma.DeliveryOrderUpdateInput): Promise<DeliveryOrderRecord> {
    return this.prisma.deliveryOrder.update({
      where: { id },
      data,
      select: deliveryOrderSelect
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.deliveryOrder.delete({
      where: { id }
    });
  }

  private toWhereInput(query: DeliveryOrderFindManyQuery): Prisma.DeliveryOrderWhereInput {
    return {
      status: query.status,
      customerId: query.customerId
    };
  }
}
