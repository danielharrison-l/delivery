import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import type { AuthenticatedCustomer } from "../auth/auth.types";
import { CurrentUser } from "../auth/current-user.decorator";
import { HomeService } from "./home.service";

@Controller("home")
@UseGuards(AuthGuard)
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  getCustomerHome(@CurrentUser() customer: AuthenticatedCustomer) {
    return this.homeService.getCustomerHome(customer.id);
  }
}
