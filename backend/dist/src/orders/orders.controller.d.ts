import { OrdersService } from './orders.service';
export declare class OrdersController {
    private ordersService;
    constructor(ordersService: OrdersService);
    findAll(): Promise<any[]>;
    create(orderData: any): Promise<any>;
}
