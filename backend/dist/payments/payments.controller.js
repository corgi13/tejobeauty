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
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_payment_intent_dto_1 = require("./dto/create-payment-intent.dto");
const payments_service_1 = require("./payments.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let PaymentsController = class PaymentsController {
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    async createPaymentIntent(createPaymentIntentDto) {
        return this.paymentsService.createPaymentIntent(createPaymentIntentDto);
    }
    async confirmPayment(paymentIntentId) {
        return this.paymentsService.confirmPayment(paymentIntentId);
    }
    async createRefund(paymentIntentId, amount) {
        return this.paymentsService.createRefund(paymentIntentId, amount);
    }
    async handleWebhook(signature, payload) {
        return this.paymentsService.handleWebhook(signature, payload);
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Post)("create-payment-intent"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Create a payment intent" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "Payment intent created successfully",
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Bad request" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payment_intent_dto_1.CreatePaymentIntentDto]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "createPaymentIntent", null);
__decorate([
    (0, common_1.Post)("confirm/:paymentIntentId"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Confirm a payment" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Payment confirmed successfully" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Bad request" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    __param(0, (0, common_1.Param)("paymentIntentId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "confirmPayment", null);
__decorate([
    (0, common_1.Post)("refund/:paymentIntentId"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Create a refund" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Refund created successfully" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Bad request" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    __param(0, (0, common_1.Param)("paymentIntentId")),
    __param(1, (0, common_1.Body)("amount")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "createRefund", null);
__decorate([
    (0, common_1.Post)("webhook"),
    (0, swagger_1.ApiOperation)({ summary: "Handle Stripe webhooks" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Webhook processed successfully" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Webhook verification failed" }),
    __param(0, (0, common_1.Headers)("stripe-signature")),
    __param(1, (0, common_1.RawBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Buffer]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "handleWebhook", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, swagger_1.ApiTags)("payments"),
    (0, common_1.Controller)("payments"),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map