import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from "@nestjs/common";
import {
  createCustomerSchema,
  type CreateCustomerInput,
  updateCustomerSchema,
  type UpdateCustomerInput
} from "@repo/shared";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import { CustomersService } from "./customers.service";

@Controller("customers")
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  findMany() {
    return this.customersService.findMany();
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
  remove(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.customersService.remove(id);
  }
}
