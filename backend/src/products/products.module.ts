import { Module } from "@nestjs/common";

import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import { CacheModule } from "../cache/cache.module";
import { PrismaService } from "../prisma.service";
import { SearchModule } from "../search/search.module";

@Module({
  imports: [CacheModule, SearchModule],
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService],
  exports: [ProductsService],
})
export class ProductsModule {}
