import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsBoolean, IsNotEmpty } from "class-validator";

export class CreateCategoryDto {
  @ApiProperty({ example: "Nail Polish" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "nail-polish" })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({
    example: "High-quality nail polishes for professional use.",
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    required: false,
  })
  @IsString()
  @IsOptional()
  parentId?: string;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  sortOrder?: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
