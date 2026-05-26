import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { authErrors } from "./auth.errors";
import type { AuthenticatedCustomer } from "./auth.types";

type AuthenticatedRequest = {
  user?: AuthenticatedCustomer;
};

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    if (request.user?.role !== "ADMIN") {
      throw new ForbiddenException(authErrors.adminOnly);
    }

    return true;
  }
}
