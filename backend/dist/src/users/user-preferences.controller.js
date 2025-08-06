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
exports.UserPreferencesController = void 0;
const common_1 = require("@nestjs/common");
const user_preferences_service_1 = require("./user-preferences.service");
const user_decorator_1 = require("../auth/decorators/user.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let UserPreferencesController = class UserPreferencesController {
    constructor(userPreferencesService) {
        this.userPreferencesService = userPreferencesService;
    }
    async getUserLanguage(userId, user) {
        if (user.id !== userId) {
            return { error: "Unauthorized" };
        }
        const language = await this.userPreferencesService.getUserLanguage(userId);
        return { language };
    }
    async setUserLanguage(userId, language, user) {
        if (user.id !== userId) {
            return { error: "Unauthorized" };
        }
        const updatedUser = await this.userPreferencesService.setUserLanguage(userId, language);
        return updatedUser;
    }
    async getEmailPreferences(userId, user) {
        if (user.id !== userId) {
            return { error: "Unauthorized" };
        }
        const preferences = await this.userPreferencesService.getEmailPreferences(userId);
        return preferences;
    }
    async updateEmailPreferences(userId, preferences, user) {
        if (user.id !== userId) {
            return { error: "Unauthorized" };
        }
        const updatedUser = await this.userPreferencesService.updateEmailPreferences(userId, preferences);
        return updatedUser;
    }
};
exports.UserPreferencesController = UserPreferencesController;
__decorate([
    (0, common_1.Get)(":userId/language"),
    __param(0, (0, common_1.Param)("userId")),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserPreferencesController.prototype, "getUserLanguage", null);
__decorate([
    (0, common_1.Put)(":userId/language"),
    __param(0, (0, common_1.Param)("userId")),
    __param(1, (0, common_1.Body)("language")),
    __param(2, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserPreferencesController.prototype, "setUserLanguage", null);
__decorate([
    (0, common_1.Get)(":userId/email-preferences"),
    __param(0, (0, common_1.Param)("userId")),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserPreferencesController.prototype, "getEmailPreferences", null);
__decorate([
    (0, common_1.Put)(":userId/email-preferences"),
    __param(0, (0, common_1.Param)("userId")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], UserPreferencesController.prototype, "updateEmailPreferences", null);
exports.UserPreferencesController = UserPreferencesController = __decorate([
    (0, common_1.Controller)("api/users"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [user_preferences_service_1.UserPreferencesService])
], UserPreferencesController);
//# sourceMappingURL=user-preferences.controller.js.map