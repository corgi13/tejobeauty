"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CroatiaModule = void 0;
const common_1 = require("@nestjs/common");
const croatia_tax_service_1 = require("./croatia-tax.service");
const croatia_business_service_1 = require("./croatia-business.service");
const croatia_shipping_service_1 = require("./croatia-shipping.service");
const croatia_controller_1 = require("./croatia.controller");
const prisma_service_1 = require("../prisma.service");
let CroatiaModule = class CroatiaModule {
};
exports.CroatiaModule = CroatiaModule;
exports.CroatiaModule = CroatiaModule = __decorate([
    (0, common_1.Module)({
        controllers: [croatia_controller_1.CroatiaController],
        providers: [
            croatia_tax_service_1.CroatiaTaxService,
            croatia_business_service_1.CroatiaBusinessService,
            croatia_shipping_service_1.CroatiaShippingService,
            prisma_service_1.PrismaService,
        ],
        exports: [
            croatia_tax_service_1.CroatiaTaxService,
            croatia_business_service_1.CroatiaBusinessService,
            croatia_shipping_service_1.CroatiaShippingService,
        ],
    })
], CroatiaModule);
//# sourceMappingURL=croatia.module.js.map