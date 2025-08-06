import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: {
        email: string;
        password: string;
    }): Promise<{
        access_token: string;
        user: any;
    }>;
    register(registerDto: any): Promise<{
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        role: import(".prisma/client").$Enums.Role;
        isEmailVerified: boolean;
        mfaEnabled: boolean;
        mfaSecret: string | null;
        language: string;
        currency: string;
        timezone: string;
        emailMarketingConsent: boolean;
        emailOrderUpdates: boolean;
        emailProductUpdates: boolean;
        lastLoginAt: Date | null;
        isActive: boolean;
        accountManagerId: string | null;
        creditLimit: number;
        paymentTerms: number;
        createdAt: Date;
        updatedAt: Date;
        customerTierId: string | null;
    }>;
}
