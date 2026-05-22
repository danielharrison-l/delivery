import { Body, Controller, Get, Post } from "@nestjs/common";
import { createDeliveryOrderSchema, type CreateDeliveryOrderInput } from "@repo/shared";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import { DeliveryService } from "./delivery.service";

@Controller("delivery/orders")
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get()
  findMany() {
    return this.deliveryService.findMany();
  }

  @Post()
  create(@Body(new ZodValidationPipe(createDeliveryOrderSchema)) data: CreateDeliveryOrderInput) {
    return this.deliveryService.create(data);
  }
}
