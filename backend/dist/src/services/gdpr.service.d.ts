import { PrismaService } from '../prisma.service';
export declare class GdprService {
    private prisma;
    constructor(prisma: PrismaService);
    requestDataExport(userId: string): Promise<{
        message: string;
    }>;
    deleteUserData(userId: string): Promise<{
        message: string;
    }>;
    manageConsents(userId: string, consentData: any): Promise<{
        message: string;
    }>;
    auditDataAccess(userId: string, accessDetails: any): Promise<void>;
    generatePrivacyReport(userId: string): Promise<{
        report: string;
    }>;
}
