import { Module } from "@nestjs/common";
import { DeliveryController } from "./delivery.controller";
import { DeliveryRepository } from "./delivery.repository";
import { DeliveryService } from "./delivery.service";
import { DELIVERY_REPOSITORY } from "./delivery.tokens";

@Module({
  controllers: [DeliveryController],
  providers: [
    {
      provide: DELIVERY_REPOSITORY,
      useClass: DeliveryRepository
    },
    DeliveryService
  ]
})
export class DeliveryModule {}
