import { Prisma } from "@prisma/client";
import type {
  MenuCategoryCreateData,
  MenuCategoryDto,
  MenuCategoryRecord,
  MenuCategoryUpdateData,
  MenuItemCreateData,
  MenuItemDto,
  MenuItemRecord,
  MenuItemUpdateData
} from "./menu.types";

function toCategoryDto(category: MenuCategoryRecord): MenuCategoryDto {
  return {
    ...category,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString()
  };
}

function toItemDto(item: MenuItemRecord): MenuItemDto {
  return {
    ...item,
    price: item.price.toNumber(),
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
    category: item.category ? toCategoryDto(item.category) : undefined
  };
}

function toCategoryCreateData(data: MenuCategoryCreateData): Prisma.MenuCategoryCreateInput {
  return {
    name: data.name,
    description: data.description || undefined
  };
}

function toCategoryUpdateData(data: MenuCategoryUpdateData): Prisma.MenuCategoryUpdateInput {
  return {
    name: data.name,
    description: data.description || undefined
  };
}

function toItemCreateData(data: MenuItemCreateData): Prisma.MenuItemCreateInput {
  return {
    name: data.name,
    description: data.description || undefined,
    price: new Prisma.Decimal(data.price),
    imageUrl: data.imageUrl || undefined,
    available: data.available ?? true,
    featured: data.featured ?? false,
    popular: data.popular ?? false,
    isNew: data.isNew ?? false,
    displayOrder: data.displayOrder ?? 0,
    category: {
      connect: { id: data.categoryId }
    }
  };
}

function toItemUpdateData(data: MenuItemUpdateData): Prisma.MenuItemUpdateInput {
  return {
    name: data.name,
    description: data.description || undefined,
    price: data.price === undefined ? undefined : new Prisma.Decimal(data.price),
    imageUrl: data.imageUrl || undefined,
    available: data.available,
    featured: data.featured,
    popular: data.popular,
    isNew: data.isNew,
    displayOrder: data.displayOrder,
    category: data.categoryId ? { connect: { id: data.categoryId } } : undefined
  };
}

export const menuMapper = {
  toCategoryDto,
  toItemDto,
  toCategoryCreateData,
  toCategoryUpdateData,
  toItemCreateData,
  toItemUpdateData
} as const;
