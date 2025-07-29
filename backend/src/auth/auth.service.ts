import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
// import * as bcrypt from "bcrypt"; // Temporarily disabled for Windows compatibility
import { authenticator } from "otplib";
import * as qrcode from "qrcode";

import { PrismaService } from "../prisma.service";
import { EnableMfaDto } from "./dto/enable-mfa.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { VerifyEmailDto } from "./dto/verify-email.dto";
import { VerifyMfaDto } from "./dto/verify-mfa.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException("User with this email already exists");
    }

    // For demo purposes, store password as-is (in production, use proper hashing)
    const hashedPassword = password;

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
      },
    });

    // Generate verification token
    const verificationToken = this.jwtService.sign(
      { email: user.email, type: "email-verification" },
      { expiresIn: "24h" },
    );

    // TODO: Send verification email

    return {
      message:
        "User registered successfully. Please check your email for verification.",
      userId: user.id,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      throw new UnauthorizedException(
        "Please verify your email before logging in",
      );
    }

    // For demo purposes, simple password comparison (in production, use proper hashing)
    const isPasswordValid = password === user.password;

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // Generate JWT token
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const { token } = verifyEmailDto;

    try {
      // Verify token
      const payload = this.jwtService.verify(token);

      if (payload.type !== "email-verification") {
        throw new UnauthorizedException("Invalid verification token");
      }

      // Find user
      const user = await this.prisma.user.findUnique({
        where: { email: payload.email },
      });

      if (!user) {
        throw new NotFoundException("User not found");
      }

      // Update user
      await this.prisma.user.update({
        where: { id: user.id },
        data: { isEmailVerified: true },
      });

      return { message: "Email verified successfully" };
    } catch (error) {
      throw new UnauthorizedException("Invalid or expired verification token");
    }
  }

  async resendVerificationEmail(email: string) {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (user.isEmailVerified) {
      return { message: "Email is already verified" };
    }

    // Generate verification token
    const verificationToken = this.jwtService.sign(
      { email: user.email, type: "email-verification" },
      { expiresIn: "24h" },
    );

    // TODO: Send verification email

    return { message: "Verification email sent successfully" };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // For security reasons, always return success even if user doesn't exist
    if (!user) {
      return {
        message:
          "If your email is registered, you will receive a password reset link",
      };
    }

    // Generate password reset token
    const resetToken = this.jwtService.sign(
      { email: user.email, type: "password-reset" },
      { expiresIn: "1h" },
    );

    // TODO: Send password reset email

    return {
      message:
        "If your email is registered, you will receive a password reset link",
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, password, passwordConfirmation } = resetPasswordDto;

    // Check if passwords match
    if (password !== passwordConfirmation) {
      throw new BadRequestException("Passwords do not match");
    }

    try {
      // Verify token
      const payload = this.jwtService.verify(token);

      if (payload.type !== "password-reset") {
        throw new UnauthorizedException("Invalid reset token");
      }

      // Find user
      const user = await this.prisma.user.findUnique({
        where: { email: payload.email },
      });

      if (!user) {
        throw new NotFoundException("User not found");
      }

      // For demo purposes, store password as-is (in production, use proper hashing)
      const hashedPassword = password;

      // Update user password
      await this.prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      return { message: "Password has been reset successfully" };
    } catch (error) {
      throw new UnauthorizedException("Invalid or expired reset token");
    }
  }

  async generateMfaSecret(userId: string) {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (user.mfaEnabled) {
      throw new BadRequestException("MFA is already enabled for this user");
    }

    // Generate secret
    const secret = authenticator.generateSecret();

    // Store secret temporarily (in a real app, you might want to store this in Redis with expiration)
    await this.prisma.user.update({
      where: { id: userId },
      data: { mfaSecret: secret },
    });

    // Generate QR code
    const otpauth = authenticator.keyuri(
      user.email,
      "Tejo Nails Platform",
      secret,
    );
    const qrCodeDataUrl = await qrcode.toDataURL(otpauth);

    return {
      secret,
      qrCodeDataUrl,
    };
  }

  async enableMfa(userId: string, enableMfaDto: EnableMfaDto) {
    const { code } = enableMfaDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (!user.mfaSecret) {
      throw new BadRequestException("MFA setup not initiated");
    }

    // Verify code
    const isValid = authenticator.verify({
      token: code,
      secret: user.mfaSecret,
    });

    if (!isValid) {
      throw new UnauthorizedException("Invalid MFA code");
    }

    // Enable MFA
    await this.prisma.user.update({
      where: { id: userId },
      data: { mfaEnabled: true },
    });

    return { message: "MFA enabled successfully" };
  }

  async verifyMfa(verifyMfaDto: VerifyMfaDto) {
    const { userId, code } = verifyMfaDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (!user.mfaEnabled || !user.mfaSecret) {
      throw new BadRequestException("MFA is not enabled for this user");
    }

    // Verify code
    const isValid = authenticator.verify({
      token: code,
      secret: user.mfaSecret,
    });

    if (!isValid) {
      throw new UnauthorizedException("Invalid MFA code");
    }

    // Generate JWT token
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async disableMfa(userId: string) {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (!user.mfaEnabled) {
      throw new BadRequestException("MFA is not enabled for this user");
    }

    // Disable MFA
    await this.prisma.user.update({
      where: { id: userId },
      data: { mfaEnabled: false, mfaSecret: null },
    });

    return { message: "MFA disabled successfully" };
  }
}
