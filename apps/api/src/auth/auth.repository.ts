import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { authCustomerSelect, authCustomerWithPasswordSelect, refreshTokenSelect } from "./auth.constants";
import type { AuthRepositoryContract } from "./auth.repository.contract";
import type {
  AuthCustomerRecord,
  AuthCustomerWithPasswordRecord,
  RefreshTokenCreateData,
  RefreshTokenRecord
} from "./auth.types";
import type { Prisma } from "@prisma/client";

@Injectable()
export class AuthRepository implements AuthRepositoryContract {
  constructor(private readonly prisma: PrismaService) {}

  async findCustomerById(id: string): Promise<AuthCustomerRecord | null> {
    return this.prisma.customer.findUnique({
      where: { id },
      select: authCustomerSelect
    });
  }

  async findCustomerByEmailWithPassword(email: string): Promise<AuthCustomerWithPasswordRecord | null> {
    return this.prisma.customer.findUnique({
      where: { email },
      select: authCustomerWithPasswordSelect
    });
  }

  async createCustomer(data: Prisma.CustomerCreateInput): Promise<AuthCustomerRecord> {
    return this.prisma.customer.create({
      data,
      select: authCustomerSelect
    });
  }

  async updateCustomer(id: string, data: Prisma.CustomerUpdateInput): Promise<AuthCustomerRecord> {
    return this.prisma.customer.update({
      where: { id },
      data,
      select: authCustomerSelect
    });
  }

  async createRefreshToken(data: RefreshTokenCreateData): Promise<RefreshTokenRecord> {
    return this.prisma.refreshToken.create({
      data: {
        tokenHash: data.tokenHash,
        expiresAt: data.expiresAt,
        customer: {
          connect: { id: data.customerId }
        }
      },
      select: refreshTokenSelect
    });
  }

  async findRefreshTokenByHash(tokenHash: string): Promise<RefreshTokenRecord | null> {
    return this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      select: refreshTokenSelect
    });
  }

  async rotateRefreshToken(
    currentTokenId: string,
    data: RefreshTokenCreateData,
    revokedAt: Date
  ): Promise<RefreshTokenRecord> {
    return this.prisma.$transaction(async (transaction) => {
      const nextToken = await transaction.refreshToken.create({
        data: {
          tokenHash: data.tokenHash,
          expiresAt: data.expiresAt,
          customer: {
            connect: { id: data.customerId }
          }
        },
        select: refreshTokenSelect
      });

      await transaction.refreshToken.update({
        where: { id: currentTokenId },
        data: {
          revokedAt,
          replacedByTokenId: nextToken.id
        }
      });

      return nextToken;
    });
  }

  async revokeRefreshToken(id: string, revokedAt: Date): Promise<void> {
    await this.prisma.refreshToken.update({
      where: { id },
      data: { revokedAt }
    });
  }
}
