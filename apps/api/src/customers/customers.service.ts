import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import type { CreateCustomerInput, UpdateCustomerInput } from "@repo/shared";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany() {
    return this.prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
      omit: { passwordHash: true }
    });
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      omit: { passwordHash: true }
    });

    if (!customer) {
      throw new NotFoundException("Customer not found");
    }

    return customer;
  }

  async create(data: CreateCustomerInput) {
    try {
      return await this.prisma.customer.create({
        data: this.cleanInput(data),
        omit: { passwordHash: true }
      });
    } catch (error) {
      this.handleKnownError(error);
    }
  }

  async update(id: string, data: UpdateCustomerInput) {
    await this.findOne(id);

    try {
      return await this.prisma.customer.update({
        where: { id },
        data: this.cleanInput(data),
        omit: { passwordHash: true }
      });
    } catch (error) {
      this.handleKnownError(error);
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.customer.delete({ where: { id } });

    return { id };
  }

  private cleanInput<T extends CreateCustomerInput | UpdateCustomerInput>(data: T) {
    return {
      ...data,
      phone: data.phone || undefined,
      address: data.address || undefined
    };
  }

  private handleKnownError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new ConflictException("Email already exists");
    }

    throw error;
  }
}
