import { Inject, Injectable, Logger } from "@nestjs/common";
import { handlePrismaError } from "../common/errors/prisma-error.utils";
import { homeMapper } from "./home.mapper";
import type { HomeRepositoryContract } from "./home.repository.contract";
import { HOME_REPOSITORY } from "./home.tokens";
import type { CustomerHomeDto } from "./home.types";

@Injectable()
export class HomeService {
  private readonly logger = new Logger(HomeService.name);

  constructor(
    @Inject(HOME_REPOSITORY)
    private readonly homeRepository: HomeRepositoryContract
  ) {}

  async getCustomerHome(customerId: string): Promise<CustomerHomeDto> {
    try {
      const records = await this.homeRepository.getCustomerHome(customerId);
      return homeMapper.toDto(records);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  private handleDatabaseError(error: unknown): never {
    return handlePrismaError(error, {
      context: HomeService.name,
      logger: this.logger,
      knownErrors: {}
    });
  }
}
