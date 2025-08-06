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
exports.AccountManagementService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let AccountManagementService = class AccountManagementService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async assignAccountManager(customerId, managerId) {
        console.log(`Assigning manager ${managerId} to customer ${customerId}`);
        return { message: 'Account manager assigned successfully' };
    }
    async getCustomerHistory(customerId) {
        const orders = await this.prisma.order.findMany({
            where: { userId: customerId },
            orderBy: { createdAt: 'desc' },
        });
        return orders;
    }
    async scheduleFollowUp(customerId, date) {
        console.log(`Scheduling follow-up for customer ${customerId} on ${date}`);
        return { message: 'Follow-up scheduled successfully' };
    }
    async generateCustomerReport(customerId) {
        const customer = await this.prisma.user.findUnique({ where: { id: customerId } });
        const orders = await this.getCustomerHistory(customerId);
        return { customer, orders };
    }
    async trackCustomerInteraction(customerId, type, notes) {
        console.log(`Tracking interaction for customer ${customerId}: ${type} - ${notes}`);
        return { message: 'Interaction tracked successfully' };
    }
};
exports.AccountManagementService = AccountManagementService;
exports.AccountManagementService = AccountManagementService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AccountManagementService);
//# sourceMappingURL=account-management.service.js.map