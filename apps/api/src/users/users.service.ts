import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import type { CreateUserInput, UpdateUserInput } from "@repo/shared";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: "desc" }
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async create(data: CreateUserInput) {
    try {
      return await this.prisma.user.create({ data });
    } catch (error) {
      this.handleKnownError(error);
    }
  }

  async update(id: string, data: UpdateUserInput) {
    await this.findOne(id);

    try {
      return await this.prisma.user.update({
        where: { id },
        data
      });
    } catch (error) {
      this.handleKnownError(error);
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.user.delete({ where: { id } });

    return { id };
  }

  private handleKnownError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new ConflictException("Email already exists");
    }

    throw error;
  }
}
