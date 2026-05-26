import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import {
  customerListQuerySchema,
  type CustomerListQuery,
  createCustomerSchema,
  type CreateCustomerInput,
  updateCustomerSchema,
  type UpdateCustomerInput
} from "@repo/shared";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import { AdminGuard } from "../auth/admin.guard";
import { AuthGuard } from "../auth/auth.guard";
import { CustomersService } from "./customers.service";

@Controller("customers")
@UseGuards(AuthGuard, AdminGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  findMany(@Query(new ZodValidationPipe(customerListQuerySchema)) query: CustomerListQuery) {
    return this.customersService.findMany(query);
  }

  @Get(":id")
  findOne(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.customersService.findOne(id);
  }

  @Post()
  create(@Body(new ZodValidationPipe(createCustomerSchema)) data: CreateCustomerInput) {
    return this.customersService.create(data);
  }

  @Patch(":id")
  update(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body(new ZodValidationPipe(updateCustomerSchema)) data: UpdateCustomerInput
  ) {
    return this.customersService.update(id, data);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.customersService.remove(id);
  }
}
