import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { CustomersModule } from "./customers/customers.module";
import { DeliveryModule } from "./delivery/delivery.module";
import { MenuModule } from "./menu/menu.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ReservationsModule } from "./reservations/reservations.module";

@Module({
  imports: [PrismaModule, AuthModule, CustomersModule, MenuModule, ReservationsModule, DeliveryModule],
  controllers: [AppController]
})
export class AppModule {}
