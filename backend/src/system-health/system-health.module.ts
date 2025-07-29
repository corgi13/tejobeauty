import { Module } from "@nestjs/common";

import { SystemHealthController } from "./system-health.controller";
import { SystemHealthService } from "./system-health.service";
import { PrismaService } from "../prisma.service";

@Module({
  controllers: [SystemHealthController],
  providers: [SystemHealthService, PrismaService],
  exports: [SystemHealthService],
})
export class SystemHealthModule {}
