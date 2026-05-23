import { Prisma } from "@prisma/client";
import { customerSelect } from "../customers/customers.constants";
import { menuItemSelect } from "../menu/menu.constants";

export const deliveryOrderSelect = {
  id: true,
  status: true,
  totalAmount: true,
  deliveryAddress: true,
  customerId: true,
  createdAt: true,
  updatedAt: true,
  customer: {
    select: customerSelect
  },
  items: {
    select: {
      id: true,
      quantity: true,
      unitPrice: true,
      orderId: true,
      menuItemId: true,
      createdAt: true,
      menuItem: {
        select: menuItemSelect
      }
    }
  }
} satisfies Prisma.DeliveryOrderSelect;

export const deliveryMenuItemPriceSelect = {
  id: true,
  price: true
} satisfies Prisma.MenuItemSelect;
