import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { HomeController } from "./home.controller";
import { HomeRepository } from "./home.repository";
import { HomeService } from "./home.service";
import { HOME_REPOSITORY } from "./home.tokens";

@Module({
  imports: [PrismaModule],
  controllers: [HomeController],
  providers: [
    HomeService,
    {
      provide: HOME_REPOSITORY,
      useClass: HomeRepository
    }
  ]
})
export class HomeModule {}
