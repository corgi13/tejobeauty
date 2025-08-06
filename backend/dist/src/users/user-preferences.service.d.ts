import { PrismaService } from "../prisma.service";
export declare class UserPreferencesService {
    private prisma;
    constructor(prisma: PrismaService);
    getUserLanguage(userId: string): Promise<string>;
    setUserLanguage(userId: string, language: string): Promise<any>;
    getEmailPreferences(userId: string): Promise<any>;
    updateEmailPreferences(userId: string, preferences: any): Promise<any>;
}
