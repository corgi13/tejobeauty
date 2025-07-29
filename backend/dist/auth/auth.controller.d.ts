import { AuthService } from "./auth.service";
import { EnableMfaDto } from "./dto/enable-mfa.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { VerifyEmailDto } from "./dto/verify-email.dto";
import { VerifyMfaDto } from "./dto/verify-mfa.dto";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        userId: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
    verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<{
        message: string;
    }>;
    resendVerification(email: string): Promise<{
        message: string;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    generateMfaSecret(userId: string): Promise<{
        secret: string;
        qrCodeDataUrl: string;
    }>;
    enableMfa(userId: string, enableMfaDto: EnableMfaDto): Promise<{
        message: string;
    }>;
    verifyMfa(verifyMfaDto: VerifyMfaDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
    disableMfa(userId: string): Promise<{
        message: string;
    }>;
    getAllUsers(): Promise<{
        message: string;
    }>;
}
