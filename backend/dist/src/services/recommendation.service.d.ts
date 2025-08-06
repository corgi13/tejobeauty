import { PrismaService } from '../prisma.service';
export declare class RecommendationService {
    private prisma;
    constructor(prisma: PrismaService);
    getPersonalizedRecommendations(customerId: string): Promise<{
        recommendations: any[];
    }>;
    getFrequentlyBoughtTogether(productId: string): Promise<{
        recommendations: any[];
    }>;
    getSeasonalRecommendations(customerId: string, season: string): Promise<{
        recommendations: any[];
    }>;
    getCategoryTrends(categoryId: string): Promise<{
        trends: any[];
    }>;
    trackRecommendationPerformance(recommendationId: string, action: string): Promise<void>;
}
