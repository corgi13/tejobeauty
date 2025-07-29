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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const analytics_service_1 = require("./analytics.service");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
let AnalyticsController = class AnalyticsController {
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    async getDashboardStats() {
        return this.analyticsService.getDashboardStats();
    }
    async getSalesData(period) {
        return this.analyticsService.getSalesData(period);
    }
    async getTopProducts(limit) {
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.analyticsService.getTopProducts(limitNum);
    }
    async getTopCategories(limit) {
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.analyticsService.getTopCategories(limitNum);
    }
    async getUserGrowth(period) {
        return this.analyticsService.getUserGrowth(period);
    }
    async getOrderStatusDistribution() {
        return this.analyticsService.getOrderStatusDistribution();
    }
    async getRevenueByMonth(year) {
        const yearNum = year ? parseInt(year, 10) : undefined;
        return this.analyticsService.getRevenueByMonth(yearNum);
    }
    async getProfessionalStats() {
        return this.analyticsService.getProfessionalStats();
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)("dashboard"),
    (0, swagger_1.ApiOperation)({ summary: "Get dashboard statistics" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Dashboard stats retrieved successfully",
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getDashboardStats", null);
__decorate([
    (0, common_1.Get)("sales"),
    (0, swagger_1.ApiOperation)({ summary: "Get sales data" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Sales data retrieved successfully",
    }),
    __param(0, (0, common_1.Query)("period")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getSalesData", null);
__decorate([
    (0, common_1.Get)("products/top"),
    (0, swagger_1.ApiOperation)({ summary: "Get top selling products" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Top products retrieved successfully",
    }),
    __param(0, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getTopProducts", null);
__decorate([
    (0, common_1.Get)("categories/top"),
    (0, swagger_1.ApiOperation)({ summary: "Get top selling categories" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Top categories retrieved successfully",
    }),
    __param(0, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getTopCategories", null);
__decorate([
    (0, common_1.Get)("users/growth"),
    (0, swagger_1.ApiOperation)({ summary: "Get user growth data" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "User growth data retrieved successfully",
    }),
    __param(0, (0, common_1.Query)("period")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getUserGrowth", null);
__decorate([
    (0, common_1.Get)("orders/status"),
    (0, swagger_1.ApiOperation)({ summary: "Get order status distribution" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Order status distribution retrieved successfully",
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getOrderStatusDistribution", null);
__decorate([
    (0, common_1.Get)("revenue/monthly"),
    (0, swagger_1.ApiOperation)({ summary: "Get monthly revenue data" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Monthly revenue data retrieved successfully",
    }),
    __param(0, (0, common_1.Query)("year")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getRevenueByMonth", null);
__decorate([
    (0, common_1.Get)("professional"),
    (0, swagger_1.ApiOperation)({ summary: "Get professional statistics" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Professional stats retrieved successfully",
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getProfessionalStats", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, swagger_1.ApiTags)("analytics"),
    (0, common_1.Controller)("analytics"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.MANAGER),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map