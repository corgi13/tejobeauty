import { Module } from "@nestjs/common";

import { AddressValidationController } from "./address-validation.controller";
import { AddressValidationService } from "./address-validation.service";

@Module({
  controllers: [AddressValidationController],
  providers: [AddressValidationService],
  exports: [AddressValidationService],
})
export class AddressModule {}
