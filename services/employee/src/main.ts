import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend communication
  app.enableCors({
    origin: ["http://localhost:3000", "http://frontend:3000"], // frontend dev & docker
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // remove unknown properties
      forbidNonWhitelisted: true, // error kalau ada property aneh
      transform: true,            // auto-convert types (string -> number, dll)
    }),
  );

  const port = process.env.PORT || 3002;
  await app.listen(port);
  console.log(`Employee Service is running on port ${port}`);
}
bootstrap();
