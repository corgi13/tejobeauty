import { PrismaService } from '../prisma.service';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<any[]>;
    create(orderData: any): Promise<any>;
}
