"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CroatiaTaxService = void 0;
const common_1 = require("@nestjs/common");
let CroatiaTaxService = class CroatiaTaxService {
    constructor() {
        this.taxRates = {
            standard: 0.25,
            reduced: 0.13,
            super_reduced: 0.05,
        };
    }
    calculatePDV(subtotal, productCategory = 'cosmetic') {
        let pdvRate;
        switch (productCategory) {
            case 'essential':
                pdvRate = this.taxRates.super_reduced;
                break;
            case 'tool':
                pdvRate = this.taxRates.reduced;
                break;
            case 'cosmetic':
            default:
                pdvRate = this.taxRates.standard;
                break;
        }
        const pdvAmount = subtotal * pdvRate;
        const total = subtotal + pdvAmount;
        return {
            subtotal,
            pdvRate,
            pdvAmount: Math.round(pdvAmount * 100) / 100,
            total: Math.round(total * 100) / 100,
            taxBreakdown: {
                base: subtotal,
                pdv: Math.round(pdvAmount * 100) / 100,
            },
        };
    }
    calculateMultiItemPDV(items) {
        let totalSubtotal = 0;
        let totalPDV = 0;
        items.forEach(item => {
            const itemSubtotal = item.price * item.quantity;
            const itemTax = this.calculatePDV(itemSubtotal, item.category);
            totalSubtotal += itemSubtotal;
            totalPDV += itemTax.pdvAmount;
        });
        return {
            subtotal: Math.round(totalSubtotal * 100) / 100,
            pdvRate: totalPDV / totalSubtotal,
            pdvAmount: Math.round(totalPDV * 100) / 100,
            total: Math.round((totalSubtotal + totalPDV) * 100) / 100,
            taxBreakdown: {
                base: Math.round(totalSubtotal * 100) / 100,
                pdv: Math.round(totalPDV * 100) / 100,
            },
        };
    }
    getTaxRates() {
        return this.taxRates;
    }
    formatPDVForInvoice(calculation) {
        return `
Osnovica: ${calculation.subtotal.toFixed(2)} EUR
PDV (${(calculation.pdvRate * 100).toFixed(0)}%): ${calculation.pdvAmount.toFixed(2)} EUR
Ukupno: ${calculation.total.toFixed(2)} EUR
    `.trim();
    }
    validateOIB(oib) {
        const cleanOIB = oib.replace(/[\s-]/g, '');
        if (!/^\d{11}$/.test(cleanOIB)) {
            return false;
        }
        let sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cleanOIB[i]) * (10 - i);
        }
        const remainder = sum % 11;
        const controlDigit = remainder < 2 ? remainder : 11 - remainder;
        return controlDigit === parseInt(cleanOIB[10]);
    }
    formatOIB(oib) {
        const cleanOIB = oib.replace(/[\s-]/g, '');
        if (cleanOIB.length === 11) {
            return `${cleanOIB.slice(0, 2)}-${cleanOIB.slice(2, 5)}-${cleanOIB.slice(5, 8)}-${cleanOIB.slice(8)}`;
        }
        return oib;
    }
    checkTaxBenefits(businessType, annualRevenue) {
        const benefits = [];
        const requirements = [];
        let eligible = false;
        if (annualRevenue <= 300000) {
            eligible = true;
            benefits.push('Paušalni obrt - simplified tax calculation');
            benefits.push('Reduced administrative burden');
            requirements.push('Annual revenue must not exceed 300,000 EUR');
            requirements.push('Must maintain proper business records');
        }
        if (businessType === 'salon' || businessType === 'spa') {
            benefits.push('Professional equipment tax deduction');
            benefits.push('Training and certification expense deduction');
            requirements.push('Must have valid beauty industry license');
            requirements.push('Must comply with health and safety regulations');
        }
        return {
            eligible,
            benefits,
            requirements,
        };
    }
};
exports.CroatiaTaxService = CroatiaTaxService;
exports.CroatiaTaxService = CroatiaTaxService = __decorate([
    (0, common_1.Injectable)()
], CroatiaTaxService);
//# sourceMappingURL=croatia-tax.service.js.map