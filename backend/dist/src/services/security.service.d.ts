import { PrismaService } from '../prisma.service';
import { CacheService } from '../cache/cache.service';
export declare class SecurityService {
    private prisma;
    private cacheService;
    constructor(prisma: PrismaService, cacheService: CacheService);
    generateApiKey(userId: string, permissions: any): Promise<{
        apiKey: string;
    }>;
    validateApiKey(key: string): Promise<{
        isValid: boolean;
    }>;
    trackApiUsage(userId: string, endpoint: string): Promise<void>;
    manageRateLimits(userType: string): Promise<{
        message: string;
    }>;
    detectSuspiciousActivity(userId: string, activity: any): Promise<void>;
    private sanitizeLogInput;
}
