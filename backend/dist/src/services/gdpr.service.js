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
exports.GdprService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const csv_writer_1 = require("csv-writer");
let GdprService = class GdprService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async requestDataExport(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }
        const orders = await this.prisma.order.findMany({ where: { userId } });
        const csvWriter = (0, csv_writer_1.createObjectCsvWriter)({
            path: `user-data-${userId}.csv`,
            header: [
                { id: 'email', title: 'Email' },
                { id: 'firstName', title: 'First Name' },
                { id: 'lastName', title: 'Last Name' },
            ],
        });
        await csvWriter.writeRecords([user]);
        console.log(`Exported data for user ${userId}`);
        return { message: 'Data export generated successfully' };
    }
    async deleteUserData(userId) {
        await this.prisma.user.delete({ where: { id: userId } });
        console.log(`Deleted data for user ${userId}`);
        return { message: 'User data deleted successfully' };
    }
    async manageConsents(userId, consentData) {
        console.log(`Managing consents for user ${userId}:`, consentData);
        return { message: 'Consents managed successfully' };
    }
    async auditDataAccess(userId, accessDetails) {
        console.log(`Auditing data access for user ${userId}:`, accessDetails);
    }
    async generatePrivacyReport(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        console.log('Generating privacy report for user:', user);
        return { report: 'privacy-report-content' };
    }
};
exports.GdprService = GdprService;
exports.GdprService = GdprService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GdprService);
//# sourceMappingURL=gdpr.service.js.map