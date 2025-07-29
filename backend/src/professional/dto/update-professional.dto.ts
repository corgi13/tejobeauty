import { PartialType } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

import { CreateProfessionalDto } from "./create-professional.dto";

export class UpdateProfessionalDto extends PartialType(CreateProfessionalDto) {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}
