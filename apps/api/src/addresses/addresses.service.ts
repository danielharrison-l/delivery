import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { handlePrismaError } from "../common/errors/prisma-error.utils";
import { addressesErrors } from "./addresses.errors";
import { addressesMapper } from "./addresses.mapper";
import type { AddressesRepositoryContract } from "./addresses.repository.contract";
import { ADDRESSES_REPOSITORY } from "./addresses.tokens";
import type {
  CustomerAddressCreateData,
  CustomerAddressDto,
  CustomerAddressRecord,
  CustomerAddressUpdateData
} from "./addresses.types";

@Injectable()
export class AddressesService {
  private readonly logger = new Logger(AddressesService.name);

  constructor(
    @Inject(ADDRESSES_REPOSITORY)
    private readonly addressesRepository: AddressesRepositoryContract
  ) {}

  async findMany(customerId: string): Promise<CustomerAddressDto[]> {
    try {
      const addresses = await this.addressesRepository.findByCustomerId(customerId);
      return addresses.map((address) => addressesMapper.toDto(address));
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async create(customerId: string, data: CustomerAddressCreateData): Promise<CustomerAddressDto> {
    const shouldSetDefault = data.isDefault ?? (await this.shouldCreateDefaultAddress(customerId));

    if (shouldSetDefault) {
      await this.unsetDefault(customerId);
    }

    try {
      const address = await this.addressesRepository.create(
        addressesMapper.toCreateData(customerId, { ...data, isDefault: shouldSetDefault })
      );
      return addressesMapper.toDto(address);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async update(customerId: string, id: string, data: CustomerAddressUpdateData): Promise<CustomerAddressDto> {
    await this.findRecordForCustomerOrFail(customerId, id);

    if (data.isDefault) {
      await this.unsetDefault(customerId, id);
    }

    try {
      const address = await this.addressesRepository.update(id, addressesMapper.toUpdateData(data));
      return addressesMapper.toDto(address);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async setDefault(customerId: string, id: string): Promise<CustomerAddressDto> {
    await this.findRecordForCustomerOrFail(customerId, id);
    await this.unsetDefault(customerId, id);

    try {
      const address = await this.addressesRepository.update(id, { isDefault: true });
      return addressesMapper.toDto(address);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async remove(customerId: string, id: string): Promise<void> {
    const address = await this.findRecordForCustomerOrFail(customerId, id);

    try {
      await this.addressesRepository.delete(id);
    } catch (error) {
      this.handleDatabaseError(error);
    }

    if (address.isDefault) {
      await this.ensureAnotherDefaultAddress(customerId);
    }
  }

  private async shouldCreateDefaultAddress(customerId: string): Promise<boolean> {
    try {
      const defaultAddress = await this.addressesRepository.findDefaultByCustomerId(customerId);
      return !defaultAddress;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  private async ensureAnotherDefaultAddress(customerId: string): Promise<void> {
    try {
      const [nextAddress] = await this.addressesRepository.findByCustomerId(customerId);

      if (nextAddress) {
        await this.addressesRepository.update(nextAddress.id, { isDefault: true });
      }
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  private async unsetDefault(customerId: string, exceptId?: string): Promise<void> {
    try {
      await this.addressesRepository.unsetDefault(customerId, exceptId);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  private async findRecordForCustomerOrFail(customerId: string, id: string): Promise<CustomerAddressRecord> {
    try {
      const address = await this.addressesRepository.findById(id);

      if (!address || address.customerId !== customerId) {
        throw new NotFoundException(addressesErrors.notFound);
      }

      return address;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.handleDatabaseError(error);
    }
  }

  private handleDatabaseError(error: unknown): never {
    return handlePrismaError(error, {
      context: AddressesService.name,
      logger: this.logger,
      knownErrors: {
        P2025: () => new NotFoundException(addressesErrors.notFound)
      }
    });
  }
}
