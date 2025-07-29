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
exports.SystemHealthController = void 0;
const common_1 = require("@nestjs/common");
const system_health_service_1 = require("./system-health.service");
let SystemHealthController = class SystemHealthController {
    constructor(systemHealthService) {
        this.systemHealthService = systemHealthService;
    }
    async getSystemHealth() {
        return this.systemHealthService.getSystemHealthStatus();
    }
    async getMetrics(hours = 24) {
        return this.systemHealthService.getHistoricalMetrics(hours);
    }
    async getErrors(hours = 24) {
        return this.systemHealthService.getHistoricalErrors(hours);
    }
    async getPerformance(hours = 24) {
        return this.systemHealthService.getHistoricalPerformance(hours);
    }
    async acknowledgeAlert(alertId) {
        const success = this.systemHealthService.acknowledgeAlert(alertId);
        return { success };
    }
    async clearAcknowledgedAlerts() {
        this.systemHealthService.clearAcknowledgedAlerts();
        return { success: true };
    }
};
exports.SystemHealthController = SystemHealthController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SystemHealthController.prototype, "getSystemHealth", null);
__decorate([
    (0, common_1.Get)("metrics"),
    __param(0, (0, common_1.Query)("hours")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SystemHealthController.prototype, "getMetrics", null);
__decorate([
    (0, common_1.Get)("errors"),
    __param(0, (0, common_1.Query)("hours")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SystemHealthController.prototype, "getErrors", null);
__decorate([
    (0, common_1.Get)("performance"),
    __param(0, (0, common_1.Query)("hours")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SystemHealthController.prototype, "getPerformance", null);
__decorate([
    (0, common_1.Post)("alerts/:alertId/acknowledge"),
    __param(0, (0, common_1.Param)("alertId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SystemHealthController.prototype, "acknowledgeAlert", null);
__decorate([
    (0, common_1.Post)("alerts/clear-acknowledged"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SystemHealthController.prototype, "clearAcknowledgedAlerts", null);
exports.SystemHealthController = SystemHealthController = __decorate([
    (0, common_1.Controller)("system-health"),
    __metadata("design:paramtypes", [system_health_service_1.SystemHealthService])
], SystemHealthController);
//# sourceMappingURL=system-health.controller.js.map