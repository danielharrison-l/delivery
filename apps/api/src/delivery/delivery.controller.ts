import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import {
  createAuthenticatedDeliveryOrderSchema,
  type CreateAuthenticatedDeliveryOrderInput,
  deliveryOrderListQuerySchema,
  type DeliveryOrderListQuery,
  updateDeliveryOrderStatusSchema,
  type UpdateDeliveryOrderStatusInput
} from "@repo/shared";
import { AuthGuard } from "../auth/auth.guard";
import { AdminGuard } from "../auth/admin.guard";
import type { AuthenticatedCustomer } from "../auth/auth.types";
import { CurrentUser } from "../auth/current-user.decorator";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import { DeliveryService } from "./delivery.service";

@Controller("delivery/orders")
@UseGuards(AuthGuard)
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get()
  findMany(
    @CurrentUser() customer: AuthenticatedCustomer,
    @Query(new ZodValidationPipe(deliveryOrderListQuerySchema)) query: DeliveryOrderListQuery
  ) {
    return this.deliveryService.findMany(customer.role === "ADMIN" ? query : { ...query, customerId: customer.id });
  }

  @Get(":id")
  findOne(@CurrentUser() customer: AuthenticatedCustomer, @Param("id", new ParseUUIDPipe()) id: string) {
    if (customer.role === "ADMIN") {
      return this.deliveryService.findOne(id);
    }

    return this.deliveryService.findOneForCustomer(id, customer.id);
  }

  @Post()
  create(
    @CurrentUser() customer: AuthenticatedCustomer,
    @Body(new ZodValidationPipe(createAuthenticatedDeliveryOrderSchema)) data: CreateAuthenticatedDeliveryOrderInput
  ) {
    return this.deliveryService.create({ ...data, customerId: customer.id });
  }

  @Patch(":id/status")
  @UseGuards(AdminGuard)
  updateStatus(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body(new ZodValidationPipe(updateDeliveryOrderStatusSchema)) data: UpdateDeliveryOrderStatusInput
  ) {
    return this.deliveryService.updateStatus(id, data);
  }

  @Delete(":id")
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.deliveryService.remove(id);
  }
}
