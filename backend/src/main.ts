import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get ConfigService instance
  const configService = app.get(ConfigService);

  // Enable CORS
  app.enableCors({
    origin: [
      "http://localhost:3000",
      "http://138.199.226.201:3000",
      "https://tejo-nails.com",
      "https://www.tejo-nails.com",
    ],
    credentials: true,
  });

  // Set global prefix
  app.setGlobalPrefix("api");

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle("Tejo Nails Platform API")
    .setDescription("API documentation for Tejo Nails Platform")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  // Start the server with ConfigService
  const port = configService.get<number>("PORT", 3002);
  const nodeEnv = configService.get<string>("NODE_ENV", "development");

  await app.listen(port, "0.0.0.0");

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  console.log(`🌍 Environment: ${nodeEnv}`);
  console.log(`🔗 Frontend URL: ${configService.get<string>("FRONTEND_URL")}`);
}
bootstrap();
