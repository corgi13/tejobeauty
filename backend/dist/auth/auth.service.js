"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const otplib_1 = require("otplib");
const qrcode = require("qrcode");
const prisma_service_1 = require("../prisma.service");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const { email, password, firstName, lastName } = registerDto;
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.ConflictException("User with this email already exists");
        }
        const hashedPassword = password;
        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
            },
        });
        const verificationToken = this.jwtService.sign({ email: user.email, type: "email-verification" }, { expiresIn: "24h" });
        return {
            message: "User registered successfully. Please check your email for verification.",
            userId: user.id,
        };
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException("Invalid credentials");
        }
        if (!user.isEmailVerified) {
            throw new common_1.UnauthorizedException("Please verify your email before logging in");
        }
        const isPasswordValid = password === user.password;
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException("Invalid credentials");
        }
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
    async verifyEmail(verifyEmailDto) {
        const { token } = verifyEmailDto;
        try {
            const payload = this.jwtService.verify(token);
            if (payload.type !== "email-verification") {
                throw new common_1.UnauthorizedException("Invalid verification token");
            }
            const user = await this.prisma.user.findUnique({
                where: { email: payload.email },
            });
            if (!user) {
                throw new common_1.NotFoundException("User not found");
            }
            await this.prisma.user.update({
                where: { id: user.id },
                data: { isEmailVerified: true },
            });
            return { message: "Email verified successfully" };
        }
        catch (error) {
            throw new common_1.UnauthorizedException("Invalid or expired verification token");
        }
    }
    async resendVerificationEmail(email) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        if (user.isEmailVerified) {
            return { message: "Email is already verified" };
        }
        const verificationToken = this.jwtService.sign({ email: user.email, type: "email-verification" }, { expiresIn: "24h" });
        return { message: "Verification email sent successfully" };
    }
    async forgotPassword(forgotPasswordDto) {
        const { email } = forgotPasswordDto;
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return {
                message: "If your email is registered, you will receive a password reset link",
            };
        }
        const resetToken = this.jwtService.sign({ email: user.email, type: "password-reset" }, { expiresIn: "1h" });
        return {
            message: "If your email is registered, you will receive a password reset link",
        };
    }
    async resetPassword(resetPasswordDto) {
        const { token, password, passwordConfirmation } = resetPasswordDto;
        if (password !== passwordConfirmation) {
            throw new common_1.BadRequestException("Passwords do not match");
        }
        try {
            const payload = this.jwtService.verify(token);
            if (payload.type !== "password-reset") {
                throw new common_1.UnauthorizedException("Invalid reset token");
            }
            const user = await this.prisma.user.findUnique({
                where: { email: payload.email },
            });
            if (!user) {
                throw new common_1.NotFoundException("User not found");
            }
            const hashedPassword = password;
            await this.prisma.user.update({
                where: { id: user.id },
                data: { password: hashedPassword },
            });
            return { message: "Password has been reset successfully" };
        }
        catch (error) {
            throw new common_1.UnauthorizedException("Invalid or expired reset token");
        }
    }
    async generateMfaSecret(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        if (user.mfaEnabled) {
            throw new common_1.BadRequestException("MFA is already enabled for this user");
        }
        const secret = otplib_1.authenticator.generateSecret();
        await this.prisma.user.update({
            where: { id: userId },
            data: { mfaSecret: secret },
        });
        const otpauth = otplib_1.authenticator.keyuri(user.email, "Tejo Nails Platform", secret);
        const qrCodeDataUrl = await qrcode.toDataURL(otpauth);
        return {
            secret,
            qrCodeDataUrl,
        };
    }
    async enableMfa(userId, enableMfaDto) {
        const { code } = enableMfaDto;
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        if (!user.mfaSecret) {
            throw new common_1.BadRequestException("MFA setup not initiated");
        }
        const isValid = otplib_1.authenticator.verify({
            token: code,
            secret: user.mfaSecret,
        });
        if (!isValid) {
            throw new common_1.UnauthorizedException("Invalid MFA code");
        }
        await this.prisma.user.update({
            where: { id: userId },
            data: { mfaEnabled: true },
        });
        return { message: "MFA enabled successfully" };
    }
    async verifyMfa(verifyMfaDto) {
        const { userId, code } = verifyMfaDto;
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        if (!user.mfaEnabled || !user.mfaSecret) {
            throw new common_1.BadRequestException("MFA is not enabled for this user");
        }
        const isValid = otplib_1.authenticator.verify({
            token: code,
            secret: user.mfaSecret,
        });
        if (!isValid) {
            throw new common_1.UnauthorizedException("Invalid MFA code");
        }
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
    async disableMfa(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        if (!user.mfaEnabled) {
            throw new common_1.BadRequestException("MFA is not enabled for this user");
        }
        await this.prisma.user.update({
            where: { id: userId },
            data: { mfaEnabled: false, mfaSecret: null },
        });
        return { message: "MFA disabled successfully" };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map