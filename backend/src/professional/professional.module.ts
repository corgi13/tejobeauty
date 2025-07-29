import { Module } from "@nestjs/common";

import { ProfessionalController } from "./professional.controller";
import { ProfessionalService } from "./professional.service";
import { PrismaService } from "../prisma.service";

@Module({
  controllers: [ProfessionalController],
  providers: [ProfessionalService, PrismaService],
  exports: [ProfessionalService],
})
export class ProfessionalModule {}
