import { Controller, Get, Query } from "@nestjs/common";
import { MenuService } from "./menu.service";

@Controller("menu")
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get("categories")
  findCategories() {
    return this.menuService.findCategories();
  }

  @Get("items")
  findItems(@Query("categoryId") categoryId?: string) {
    return this.menuService.findItems(categoryId);
  }
}
