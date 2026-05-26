import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { menuCategorySelect, menuItemSelect, menuSearchMode } from "./menu.constants";
import type { MenuRepositoryContract } from "./menu.repository.contract";
import type { MenuCategoryRecord, MenuItemFindManyQuery, MenuItemRecord } from "./menu.types";

@Injectable()
export class MenuRepository implements MenuRepositoryContract {
  constructor(private readonly prisma: PrismaService) {}

  async findCategories(): Promise<MenuCategoryRecord[]> {
    return this.prisma.menuCategory.findMany({
      select: menuCategorySelect,
      orderBy: { name: "asc" }
    });
  }

  async findCategoryById(id: string): Promise<MenuCategoryRecord | null> {
    return this.prisma.menuCategory.findUnique({
      where: { id },
      select: menuCategorySelect
    });
  }

  async createCategory(data: Prisma.MenuCategoryCreateInput): Promise<MenuCategoryRecord> {
    return this.prisma.menuCategory.create({
      data,
      select: menuCategorySelect
    });
  }

  async updateCategory(id: string, data: Prisma.MenuCategoryUpdateInput): Promise<MenuCategoryRecord> {
    return this.prisma.menuCategory.update({
      where: { id },
      data,
      select: menuCategorySelect
    });
  }

  async deleteCategory(id: string): Promise<void> {
    await this.prisma.menuCategory.delete({
      where: { id }
    });
  }

  async findItems(query: MenuItemFindManyQuery): Promise<MenuItemRecord[]> {
    return this.prisma.menuItem.findMany({
      where: this.toItemWhereInput(query),
      select: menuItemSelect,
      orderBy: [{ displayOrder: "asc" }, { category: { name: "asc" } }, { name: "asc" }]
    });
  }

  async findItemById(id: string): Promise<MenuItemRecord | null> {
    return this.prisma.menuItem.findUnique({
      where: { id },
      select: menuItemSelect
    });
  }

  async createItem(data: Prisma.MenuItemCreateInput): Promise<MenuItemRecord> {
    return this.prisma.menuItem.create({
      data,
      select: menuItemSelect
    });
  }

  async updateItem(id: string, data: Prisma.MenuItemUpdateInput): Promise<MenuItemRecord> {
    return this.prisma.menuItem.update({
      where: { id },
      data,
      select: menuItemSelect
    });
  }

  async deleteItem(id: string): Promise<void> {
    await this.prisma.menuItem.delete({
      where: { id }
    });
  }

  private toItemWhereInput(query: MenuItemFindManyQuery): Prisma.MenuItemWhereInput {
    return {
      categoryId: query.categoryId,
      available: query.available,
      OR: query.search
        ? [
            { name: { contains: query.search, mode: menuSearchMode } },
            { description: { contains: query.search, mode: menuSearchMode } }
          ]
        : undefined
    };
  }
}
