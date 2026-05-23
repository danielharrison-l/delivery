import { Module } from "@nestjs/common";
import { MenuController } from "./menu.controller";
import { MenuRepository } from "./menu.repository";
import { MenuService } from "./menu.service";
import { MENU_REPOSITORY } from "./menu.tokens";

@Module({
  controllers: [MenuController],
  providers: [
    {
      provide: MENU_REPOSITORY,
      useClass: MenuRepository
    },
    MenuService
  ]
})
export class MenuModule {}
