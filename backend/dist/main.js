"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.enableCors({
        origin: [
            "http://localhost:3000",
            "http://138.199.226.201:3000",
            "https://tejo-nails.com",
            "https://www.tejo-nails.com",
        ],
        credentials: true,
    });
    app.setGlobalPrefix("api");
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle("Tejo Nails Platform API")
        .setDescription("API documentation for Tejo Nails Platform")
        .setVersion("1.0")
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup("api/docs", app, document);
    const port = configService.get("PORT", 3002);
    const nodeEnv = configService.get("NODE_ENV", "development");
    await app.listen(port, "0.0.0.0");
    console.log(`🚀 Application is running on: http://localhost:${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
    console.log(`🌍 Environment: ${nodeEnv}`);
    console.log(`🔗 Frontend URL: ${configService.get("FRONTEND_URL")}`);
}
bootstrap();
//# sourceMappingURL=main.js.map