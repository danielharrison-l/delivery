import type { Prisma } from "@prisma/client";
import type { MenuCategoryRecord, MenuItemFindManyQuery, MenuItemRecord } from "./menu.types";

export interface MenuRepositoryContract {
  findCategories(): Promise<MenuCategoryRecord[]>;
  findCategoryById(id: string): Promise<MenuCategoryRecord | null>;
  createCategory(data: Prisma.MenuCategoryCreateInput): Promise<MenuCategoryRecord>;
  updateCategory(id: string, data: Prisma.MenuCategoryUpdateInput): Promise<MenuCategoryRecord>;
  deleteCategory(id: string): Promise<void>;
  findItems(query: MenuItemFindManyQuery): Promise<MenuItemRecord[]>;
  findItemById(id: string): Promise<MenuItemRecord | null>;
  createItem(data: Prisma.MenuItemCreateInput): Promise<MenuItemRecord>;
  updateItem(id: string, data: Prisma.MenuItemUpdateInput): Promise<MenuItemRecord>;
  deleteItem(id: string): Promise<void>;
}
