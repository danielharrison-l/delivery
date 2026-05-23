import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { getPaginationDatabaseParams } from "../common/pagination/pagination.utils";
import { PrismaService } from "../prisma/prisma.service";
import { customerSearchMode, customerSelect } from "./customers.constants";
import type { CustomersRepositoryContract } from "./customers.repository.contract";
import type { CustomerFindManyQuery, CustomerPaginatedRecords, CustomerRecord } from "./customers.types";

@Injectable()
export class CustomersRepository implements CustomersRepositoryContract {
  constructor(private readonly prisma: PrismaService) {}

  async findManyPaginated(query: CustomerFindManyQuery): Promise<CustomerPaginatedRecords> {
    const pagination = getPaginationDatabaseParams(query);
    const where = this.toWhereInput(query);

    const [customers, total] = await this.prisma.$transaction([
      this.prisma.customer.findMany({
        where,
        select: customerSelect,
        orderBy: { createdAt: "desc" },
        skip: pagination.skip,
        take: pagination.take
      }),
      this.prisma.customer.count({ where })
    ]);

    return {
      data: customers,
      total
    };
  }

  async findById(id: string): Promise<CustomerRecord | null> {
    return this.prisma.customer.findUnique({
      where: { id },
      select: customerSelect
    });
  }

  async create(data: Prisma.CustomerCreateInput): Promise<CustomerRecord> {
    return this.prisma.customer.create({
      data,
      select: customerSelect
    });
  }

  async update(id: string, data: Prisma.CustomerUpdateInput): Promise<CustomerRecord> {
    return this.prisma.customer.update({
      where: { id },
      data,
      select: customerSelect
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.customer.delete({
      where: { id }
    });
  }

  private toWhereInput(query: CustomerFindManyQuery): Prisma.CustomerWhereInput | undefined {
    if (!query.search) {
      return undefined;
    }

    return {
      OR: [
        {
          name: {
            contains: query.search,
            mode: customerSearchMode
          }
        },
        {
          email: {
            contains: query.search,
            mode: customerSearchMode
          }
        }
      ]
    };
  }
}
