import { Module } from "@nestjs/common";
import { CustomersController } from "./customers.controller";
import { CustomersRepository } from "./customers.repository";
import { CustomersService } from "./customers.service";
import { CUSTOMERS_REPOSITORY } from "./customers.tokens";

@Module({
  controllers: [CustomersController],
  providers: [
    {
      provide: CUSTOMERS_REPOSITORY,
      useClass: CustomersRepository
    },
    CustomersService
  ],
  exports: [CustomersService]
})
export class CustomersModule {}
