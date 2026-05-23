import { Prisma } from "@prisma/client";
import { customersMapper } from "../customers/customers.mapper";
import { menuMapper } from "../menu/menu.mapper";
import type {
  DeliveryOrderCreateData,
  DeliveryOrderDto,
  DeliveryOrderRecord,
  DeliveryOrderStatusUpdateData
} from "./delivery.types";

type DeliveryOrderCreateItemData = {
  menuItemId: string;
  quantity: number;
  unitPrice: Prisma.Decimal;
};

function toDto(order: DeliveryOrderRecord): DeliveryOrderDto {
  return {
    ...order,
    totalAmount: order.totalAmount.toNumber(),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    customer: order.customer ? customersMapper.toDto(order.customer) : undefined,
    items: order.items.map((item) => ({
      ...item,
      unitPrice: item.unitPrice.toNumber(),
      createdAt: item.createdAt.toISOString(),
      menuItem: item.menuItem ? menuMapper.toItemDto(item.menuItem) : undefined
    }))
  };
}

function toCreateData(
  data: DeliveryOrderCreateData,
  totalAmount: Prisma.Decimal,
  items: DeliveryOrderCreateItemData[]
): Prisma.DeliveryOrderCreateInput {
  return {
    customer: {
      connect: { id: data.customerId }
    },
    deliveryAddress: data.deliveryAddress,
    totalAmount,
    items: {
      create: items.map((item) => ({
        menuItem: {
          connect: { id: item.menuItemId }
        },
        quantity: item.quantity,
        unitPrice: item.unitPrice
      }))
    }
  };
}

function toStatusUpdateData(data: DeliveryOrderStatusUpdateData): Prisma.DeliveryOrderUpdateInput {
  return {
    status: data.status
  };
}

export const deliveryMapper = {
  toDto,
  toCreateData,
  toStatusUpdateData
} as const;
