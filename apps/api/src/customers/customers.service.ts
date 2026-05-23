import { ConflictException, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { handlePrismaError } from "../common/errors/prisma-error.utils";
import { createPaginatedResult } from "../common/pagination/pagination.utils";
import { customersErrors } from "./customers.errors";
import { customersMapper } from "./customers.mapper";
import type { CustomersRepositoryContract } from "./customers.repository.contract";
import { CUSTOMERS_REPOSITORY } from "./customers.tokens";
import type {
  CustomerCreateData,
  CustomerDto,
  CustomerFindManyQuery,
  CustomerRecord,
  CustomersPageDto,
  CustomerUpdateData
} from "./customers.types";

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);

  constructor(
    @Inject(CUSTOMERS_REPOSITORY)
    private readonly customersRepository: CustomersRepositoryContract
  ) {}

  async findMany(query: CustomerFindManyQuery): Promise<CustomersPageDto> {
    try {
      const customers = await this.customersRepository.findManyPaginated(query);
      return createPaginatedResult(
        customers.data.map((customer) => customersMapper.toDto(customer)),
        query,
        customers.total
      );
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async findOne(id: string): Promise<CustomerDto> {
    const customer = await this.findRecordOrFail(id);
    return customersMapper.toDto(customer);
  }

  async create(data: CustomerCreateData): Promise<CustomerDto> {
    try {
      const customer = await this.customersRepository.create(customersMapper.toCreateData(data));

      return customersMapper.toDto(customer);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async update(id: string, data: CustomerUpdateData): Promise<CustomerDto> {
    await this.findRecordOrFail(id);

    try {
      const customer = await this.customersRepository.update(id, customersMapper.toUpdateData(data));

      return customersMapper.toDto(customer);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async remove(id: string): Promise<void> {
    await this.findRecordOrFail(id);

    try {
      await this.customersRepository.delete(id);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  private async findRecordOrFail(id: string): Promise<CustomerRecord> {
    try {
      const customer = await this.customersRepository.findById(id);

      if (!customer) {
        throw new NotFoundException(customersErrors.notFound);
      }

      return customer;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.handleDatabaseError(error);
    }
  }

  private handleDatabaseError(error: unknown): never {
    return handlePrismaError(error, {
      context: CustomersService.name,
      logger: this.logger,
      knownErrors: {
        P2002: () => new ConflictException(customersErrors.emailAlreadyExists),
        P2025: () => new NotFoundException(customersErrors.notFound)
      }
    });
  }
}
