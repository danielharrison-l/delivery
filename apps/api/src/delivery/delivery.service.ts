import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import type { CreateDeliveryOrderInput } from "@repo/shared";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class DeliveryService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany() {
    return this.prisma.deliveryOrder.findMany({
      include: {
        customer: { omit: { passwordHash: true } },
        items: { include: { menuItem: true } }
      },
      orderBy: { createdAt: "desc" }
    });
  }

  async create(data: CreateDeliveryOrderInput) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: data.customerId }
    });

    if (!customer) {
      throw new NotFoundException("Customer not found");
    }

    const itemIds = data.items.map((item) => item.menuItemId);
    const menuItems = await this.prisma.menuItem.findMany({
      where: {
        id: { in: itemIds },
        available: true
      }
    });

    if (menuItems.length !== new Set(itemIds).size) {
      throw new BadRequestException("One or more menu items are unavailable");
    }

    const menuItemById = new Map(menuItems.map((item) => [item.id, item]));
    const totalAmount = data.items.reduce((total, item) => {
      const menuItem = menuItemById.get(item.menuItemId);
      const price = new Prisma.Decimal(menuItem?.price ?? 0);

      return total.add(price.mul(item.quantity));
    }, new Prisma.Decimal(0));

    return this.prisma.deliveryOrder.create({
      data: {
        customerId: data.customerId,
        deliveryAddress: data.deliveryAddress,
        totalAmount,
        items: {
          create: data.items.map((item) => {
            const menuItem = menuItemById.get(item.menuItemId);

            if (!menuItem) {
              throw new BadRequestException("Menu item not found");
            }

            return {
              menuItemId: item.menuItemId,
              quantity: item.quantity,
              unitPrice: menuItem.price
            };
          })
        }
      },
      include: {
        customer: { omit: { passwordHash: true } },
        items: { include: { menuItem: true } }
      }
    });
  }
}
