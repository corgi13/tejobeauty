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
exports.VerificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let VerificationService = class VerificationService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async submitBusinessDocuments(customerId, documents) {
        console.log(`Received documents for customer ${customerId}:`, documents);
        return { message: 'Documents submitted successfully' };
    }
    async verifyTaxId(taxId, country) {
        console.log(`Verifying tax ID ${taxId} for country ${country}`);
        return { isValid: true };
    }
    async validateBusinessLicense(licenseNumber, state) {
        console.log(`Validating business license ${licenseNumber} in ${state}`);
        return { isValid: true };
    }
    async performCreditCheck(businessInfo) {
        console.log('Performing credit check for:', businessInfo);
        return { isApproved: true };
    }
    async updateVerificationStatus(customerId, status, notes) {
        const professional = await this.prisma.professional.update({
            where: { userId: customerId },
            data: {
                isVerified: status === 'VERIFIED',
            },
        });
        console.log(`Updated verification status for customer ${customerId} to ${status}. Notes: ${notes}`);
        return professional;
    }
};
exports.VerificationService = VerificationService;
exports.VerificationService = VerificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VerificationService);
//# sourceMappingURL=verification.service.js.map