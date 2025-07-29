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
exports.UserPreferencesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let UserPreferencesService = class UserPreferencesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUserLanguage(userId) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                select: { language: true },
            });
            return user?.language || "en";
        }
        catch (error) {
            console.error(`Error getting user language: ${error.message}`);
            return "en";
        }
    }
    async setUserLanguage(userId, language) {
        try {
            return await this.prisma.user.update({
                where: { id: userId },
                data: { language },
                select: { id: true, email: true, language: true },
            });
        }
        catch (error) {
            console.error(`Error setting user language: ${error.message}`);
            throw error;
        }
    }
    async getEmailPreferences(userId) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                select: {
                    emailMarketingConsent: true,
                    emailOrderUpdates: true,
                    emailProductUpdates: true,
                },
            });
            return (user || {
                emailMarketingConsent: false,
                emailOrderUpdates: true,
                emailProductUpdates: false,
            });
        }
        catch (error) {
            console.error(`Error getting email preferences: ${error.message}`);
            throw error;
        }
    }
    async updateEmailPreferences(userId, preferences) {
        try {
            return await this.prisma.user.update({
                where: { id: userId },
                data: {
                    emailMarketingConsent: preferences.emailMarketingConsent,
                    emailOrderUpdates: preferences.emailOrderUpdates,
                    emailProductUpdates: preferences.emailProductUpdates,
                },
                select: {
                    id: true,
                    email: true,
                    emailMarketingConsent: true,
                    emailOrderUpdates: true,
                    emailProductUpdates: true,
                },
            });
        }
        catch (error) {
            console.error(`Error updating email preferences: ${error.message}`);
            throw error;
        }
    }
};
exports.UserPreferencesService = UserPreferencesService;
exports.UserPreferencesService = UserPreferencesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserPreferencesService);
//# sourceMappingURL=user-preferences.service.js.map