import { ConflictException, Inject, Injectable, Logger, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { handlePrismaError } from "../common/errors/prisma-error.utils";
import { authErrors } from "./auth.errors";
import { authMapper } from "./auth.mapper";
import { AuthPasswordService } from "./auth-password.service";
import type { AuthRepositoryContract } from "./auth.repository.contract";
import { AuthTokenService } from "./auth-token.service";
import { AUTH_REPOSITORY } from "./auth.tokens";
import type {
  AuthCustomerRecord,
  AuthLoginData,
  AuthProfileUpdateData,
  AuthRegisterData,
  AuthSessionWithRefreshToken,
  AuthenticatedCustomer,
  RefreshTokenRecord
} from "./auth.types";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: AuthRepositoryContract,
    private readonly authPasswordService: AuthPasswordService,
    private readonly authTokenService: AuthTokenService
  ) {}

  async register(data: AuthRegisterData): Promise<AuthSessionWithRefreshToken> {
    const passwordHash = await this.authPasswordService.hash(data.password);

    try {
      const customer = await this.authRepository.createCustomer(authMapper.toCustomerCreateData(data, passwordHash));
      return this.createSession(customer);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async login(data: AuthLoginData): Promise<AuthSessionWithRefreshToken> {
    const customer = await this.authRepository.findCustomerByEmailWithPassword(data.email);

    if (!customer?.passwordHash) {
      throw new UnauthorizedException(authErrors.invalidCredentials);
    }

    const passwordMatches = await this.authPasswordService.verify(data.password, customer.passwordHash);

    if (!passwordMatches) {
      throw new UnauthorizedException(authErrors.invalidCredentials);
    }

    return this.createSession(customer);
  }

  async refresh(refreshTokenValue: string): Promise<AuthSessionWithRefreshToken> {
    const tokenHash = this.authTokenService.hashRefreshToken(refreshTokenValue);
    const refreshToken = await this.findUsableRefreshTokenOrFail(tokenHash);
    const customer = await this.findCustomerOrFail(refreshToken.customerId);
    const nextRefreshToken = this.authTokenService.createRefreshToken();
    const nextRefreshTokenHash = this.authTokenService.hashRefreshToken(nextRefreshToken);

    try {
      await this.authRepository.rotateRefreshToken(
        refreshToken.id,
        {
          customerId: customer.id,
          tokenHash: nextRefreshTokenHash,
          expiresAt: this.authTokenService.createRefreshTokenExpiresAt()
        },
        new Date()
      );

      const accessToken = this.authTokenService.createAccessToken(customer);
      return authMapper.toSessionWithRefreshTokenDto(customer, accessToken, nextRefreshToken);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async logout(refreshTokenValue: string | null): Promise<void> {
    if (!refreshTokenValue) {
      return;
    }

    const tokenHash = this.authTokenService.hashRefreshToken(refreshTokenValue);
    const refreshToken = await this.authRepository.findRefreshTokenByHash(tokenHash);

    if (!refreshToken || refreshToken.revokedAt) {
      return;
    }

    try {
      await this.authRepository.revokeRefreshToken(refreshToken.id, new Date());
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async me(customerId: string): Promise<AuthenticatedCustomer> {
    const customer = await this.findCustomerOrFail(customerId);
    return authMapper.toCustomerDto(customer);
  }

  async updateProfile(customerId: string, data: AuthProfileUpdateData): Promise<AuthenticatedCustomer> {
    try {
      const customer = await this.authRepository.updateCustomer(customerId, authMapper.toCustomerUpdateData(data));
      return authMapper.toCustomerDto(customer);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async getAuthenticatedCustomer(customerId: string): Promise<AuthenticatedCustomer> {
    return this.me(customerId);
  }

  private async createSession(customer: AuthCustomerRecord): Promise<AuthSessionWithRefreshToken> {
    const accessToken = this.authTokenService.createAccessToken(customer);
    const refreshToken = this.authTokenService.createRefreshToken();

    try {
      await this.authRepository.createRefreshToken({
        customerId: customer.id,
        tokenHash: this.authTokenService.hashRefreshToken(refreshToken),
        expiresAt: this.authTokenService.createRefreshTokenExpiresAt()
      });

      return authMapper.toSessionWithRefreshTokenDto(customer, accessToken, refreshToken);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  private async findCustomerOrFail(customerId: string): Promise<AuthCustomerRecord> {
    try {
      const customer = await this.authRepository.findCustomerById(customerId);

      if (!customer) {
        throw new NotFoundException(authErrors.customerNotFound);
      }

      return customer;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.handleDatabaseError(error);
    }
  }

  private async findUsableRefreshTokenOrFail(tokenHash: string): Promise<RefreshTokenRecord> {
    try {
      const refreshToken = await this.authRepository.findRefreshTokenByHash(tokenHash);

      if (!refreshToken || refreshToken.revokedAt || refreshToken.expiresAt <= new Date()) {
        throw new UnauthorizedException(authErrors.invalidRefreshToken);
      }

      return refreshToken;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      this.handleDatabaseError(error);
    }
  }

  private handleDatabaseError(error: unknown): never {
    return handlePrismaError(error, {
      context: AuthService.name,
      logger: this.logger,
      knownErrors: {
        P2002: () => new ConflictException(authErrors.emailAlreadyExists),
        P2025: () => new NotFoundException(authErrors.customerNotFound)
      }
    });
  }
}
