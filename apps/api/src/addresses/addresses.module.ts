import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { AddressesController } from "./addresses.controller";
import { AddressesRepository } from "./addresses.repository";
import { AddressesService } from "./addresses.service";
import { ADDRESSES_REPOSITORY } from "./addresses.tokens";

@Module({
  imports: [PrismaModule],
  controllers: [AddressesController],
  providers: [
    AddressesService,
    {
      provide: ADDRESSES_REPOSITORY,
      useClass: AddressesRepository
    }
  ],
  exports: [AddressesService, ADDRESSES_REPOSITORY]
})
export class AddressesModule {}
