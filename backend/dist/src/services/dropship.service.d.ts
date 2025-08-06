import { PrismaService } from '../prisma.service';
import { HttpService } from '@nestjs/axios';
export declare class DropshipService {
    private prisma;
    private httpService;
    constructor(prisma: PrismaService, httpService: HttpService);
    routeOrderToSupplier(orderId: string, items: any): Promise<{
        message: string;
    }>;
    trackSupplierFulfillment(orderId: string): Promise<{
        status: string;
    }>;
    handleSupplierInventory(supplierId: string): Promise<{
        message: string;
    }>;
    reconcileDropshipOrders(): Promise<{
        message: string;
    }>;
    generateSupplierReport(supplierId: string, dateRange: any): Promise<{
        report: string;
    }>;
}
