import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<{
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
    login(user: any): Promise<{
        access_token: string;
        user: any;
    }>;
    register(userData: any): Promise<{
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
