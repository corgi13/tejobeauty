import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class EnableMfaDto {
  @ApiProperty({
    description: "TOTP code from authenticator app",
    example: "123456",
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: "TOTP code must be exactly 6 digits" })
  code: string;
}
