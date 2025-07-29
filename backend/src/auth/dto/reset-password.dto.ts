import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength, Matches } from "class-validator";

export class ResetPasswordDto {
  @ApiProperty({
    description: "Password reset token",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  })
  @IsString()
  @IsNotEmpty({ message: "Token is required" })
  token: string;

  @ApiProperty({
    description:
      "New password (min 8 chars, must include uppercase, lowercase, number)",
    example: "NewPassword123",
  })
  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message:
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
  })
  password: string;

  @ApiProperty({
    description: "Confirm new password",
    example: "NewPassword123",
  })
  @IsString()
  @IsNotEmpty({ message: "Password confirmation is required" })
  passwordConfirmation: string;
}
