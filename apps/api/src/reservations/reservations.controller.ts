import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import {
  createAuthenticatedReservationSchema,
  type CreateAuthenticatedReservationInput,
  reservationListQuerySchema,
  type ReservationListQuery,
  updateReservationStatusSchema,
  type UpdateReservationStatusInput
} from "@repo/shared";
import { AuthGuard } from "../auth/auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import type { AuthenticatedCustomer } from "../auth/auth.types";
import { AdminGuard } from "../auth/admin.guard";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import { ReservationsService } from "./reservations.service";

@Controller("reservations")
@UseGuards(AuthGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get()
  findMany(
    @CurrentUser() customer: AuthenticatedCustomer,
    @Query(new ZodValidationPipe(reservationListQuerySchema)) query: ReservationListQuery
  ) {
    return this.reservationsService.findMany(customer.role === "ADMIN" ? query : { ...query, customerId: customer.id });
  }

  @Get(":id")
  findOne(@CurrentUser() customer: AuthenticatedCustomer, @Param("id", new ParseUUIDPipe()) id: string) {
    if (customer.role === "ADMIN") {
      return this.reservationsService.findOne(id);
    }

    return this.reservationsService.findOneForCustomer(id, customer.id);
  }

  @Post()
  create(
    @CurrentUser() customer: AuthenticatedCustomer,
    @Body(new ZodValidationPipe(createAuthenticatedReservationSchema)) data: CreateAuthenticatedReservationInput
  ) {
    return this.reservationsService.create({ ...data, customerId: customer.id });
  }

  @Patch(":id/status")
  @UseGuards(AdminGuard)
  updateStatus(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body(new ZodValidationPipe(updateReservationStatusSchema)) data: UpdateReservationStatusInput
  ) {
    return this.reservationsService.updateStatus(id, data);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@CurrentUser() customer: AuthenticatedCustomer, @Param("id", new ParseUUIDPipe()) id: string) {
    if (customer.role === "ADMIN") {
      return this.reservationsService.remove(id);
    }

    return this.reservationsService.removeForCustomer(id, customer.id);
  }
}
