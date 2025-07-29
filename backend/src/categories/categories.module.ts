import { Module } from "@nestjs/common";

import { CategoriesController } from "./categories.controller";
import { CategoriesService } from "./categories.service";
import { PrismaService } from "../prisma.service";
import { SearchModule } from "../search/search.module";

@Module({
  imports: [SearchModule],
  controllers: [CategoriesController],
  providers: [CategoriesService, PrismaService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
