import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AddressModule } from "./address/address.module";
import { AnalyticsModule } from "./analytics/analytics.module";
import { AuthModule } from "./auth/auth.module";
import { CacheModule } from "./cache/cache.module";
import { CategoriesModule } from "./categories/categories.module";
import { CroatiaModule } from "./croatia/croatia.module";
import { EmailModule } from "./email/email.module";
import { OrdersModule } from "./orders/orders.module";
import { PaymentsModule } from "./payments/payments.module";
import { PrismaService } from "./prisma.service";
import { ProductsModule } from "./products/products.module";
import { ProfessionalModule } from "./professional/professional.module";
import { SearchModule } from "./search/search.module";
import { SystemHealthModule } from "./system-health/system-health.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    AuthModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    ProfessionalModule,
    AnalyticsModule,
    SearchModule,
    PaymentsModule,
    SystemHealthModule,
    EmailModule,
    UsersModule,
    AddressModule,
    CacheModule,
    CroatiaModule,
  ],
  controllers: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
