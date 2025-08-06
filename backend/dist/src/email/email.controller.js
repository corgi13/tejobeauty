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
exports.EmailController = void 0;
const common_1 = require("@nestjs/common");
const email_service_1 = require("./email.service");
let EmailController = class EmailController {
    constructor(emailService) {
        this.emailService = emailService;
    }
    async testWelcomeEmail(email, name, locale = "en") {
        await this.emailService.sendWelcomeEmail(email, name, locale);
        return { success: true, message: "Welcome email sent successfully" };
    }
    async testPasswordResetEmail(email, name, token, locale = "en") {
        await this.emailService.sendPasswordResetEmail(email, name, token, locale);
        return { success: true, message: "Password reset email sent successfully" };
    }
    async testOrderConfirmationEmail(email, orderData, locale = "en") {
        await this.emailService.sendOrderConfirmationEmail(email, orderData, locale);
        return {
            success: true,
            message: "Order confirmation email sent successfully",
        };
    }
};
exports.EmailController = EmailController;
__decorate([
    (0, common_1.Post)("test/welcome"),
    __param(0, (0, common_1.Body)("email")),
    __param(1, (0, common_1.Body)("name")),
    __param(2, (0, common_1.Query)("locale")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "testWelcomeEmail", null);
__decorate([
    (0, common_1.Post)("test/password-reset"),
    __param(0, (0, common_1.Body)("email")),
    __param(1, (0, common_1.Body)("name")),
    __param(2, (0, common_1.Body)("token")),
    __param(3, (0, common_1.Query)("locale")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "testPasswordResetEmail", null);
__decorate([
    (0, common_1.Post)("test/order-confirmation"),
    __param(0, (0, common_1.Body)("email")),
    __param(1, (0, common_1.Body)("orderData")),
    __param(2, (0, common_1.Query)("locale")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "testOrderConfirmationEmail", null);
exports.EmailController = EmailController = __decorate([
    (0, common_1.Controller)("api/email"),
    __metadata("design:paramtypes", [email_service_1.EmailService])
], EmailController);
//# sourceMappingURL=email.controller.js.map