import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, UseGuards } from "@nestjs/common";
import {
  createCustomerAddressSchema,
  type CreateCustomerAddressInput,
  updateCustomerAddressSchema,
  type UpdateCustomerAddressInput
} from "@repo/shared";
import { AuthGuard } from "../auth/auth.guard";
import type { AuthenticatedCustomer } from "../auth/auth.types";
import { CurrentUser } from "../auth/current-user.decorator";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import { AddressesService } from "./addresses.service";

@Controller("addresses")
@UseGuards(AuthGuard)
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  findMany(@CurrentUser() customer: AuthenticatedCustomer) {
    return this.addressesService.findMany(customer.id);
  }

  @Post()
  create(
    @CurrentUser() customer: AuthenticatedCustomer,
    @Body(new ZodValidationPipe(createCustomerAddressSchema)) data: CreateCustomerAddressInput
  ) {
    return this.addressesService.create(customer.id, data);
  }

  @Patch(":id")
  update(
    @CurrentUser() customer: AuthenticatedCustomer,
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body(new ZodValidationPipe(updateCustomerAddressSchema)) data: UpdateCustomerAddressInput
  ) {
    return this.addressesService.update(customer.id, id, data);
  }

  @Patch(":id/default")
  setDefault(@CurrentUser() customer: AuthenticatedCustomer, @Param("id", new ParseUUIDPipe()) id: string) {
    return this.addressesService.setDefault(customer.id, id);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@CurrentUser() customer: AuthenticatedCustomer, @Param("id", new ParseUUIDPipe()) id: string) {
    return this.addressesService.remove(customer.id, id);
  }
}
