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
exports.MonitoringService = void 0;
const common_1 = require("@nestjs/common");
let MonitoringService = class MonitoringService {
    constructor() { }
    async trackApiResponse(endpoint, responseTime) {
        console.log(`API response time for ${endpoint}: ${responseTime}ms`);
    }
    async monitorDatabaseQuery(query, executionTime) {
        console.log(`Database query execution time for ${query}: ${executionTime}ms`);
    }
    async recordUserActivity(userId, activity) {
        console.log(`User activity for user ${userId}: ${activity}`);
    }
    async logError(error, context) {
        console.error('Error:', error, 'Context:', context);
    }
    async generateHealthReport() {
        return { status: 'ok' };
    }
};
exports.MonitoringService = MonitoringService;
exports.MonitoringService = MonitoringService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MonitoringService);
//# sourceMappingURL=monitoring.service.js.map