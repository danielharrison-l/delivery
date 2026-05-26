import type {
  AuthCustomerRecord,
  AuthCustomerWithPasswordRecord,
  RefreshTokenCreateData,
  RefreshTokenRecord
} from "./auth.types";
import type { Prisma } from "@prisma/client";

export interface AuthRepositoryContract {
  findCustomerById(id: string): Promise<AuthCustomerRecord | null>;
  findCustomerByEmailWithPassword(email: string): Promise<AuthCustomerWithPasswordRecord | null>;
  createCustomer(data: Prisma.CustomerCreateInput): Promise<AuthCustomerRecord>;
  updateCustomer(id: string, data: Prisma.CustomerUpdateInput): Promise<AuthCustomerRecord>;
  createRefreshToken(data: RefreshTokenCreateData): Promise<RefreshTokenRecord>;
  findRefreshTokenByHash(tokenHash: string): Promise<RefreshTokenRecord | null>;
  rotateRefreshToken(currentTokenId: string, data: RefreshTokenCreateData, revokedAt: Date): Promise<RefreshTokenRecord>;
  revokeRefreshToken(id: string, revokedAt: Date): Promise<void>;
}
