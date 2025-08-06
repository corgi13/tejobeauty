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
exports.ProfessionalController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const create_bulk_order_dto_1 = require("./dto/create-bulk-order.dto");
const create_professional_dto_1 = require("./dto/create-professional.dto");
const update_professional_dto_1 = require("./dto/update-professional.dto");
const professional_service_1 = require("./professional.service");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
let ProfessionalController = class ProfessionalController {
    constructor(professionalService) {
        this.professionalService = professionalService;
    }
    async register(req, createProfessionalDto) {
        return this.professionalService.create(req.user.id, createProfessionalDto);
    }
    async findAll(page, limit, verified) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        const isVerified = verified === "true" ? true : verified === "false" ? false : undefined;
        return this.professionalService.findAll(pageNum, limitNum, isVerified);
    }
    async getProfile(req) {
        return this.professionalService.findByUserId(req.user.id);
    }
    async getStats(req) {
        const profile = await this.professionalService.findByUserId(req.user.id);
        return this.professionalService.getStats(profile.id);
    }
    async findOne(id) {
        return this.professionalService.findOne(id);
    }
    async updateProfile(req, updateProfessionalDto) {
        const profile = await this.professionalService.findByUserId(req.user.id);
        return this.professionalService.update(profile.id, updateProfessionalDto);
    }
    async verify(id, isVerified) {
        return this.professionalService.verify(id, isVerified);
    }
    async createBulkOrder(req, createBulkOrderDto) {
        const profile = await this.professionalService.findByUserId(req.user.id);
        return this.professionalService.createBulkOrder(profile.id, createBulkOrderDto);
    }
    async getMyBulkOrders(req, page, limit) {
        const profile = await this.professionalService.findByUserId(req.user.id);
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.professionalService.findBulkOrders(profile.id, pageNum, limitNum);
    }
    async updateBulkOrderStatus(id, status) {
        return this.professionalService.updateBulkOrderStatus(id, status);
    }
    async getMyCommissions(req, page, limit) {
        const profile = await this.professionalService.findByUserId(req.user.id);
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.professionalService.findCommissions(profile.id, pageNum, limitNum);
    }
};
exports.ProfessionalController = ProfessionalController;
__decorate([
    (0, common_1.Post)("register"),
    (0, swagger_1.ApiOperation)({ summary: "Register as professional" }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: "Professional profile created",
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: "Profile already exists",
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_professional_dto_1.CreateProfessionalDto]),
    __metadata("design:returntype", Promise)
], ProfessionalController.prototype, "register", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Get all professionals (Admin only)" }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "Professionals retrieved successfully",
    }),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("limit")),
    __param(2, (0, common_1.Query)("verified")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ProfessionalController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("profile"),
    (0, swagger_1.ApiOperation)({ summary: "Get current user professional profile" }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "Profile retrieved successfully",
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: "Professional profile not found",
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfessionalController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)("stats"),
    (0, swagger_1.ApiOperation)({ summary: "Get professional statistics" }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "Statistics retrieved successfully",
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfessionalController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Get professional by ID (Admin only)" }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "Professional retrieved successfully",
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: "Professional not found",
    }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProfessionalController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)("profile"),
    (0, swagger_1.ApiOperation)({ summary: "Update professional profile" }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "Profile updated successfully",
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: "Professional profile not found",
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_professional_dto_1.UpdateProfessionalDto]),
    __metadata("design:returntype", Promise)
], ProfessionalController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Patch)(":id/verify"),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Verify professional (Admin only)" }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "Professional verified successfully",
    }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)("isVerified")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], ProfessionalController.prototype, "verify", null);
__decorate([
    (0, common_1.Post)("bulk-orders"),
    (0, swagger_1.ApiOperation)({ summary: "Create bulk order" }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: "Bulk order created successfully",
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_bulk_order_dto_1.CreateBulkOrderDto]),
    __metadata("design:returntype", Promise)
], ProfessionalController.prototype, "createBulkOrder", null);
__decorate([
    (0, common_1.Get)("bulk-orders/my"),
    (0, swagger_1.ApiOperation)({ summary: "Get my bulk orders" }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "Bulk orders retrieved successfully",
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)("page")),
    __param(2, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], ProfessionalController.prototype, "getMyBulkOrders", null);
__decorate([
    (0, common_1.Patch)("bulk-orders/:id/status"),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Update bulk order status (Admin only)" }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "Bulk order status updated",
    }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProfessionalController.prototype, "updateBulkOrderStatus", null);
__decorate([
    (0, common_1.Get)("commissions/my"),
    (0, swagger_1.ApiOperation)({ summary: "Get my commissions" }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "Commissions retrieved successfully",
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)("page")),
    __param(2, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], ProfessionalController.prototype, "getMyCommissions", null);
exports.ProfessionalController = ProfessionalController = __decorate([
    (0, swagger_1.ApiTags)("professional"),
    (0, common_1.Controller)("professional"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [professional_service_1.ProfessionalService])
], ProfessionalController);
//# sourceMappingURL=professional.controller.js.map