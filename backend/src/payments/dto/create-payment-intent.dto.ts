import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, IsOptional, Min } from "class-validator";

export class CreatePaymentIntentDto {
  @ApiProperty({ example: 2999, description: "Amount in cents" })
  @IsNumber()
  @Min(50, { message: "Amount must be at least 50 cents" })
  amount: number;

  @ApiProperty({ example: "usd", description: "Currency code" })
  @IsString()
  currency: string;

  @ApiProperty({
    example: "order_123",
    description: "Order ID or reference",
    required: false,
  })
  @IsOptional()
  @IsString()
  orderId?: string;

  @ApiProperty({
    example: "user_456",
    description: "Customer ID",
    required: false,
  })
  @IsOptional()
  @IsString()
  customerId?: string;
}
