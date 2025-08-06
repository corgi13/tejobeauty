import { PrismaService } from '../prisma.service';
export declare class ShoppingListService {
    private prisma;
    constructor(prisma: PrismaService);
    createShoppingList(customerId: string, name: string, items: any): Promise<{
        message: string;
    }>;
    shareShoppingList(listId: string, userIds: string[]): Promise<{
        message: string;
    }>;
    reorderFromHistory(customerId: string, orderId: string): Promise<{
        message: string;
    }>;
    suggestReorderItems(customerId: string): Promise<{
        suggestions: any[];
    }>;
    updateShoppingList(listId: string, updates: any): Promise<{
        message: string;
    }>;
}
