import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";

import { AuthService } from "./auth.service";
import { Roles } from "./decorators/roles.decorator";
import { EnableMfaDto } from "./dto/enable-mfa.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { VerifyEmailDto } from "./dto/verify-email.dto";
import { VerifyMfaDto } from "./dto/verify-mfa.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { RolesGuard } from "./guards/roles.guard";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: "User registration" })
  @ApiResponse({ status: 201, description: "User registered successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 409, description: "User already exists" })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "User login" })
  @ApiResponse({ status: 200, description: "Login successful" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post("verify-email")
  @ApiOperation({ summary: "Verify email address" })
  @ApiResponse({ status: 200, description: "Email verified successfully" })
  @ApiResponse({ status: 401, description: "Invalid verification token" })
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto);
  }

  @Get("resend-verification/:email")
  @ApiOperation({ summary: "Resend verification email" })
  @ApiResponse({
    status: 200,
    description: "Verification email sent successfully",
  })
  @ApiResponse({ status: 404, description: "User not found" })
  async resendVerification(@Param("email") email: string) {
    return this.authService.resendVerificationEmail(email);
  }

  @Post("forgot-password")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Request password reset" })
  @ApiResponse({ status: 200, description: "Password reset email sent" })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post("reset-password")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Reset password with token" })
  @ApiResponse({ status: 200, description: "Password reset successful" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Invalid or expired token" })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Get("mfa/generate/:userId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Generate MFA secret and QR code" })
  @ApiResponse({
    status: 200,
    description: "MFA secret generated successfully",
  })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({ status: 400, description: "MFA already enabled" })
  async generateMfaSecret(@Param("userId") userId: string) {
    return this.authService.generateMfaSecret(userId);
  }

  @Post("mfa/enable/:userId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Enable MFA for user" })
  @ApiResponse({ status: 200, description: "MFA enabled successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({ status: 400, description: "MFA setup not initiated" })
  @ApiResponse({ status: 401, description: "Invalid MFA code" })
  async enableMfa(
    @Param("userId") userId: string,
    @Body() enableMfaDto: EnableMfaDto,
  ) {
    return this.authService.enableMfa(userId, enableMfaDto);
  }

  @Post("mfa/verify")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Verify MFA code and complete login" })
  @ApiResponse({ status: 200, description: "MFA verification successful" })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({ status: 400, description: "MFA not enabled" })
  @ApiResponse({ status: 401, description: "Invalid MFA code" })
  async verifyMfa(@Body() verifyMfaDto: VerifyMfaDto) {
    return this.authService.verifyMfa(verifyMfaDto);
  }

  @Post("mfa/disable/:userId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MANAGER")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Disable MFA for user (admin only)" })
  @ApiResponse({ status: 200, description: "MFA disabled successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({ status: 400, description: "MFA not enabled" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - insufficient permissions",
  })
  async disableMfa(@Param("userId") userId: string) {
    return this.authService.disableMfa(userId);
  }

  @Get("users")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all users (admin only)" })
  @ApiResponse({ status: 200, description: "List of users" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - insufficient permissions",
  })
  async getAllUsers() {
    // This is just an example endpoint to demonstrate role-based authorization
    return { message: "This endpoint would return all users (admin only)" };
  }
}
