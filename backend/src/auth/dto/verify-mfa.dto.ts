import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class VerifyMfaDto {
  @ApiProperty({
    description: "TOTP code from authenticator app",
    example: "123456",
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: "TOTP code must be exactly 6 digits" })
  code: string;

  @ApiProperty({
    description: "User ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
