import { Module } from '@nestjs/common';
import { CroatiaTaxService } from './croatia-tax.service';
import { CroatiaBusinessService } from './croatia-business.service';
import { CroatiaShippingService } from './croatia-shipping.service';
import { CroatiaController } from './croatia.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [CroatiaController],
  providers: [
    CroatiaTaxService,
    CroatiaBusinessService,
    CroatiaShippingService,
    PrismaService,
  ],
  exports: [
    CroatiaTaxService,
    CroatiaBusinessService,
    CroatiaShippingService,
  ],
})
export class CroatiaModule {}
