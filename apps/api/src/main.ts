import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOrigin = process.env.CORS_ORIGIN?.split(",").map((origin) => origin.trim());

  app.enableCors({
    origin: corsOrigin?.length ? corsOrigin : true
  });
  app.setGlobalPrefix("api");

  const port = Number(process.env.PORT ?? 3333);
  await app.listen(port);
}

void bootstrap();
