import { Module } from "@nestjs/common";
import { ReservationsController } from "./reservations.controller";
import { ReservationsRepository } from "./reservations.repository";
import { ReservationsService } from "./reservations.service";
import { RESERVATIONS_REPOSITORY } from "./reservations.tokens";

@Module({
  controllers: [ReservationsController],
  providers: [
    {
      provide: RESERVATIONS_REPOSITORY,
      useClass: ReservationsRepository
    },
    ReservationsService
  ]
})
export class ReservationsModule {}
