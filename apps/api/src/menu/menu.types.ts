import type {
  CreateMenuCategoryInput,
  CreateMenuItemInput,
  MenuCategoryResponse,
  MenuItemListQuery,
  MenuItemResponse,
  UpdateMenuCategoryInput,
  UpdateMenuItemInput
} from "@repo/shared";
import type { Prisma } from "@prisma/client";
import type { menuCategorySelect, menuItemSelect } from "./menu.constants";

export type MenuCategoryCreateData = CreateMenuCategoryInput;
export type MenuCategoryUpdateData = UpdateMenuCategoryInput;
export type MenuItemCreateData = CreateMenuItemInput;
export type MenuItemUpdateData = UpdateMenuItemInput;
export type MenuItemFindManyQuery = MenuItemListQuery;
export type MenuCategoryDto = MenuCategoryResponse;
export type MenuItemDto = MenuItemResponse;
export type MenuCategoryRecord = Prisma.MenuCategoryGetPayload<{
  select: typeof menuCategorySelect;
}>;
export type MenuItemRecord = Prisma.MenuItemGetPayload<{
  select: typeof menuItemSelect;
}>;
