import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { setupOpenApi } from "./docs/openapi";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOrigin = process.env.CORS_ORIGIN?.split(",").map((origin) => origin.trim());

  app.enableCors({
    origin: corsOrigin?.length ? corsOrigin : true,
    credentials: true
  });
  app.setGlobalPrefix("api");
  setupOpenApi(app);

  const port = Number(process.env.PORT ?? 3333);
  await app.listen(port);
}

void bootstrap();
