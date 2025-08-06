import { PrismaService } from '../prisma.service';
import { HttpService } from '@nestjs/axios';
export declare class ImportExportService {
    private prisma;
    private httpService;
    constructor(prisma: PrismaService, httpService: HttpService);
    calculateImportDuties(products: any, country: string): Promise<{
        duties: number;
    }>;
    generateCommercialInvoice(orderId: string): Promise<{
        invoice: string;
    }>;
    trackShipmentStatus(trackingNumber: string): Promise<{
        status: string;
    }>;
    validateProductCompliance(productId: string, country: string): Promise<{
        isCompliant: boolean;
    }>;
    manageHsCodes(productId: string, hsCode: string, description: string): Promise<{
        message: string;
    }>;
}
