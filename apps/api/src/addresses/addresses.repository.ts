import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { customerAddressSelect } from "./addresses.constants";
import type { AddressesRepositoryContract } from "./addresses.repository.contract";
import type { CustomerAddressRecord } from "./addresses.types";

@Injectable()
export class AddressesRepository implements AddressesRepositoryContract {
  constructor(private readonly prisma: PrismaService) {}

  async findByCustomerId(customerId: string): Promise<CustomerAddressRecord[]> {
    return this.prisma.customerAddress.findMany({
      where: { customerId },
      select: customerAddressSelect,
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }]
    });
  }

  async findDefaultByCustomerId(customerId: string): Promise<CustomerAddressRecord | null> {
    return this.prisma.customerAddress.findFirst({
      where: { customerId, isDefault: true },
      select: customerAddressSelect,
      orderBy: { createdAt: "desc" }
    });
  }

  async findById(id: string): Promise<CustomerAddressRecord | null> {
    return this.prisma.customerAddress.findUnique({
      where: { id },
      select: customerAddressSelect
    });
  }

  async create(data: Prisma.CustomerAddressCreateInput): Promise<CustomerAddressRecord> {
    return this.prisma.customerAddress.create({
      data,
      select: customerAddressSelect
    });
  }

  async update(id: string, data: Prisma.CustomerAddressUpdateInput): Promise<CustomerAddressRecord> {
    return this.prisma.customerAddress.update({
      where: { id },
      data,
      select: customerAddressSelect
    });
  }

  async unsetDefault(customerId: string, exceptId?: string): Promise<void> {
    await this.prisma.customerAddress.updateMany({
      where: {
        customerId,
        id: exceptId ? { not: exceptId } : undefined,
        isDefault: true
      },
      data: { isDefault: false }
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.customerAddress.delete({
      where: { id }
    });
  }
}
