import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
  IsArray,
  ValidateNested,
  IsNotEmpty,
} from "class-validator";

export class CreateProductImageDto {
  @ApiProperty({ example: "https://example.com/image.jpg" })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({ example: "Red nail polish bottle", required: false })
  @IsString()
  @IsOptional()
  altText?: string;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  sortOrder?: number;
}

export class CreateProductVariantDto {
  @ApiProperty({ example: "Red - 15ml" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "NP-RED-15ML" })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ example: 12.99, required: false })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0)
  inventory: number;

  @ApiProperty({
    example: { color: "Red", size: "15ml" },
    description: "Variant attributes as JSON",
  })
  @IsNotEmpty()
  attributes: Record<string, any>;
}

export class CreateProductDto {
  @ApiProperty({ example: "Professional Nail Polish" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "professional-nail-polish" })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({
    example: "High-quality professional nail polish with long-lasting color.",
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 9.99 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 12.99, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  compareAtPrice?: number;

  @ApiProperty({ example: "NP-BASE" })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ example: "1234567890", required: false })
  @IsString()
  @IsOptional()
  barcode?: string;

  @ApiProperty({ example: 0.15, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  weight?: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0)
  inventory: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ type: [CreateProductImageDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductImageDto)
  @IsOptional()
  images?: CreateProductImageDto[];

  @ApiProperty({ type: [CreateProductVariantDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  @IsOptional()
  variants?: CreateProductVariantDto[];
}
