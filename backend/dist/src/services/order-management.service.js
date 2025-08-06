"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderManagementService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const pricing_service_1 = require("./pricing.service");
let OrderManagementService = class OrderManagementService {
    constructor(prisma, pricingService) {
        this.prisma = prisma;
        this.pricingService = pricingService;
    }
    async createBulkOrder(customerId, items, orderTemplate) {
        const sanitizedCustomerId = this.sanitizeLogInput(customerId);
        console.log(`Creating bulk order for customer ${sanitizedCustomerId}`);
        return { message: 'Bulk order created successfully' };
    }
    async setupRecurringOrder(customerId, items, schedule) {
        console.log(`Setting up recurring order for customer ${customerId} with items:`, items);
        console.log('Schedule:', schedule);
        return { message: 'Recurring order set up successfully' };
    }
    async processOrderApproval(orderId, approverId) {
        const order = await this.prisma.order.update({
            where: { id: orderId },
            data: { status: 'PROCESSING' },
        });
        const sanitizedOrderId = this.sanitizeLogInput(orderId);
        const sanitizedApproverId = this.sanitizeLogInput(approverId);
        console.log(`Order ${sanitizedOrderId} approved by ${sanitizedApproverId}`);
        return order;
    }
    async generatePickingList(orderId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { items: { include: { product: true } } },
        });
        console.log('Generating picking list for order:', order);
        return { pickingList: 'picking-list-content' };
    }
    async manageOrderTemplates(customerId, template) {
        const sanitizedCustomerId = this.sanitizeLogInput(customerId);
        console.log(`Managing order templates for customer ${sanitizedCustomerId}`);
        return { message: 'Order template managed successfully' };
    }
    sanitizeLogInput(input) {
        if (!input || typeof input !== 'string') {
            return '[INVALID_INPUT]';
        }
        return input.replace(/[\r\n\t\x00-\x1f\x7f-\x9f]/g, '').substring(0, 100);
    }
};
exports.OrderManagementService = OrderManagementService;
exports.OrderManagementService = OrderManagementService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        pricing_service_1.PricingService])
], OrderManagementService);
//# sourceMappingURL=order-management.service.js.map