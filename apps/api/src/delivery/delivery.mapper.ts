import { Prisma } from "@prisma/client";
import { addressesMapper } from "../addresses/addresses.mapper";
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
  deliveryAddress: string,
  totalAmount: Prisma.Decimal,
  items: DeliveryOrderCreateItemData[]
): Prisma.DeliveryOrderCreateInput {
  return {
    customer: {
      connect: { id: data.customerId }
    },
    address: data.addressId ? { connect: { id: data.addressId } } : undefined,
    deliveryAddress,
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

const toAddressText = addressesMapper.toSingleLine;

export const deliveryMapper = {
  toDto,
  toCreateData,
  toAddressText,
  toStatusUpdateData
} as const;
