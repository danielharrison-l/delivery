import { Global, Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { AdminGuard } from "./admin.guard";
import { AuthController } from "./auth.controller";
import { AuthGuard } from "./auth.guard";
import { AuthPasswordService } from "./auth-password.service";
import { AuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";
import { AuthTokenService } from "./auth-token.service";
import { AUTH_REPOSITORY } from "./auth.tokens";

@Global()
@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthPasswordService,
    AuthTokenService,
    AuthGuard,
    AdminGuard,
    {
      provide: AUTH_REPOSITORY,
      useClass: AuthRepository
    }
  ],
  exports: [AuthService, AuthGuard, AdminGuard, AuthTokenService]
})
export class AuthModule {}
