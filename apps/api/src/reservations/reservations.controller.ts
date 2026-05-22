import { Body, Controller, Get, Post } from "@nestjs/common";
import { createReservationSchema, type CreateReservationInput } from "@repo/shared";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import { ReservationsService } from "./reservations.service";

@Controller("reservations")
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get()
  findMany() {
    return this.reservationsService.findMany();
  }

  @Post()
  create(@Body(new ZodValidationPipe(createReservationSchema)) data: CreateReservationInput) {
    return this.reservationsService.create(data);
  }
}
