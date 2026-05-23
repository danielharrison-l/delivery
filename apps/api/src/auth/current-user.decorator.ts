import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { authErrors } from "./auth.errors";
import type { AuthenticatedCustomer } from "./auth.types";

type AuthenticatedRequest = {
  user?: AuthenticatedCustomer;
};

export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext): AuthenticatedCustomer => {
  const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

  if (!request.user) {
    throw new UnauthorizedException(authErrors.missingAccessToken);
  }

  return request.user;
});
