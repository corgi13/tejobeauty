import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, IsOptional, Min, Max } from "class-validator";

export class CreateProfessionalDto {
  @ApiProperty()
  @IsString()
  businessName: string;

  @ApiProperty()
  @IsString()
  taxId: string;

  @ApiProperty({ required: false, minimum: 0, maximum: 50 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(50)
  commissionRate?: number;
}
