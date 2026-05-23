import { Prisma } from "@prisma/client";

export const menuSearchMode = Prisma.QueryMode.insensitive;

export const menuCategorySelect = {
  id: true,
  name: true,
  description: true,
  createdAt: true,
  updatedAt: true
} satisfies Prisma.MenuCategorySelect;

export const menuItemSelect = {
  id: true,
  name: true,
  description: true,
  price: true,
  imageUrl: true,
  available: true,
  categoryId: true,
  createdAt: true,
  updatedAt: true,
  category: {
    select: menuCategorySelect
  }
} satisfies Prisma.MenuItemSelect;
