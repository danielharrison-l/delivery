import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { setupOpenApi } from "./docs/openapi";

type CorsCallback = (error: Error | null, allow?: boolean) => void;

function normalizeOrigin(origin: string) {
  return origin.trim().replace(/^['"]|['"]$/g, "").replace(/\/$/, "");
}

function parseCorsOrigins(value: string | undefined) {
  return new Set(
    value
      ?.split(",")
      .map((origin) => normalizeOrigin(origin))
      .filter(Boolean) ?? []
  );
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins = parseCorsOrigins(process.env.CORS_ORIGIN);

  app.enableCors({
    origin: (origin: string | undefined, callback: CorsCallback) => {
      if (!origin || allowedOrigins.size === 0 || allowedOrigins.has(normalizeOrigin(origin))) {
        callback(null, true);
        return;
      }

      callback(null, false);
    },
    credentials: true
  });
  app.setGlobalPrefix("api");
  setupOpenApi(app);

  const port = Number(process.env.PORT ?? 3333);
  await app.listen(port);
}

void bootstrap();
