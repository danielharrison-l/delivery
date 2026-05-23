import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Post, Res, UseGuards } from "@nestjs/common";
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from "@repo/shared";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import {
  authClearRefreshTokenCookieOptions,
  authConstants,
  authRefreshTokenCookieOptions
} from "./auth.constants";
import { AuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { CurrentUser } from "./current-user.decorator";
import type { AuthenticatedCustomer } from "./auth.types";

type CookieOptions = typeof authRefreshTokenCookieOptions | typeof authClearRefreshTokenCookieOptions;

type CookieResponse = {
  cookie(name: string, value: string, options: CookieOptions): CookieResponse;
  clearCookie(name: string, options: CookieOptions): CookieResponse;
};

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(
    @Body(new ZodValidationPipe(registerSchema)) data: RegisterInput,
    @Res({ passthrough: true }) response: CookieResponse
  ) {
    const session = await this.authService.register(data);
    this.setRefreshTokenCookie(response, session.refreshToken);
    return { customer: session.customer, accessToken: session.accessToken };
  }

  @Post("login")
  async login(
    @Body(new ZodValidationPipe(loginSchema)) data: LoginInput,
    @Res({ passthrough: true }) response: CookieResponse
  ) {
    const session = await this.authService.login(data);
    this.setRefreshTokenCookie(response, session.refreshToken);
    return { customer: session.customer, accessToken: session.accessToken };
  }

  @Post("refresh")
  async refresh(
    @Headers("cookie") cookieHeader: string | undefined,
    @Res({ passthrough: true }) response: CookieResponse
  ) {
    const session = await this.authService.refresh(this.getRefreshTokenFromCookie(cookieHeader));
    this.setRefreshTokenCookie(response, session.refreshToken);
    return { customer: session.customer, accessToken: session.accessToken };
  }

  @Post("logout")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @Headers("cookie") cookieHeader: string | undefined,
    @Res({ passthrough: true }) response: CookieResponse
  ) {
    await this.authService.logout(this.getOptionalRefreshTokenFromCookie(cookieHeader));
    response.clearCookie(authConstants.refreshTokenCookieName, authClearRefreshTokenCookieOptions);
  }

  @Get("me")
  @UseGuards(AuthGuard)
  me(@CurrentUser() customer: AuthenticatedCustomer) {
    return customer;
  }

  private setRefreshTokenCookie(response: CookieResponse, refreshToken: string): void {
    response.cookie(authConstants.refreshTokenCookieName, refreshToken, authRefreshTokenCookieOptions);
  }

  private getRefreshTokenFromCookie(cookieHeader: string | undefined): string {
    const refreshToken = this.getOptionalRefreshTokenFromCookie(cookieHeader);

    if (!refreshToken) {
      return "";
    }

    return refreshToken;
  }

  private getOptionalRefreshTokenFromCookie(cookieHeader: string | undefined): string | null {
    if (!cookieHeader) {
      return null;
    }

    const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
    const refreshTokenCookie = cookies.find((cookie) =>
      cookie.startsWith(`${authConstants.refreshTokenCookieName}=`)
    );

    if (!refreshTokenCookie) {
      return null;
    }

    return decodeURIComponent(refreshTokenCookie.split("=").slice(1).join("="));
  }
}
