import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import {
  createMenuCategorySchema,
  type CreateMenuCategoryInput,
  createMenuItemSchema,
  type CreateMenuItemInput,
  menuItemListQuerySchema,
  type MenuItemListQuery,
  updateMenuCategorySchema,
  type UpdateMenuCategoryInput,
  updateMenuItemSchema,
  type UpdateMenuItemInput
} from "@repo/shared";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import { AuthGuard } from "../auth/auth.guard";
import { MenuService } from "./menu.service";

@Controller("menu")
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get("categories")
  findCategories() {
    return this.menuService.findCategories();
  }

  @Get("categories/:id")
  findCategory(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.menuService.findCategory(id);
  }

  @Post("categories")
  @UseGuards(AuthGuard)
  createCategory(@Body(new ZodValidationPipe(createMenuCategorySchema)) data: CreateMenuCategoryInput) {
    return this.menuService.createCategory(data);
  }

  @Patch("categories/:id")
  @UseGuards(AuthGuard)
  updateCategory(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body(new ZodValidationPipe(updateMenuCategorySchema)) data: UpdateMenuCategoryInput
  ) {
    return this.menuService.updateCategory(id, data);
  }

  @Delete("categories/:id")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  removeCategory(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.menuService.removeCategory(id);
  }

  @Get("items")
  findItems(@Query(new ZodValidationPipe(menuItemListQuerySchema)) query: MenuItemListQuery) {
    return this.menuService.findItems(query);
  }

  @Get("items/:id")
  findItem(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.menuService.findItem(id);
  }

  @Post("items")
  @UseGuards(AuthGuard)
  createItem(@Body(new ZodValidationPipe(createMenuItemSchema)) data: CreateMenuItemInput) {
    return this.menuService.createItem(data);
  }

  @Patch("items/:id")
  @UseGuards(AuthGuard)
  updateItem(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body(new ZodValidationPipe(updateMenuItemSchema)) data: UpdateMenuItemInput
  ) {
    return this.menuService.updateItem(id, data);
  }

  @Delete("items/:id")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  removeItem(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.menuService.removeItem(id);
  }
}
