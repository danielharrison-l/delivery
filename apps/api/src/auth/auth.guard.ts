import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { authErrors } from "./auth.errors";
import { AuthService } from "./auth.service";
import { AuthTokenService } from "./auth-token.service";
import type { AuthenticatedCustomer } from "./auth.types";

type AuthHttpRequest = {
  headers: {
    authorization?: string | string[];
  };
  user?: AuthenticatedCustomer;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly authTokenService: AuthTokenService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthHttpRequest>();
    const token = this.extractBearerToken(request.headers.authorization);

    if (!token) {
      throw new UnauthorizedException(authErrors.missingAccessToken);
    }

    const payload = this.authTokenService.verifyAccessToken(token);

    if (!payload) {
      throw new UnauthorizedException(authErrors.invalidAccessToken);
    }

    request.user = await this.authService.getAuthenticatedCustomer(payload.sub);

    return true;
  }

  private extractBearerToken(authorization: string | string[] | undefined): string | null {
    const header = Array.isArray(authorization) ? authorization[0] : authorization;

    if (!header) {
      return null;
    }

    const [type, token] = header.split(" ");

    if (type !== "Bearer" || !token) {
      return null;
    }

    return token;
  }
}
