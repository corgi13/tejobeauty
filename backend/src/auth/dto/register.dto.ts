import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
} from "class-validator";

export class RegisterDto {
  @ApiProperty({
    description: "User email address",
    example: "user@example.com",
  })
  @IsEmail({}, { message: "Please provide a valid email address" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;

  @ApiProperty({
    description:
      "User password (min 8 chars, must include uppercase, lowercase, number)",
    example: "Password123",
  })
  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message:
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
  })
  password: string;

  @ApiProperty({
    description: "User first name",
    example: "John",
  })
  @IsString()
  @IsNotEmpty({ message: "First name is required" })
  firstName: string;

  @ApiProperty({
    description: "User last name",
    example: "Doe",
  })
  @IsString()
  @IsNotEmpty({ message: "Last name is required" })
  lastName: string;
}
