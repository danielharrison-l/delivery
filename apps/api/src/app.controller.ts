import { Controller, Get } from "@nestjs/common";
import type { HealthResponse } from "@repo/shared";

@Controller("health")
export class AppController {
  @Get()
  health(): HealthResponse {
    return {
      status: "ok",
      service: "api",
      timestamp: new Date().toISOString()
    };
  }
}
