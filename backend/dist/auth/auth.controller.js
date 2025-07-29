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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const roles_decorator_1 = require("./decorators/roles.decorator");
const enable_mfa_dto_1 = require("./dto/enable-mfa.dto");
const forgot_password_dto_1 = require("./dto/forgot-password.dto");
const login_dto_1 = require("./dto/login.dto");
const register_dto_1 = require("./dto/register.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const verify_email_dto_1 = require("./dto/verify-email.dto");
const verify_mfa_dto_1 = require("./dto/verify-mfa.dto");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const roles_guard_1 = require("./guards/roles.guard");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(registerDto) {
        return this.authService.register(registerDto);
    }
    async login(loginDto) {
        return this.authService.login(loginDto);
    }
    async verifyEmail(verifyEmailDto) {
        return this.authService.verifyEmail(verifyEmailDto);
    }
    async resendVerification(email) {
        return this.authService.resendVerificationEmail(email);
    }
    async forgotPassword(forgotPasswordDto) {
        return this.authService.forgotPassword(forgotPasswordDto);
    }
    async resetPassword(resetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto);
    }
    async generateMfaSecret(userId) {
        return this.authService.generateMfaSecret(userId);
    }
    async enableMfa(userId, enableMfaDto) {
        return this.authService.enableMfa(userId, enableMfaDto);
    }
    async verifyMfa(verifyMfaDto) {
        return this.authService.verifyMfa(verifyMfaDto);
    }
    async disableMfa(userId) {
        return this.authService.disableMfa(userId);
    }
    async getAllUsers() {
        return { message: "This endpoint would return all users (admin only)" };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)("register"),
    (0, swagger_1.ApiOperation)({ summary: "User registration" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "User registered successfully" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Bad request" }),
    (0, swagger_1.ApiResponse)({ status: 409, description: "User already exists" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)("login"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "User login" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Login successful" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)("verify-email"),
    (0, swagger_1.ApiOperation)({ summary: "Verify email address" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Email verified successfully" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Invalid verification token" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_email_dto_1.VerifyEmailDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.Get)("resend-verification/:email"),
    (0, swagger_1.ApiOperation)({ summary: "Resend verification email" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Verification email sent successfully",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "User not found" }),
    __param(0, (0, common_1.Param)("email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resendVerification", null);
__decorate([
    (0, common_1.Post)("forgot-password"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "Request password reset" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Password reset email sent" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)("reset-password"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "Reset password with token" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Password reset successful" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Bad request" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Invalid or expired token" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Get)("mfa/generate/:userId"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Generate MFA secret and QR code" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "MFA secret generated successfully",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "User not found" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "MFA already enabled" }),
    __param(0, (0, common_1.Param)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "generateMfaSecret", null);
__decorate([
    (0, common_1.Post)("mfa/enable/:userId"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Enable MFA for user" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "MFA enabled successfully" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "User not found" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "MFA setup not initiated" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Invalid MFA code" }),
    __param(0, (0, common_1.Param)("userId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, enable_mfa_dto_1.EnableMfaDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "enableMfa", null);
__decorate([
    (0, common_1.Post)("mfa/verify"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "Verify MFA code and complete login" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "MFA verification successful" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "User not found" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "MFA not enabled" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Invalid MFA code" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_mfa_dto_1.VerifyMfaDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyMfa", null);
__decorate([
    (0, common_1.Post)("mfa/disable/:userId"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN", "MANAGER"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Disable MFA for user (admin only)" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "MFA disabled successfully" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "User not found" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "MFA not enabled" }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: "Forbidden - insufficient permissions",
    }),
    __param(0, (0, common_1.Param)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "disableMfa", null);
__decorate([
    (0, common_1.Get)("users"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Get all users (admin only)" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "List of users" }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: "Forbidden - insufficient permissions",
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getAllUsers", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)("auth"),
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map