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
exports.ShoppingListService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let ShoppingListService = class ShoppingListService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createShoppingList(customerId, name, items) {
        console.log(`Creating shopping list for customer ${customerId} with name ${name} and items:`, items);
        return { message: 'Shopping list created successfully' };
    }
    async shareShoppingList(listId, userIds) {
        console.log(`Sharing shopping list ${listId} with users:`, userIds);
        return { message: 'Shopping list shared successfully' };
    }
    async reorderFromHistory(customerId, orderId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true },
        });
        console.log('Reordering from history:', order);
        return { message: 'Reordered from history successfully' };
    }
    async suggestReorderItems(customerId) {
        console.log(`Suggesting reorder items for customer ${customerId}`);
        return { suggestions: [] };
    }
    async updateShoppingList(listId, updates) {
        console.log(`Updating shopping list ${listId} with updates:`, updates);
        return { message: 'Shopping list updated successfully' };
    }
};
exports.ShoppingListService = ShoppingListService;
exports.ShoppingListService = ShoppingListService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ShoppingListService);
//# sourceMappingURL=shopping-list.service.js.map