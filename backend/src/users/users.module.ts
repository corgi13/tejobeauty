import { Module } from "@nestjs/common";

import { UserPreferencesController } from "./user-preferences.controller";
import { UserPreferencesService } from "./user-preferences.service";
import { PrismaService } from "../prisma.service";

@Module({
  controllers: [UserPreferencesController],
  providers: [UserPreferencesService, PrismaService],
  exports: [UserPreferencesService],
})
export class UsersModule {}
