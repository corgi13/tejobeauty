import { PrismaService } from '../prisma.service';
export declare class WarehouseService {
    private prisma;
    constructor(prisma: PrismaService);
    allocateInventory(orderId: string, warehouseStrategy: string): Promise<{
        message: string;
    }>;
    transferStock(fromWarehouse: string, toWarehouse: string, productId: string, quantity: number): Promise<{
        message: string;
    }>;
    performStockAdjustment(warehouseId: string, adjustments: any): Promise<{
        message: string;
    }>;
    generatePickingList(orderId: string, warehouseId: string): Promise<{
        pickingList: string;
    }>;
    calculateOptimalFulfillment(orderId: string, warehouses: any): Promise<{
        optimalWarehouse: any;
    }>;
}
