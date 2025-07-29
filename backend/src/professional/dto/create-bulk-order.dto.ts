import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsString,
  IsArray,
  ValidateNested,
  IsNumber,
  IsUUID,
} from "class-validator";

export class BulkOrderItemDto {
  @ApiProperty()
  @IsUUID()
  productId: string;

  @ApiProperty()
  @IsString()
  productName: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  price: number;
}

export class CreateBulkOrderDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ type: [BulkOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkOrderItemDto)
  items: BulkOrderItemDto[];
}
