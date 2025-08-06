import { PrismaService } from '../prisma.service';
export declare class VerificationService {
    private prisma;
    constructor(prisma: PrismaService);
    submitBusinessDocuments(customerId: string, documents: any): Promise<{
        message: string;
    }>;
    verifyTaxId(taxId: string, country: string): Promise<{
        isValid: boolean;
    }>;
    validateBusinessLicense(licenseNumber: string, state: string): Promise<{
        isValid: boolean;
    }>;
    performCreditCheck(businessInfo: any): Promise<{
        isApproved: boolean;
    }>;
    updateVerificationStatus(customerId: string, status: string, notes: string): Promise<any>;
}
