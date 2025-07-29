"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CroatiaShippingService = void 0;
const common_1 = require("@nestjs/common");
let CroatiaShippingService = class CroatiaShippingService {
    constructor() {
        this.shippingZones = [
            {
                id: 'zagreb-metro',
                name: 'Zagreb i okolica',
                counties: ['Zagrebačka županija', 'Grad Zagreb'],
                cities: ['Zagreb', 'Velika Gorica', 'Zaprešić', 'Samobor', 'Dugo Selo'],
                standardCost: 25.00,
                expressCost: 45.00,
                freeShippingThreshold: 200.00,
                estimatedDays: {
                    standard: '1-2 radna dana',
                    express: 'isti dan'
                }
            },
            {
                id: 'coastal-north',
                name: 'Sjeverna obala',
                counties: ['Primorsko-goranska županija', 'Istarska županija'],
                cities: ['Rijeka', 'Pula', 'Opatija', 'Rovinj', 'Poreč', 'Krk', 'Crikvenica'],
                standardCost: 35.00,
                expressCost: 55.00,
                freeShippingThreshold: 250.00,
                estimatedDays: {
                    standard: '2-3 radna dana',
                    express: '1-2 radna dana'
                }
            },
            {
                id: 'coastal-central',
                name: 'Srednja Dalmacija',
                counties: ['Splitsko-dalmatinska županija', 'Šibensko-kninska županija'],
                cities: ['Split', 'Šibenik', 'Trogir', 'Kaštela', 'Solin', 'Omiš', 'Makarska'],
                standardCost: 40.00,
                expressCost: 60.00,
                freeShippingThreshold: 250.00,
                estimatedDays: {
                    standard: '2-4 radna dana',
                    express: '1-2 radna dana'
                }
            },
            {
                id: 'coastal-south',
                name: 'Južna Dalmacija',
                counties: ['Dubrovačko-neretvanska županija'],
                cities: ['Dubrovnik', 'Korčula', 'Ploče', 'Metković', 'Opuzen'],
                standardCost: 45.00,
                expressCost: 70.00,
                freeShippingThreshold: 300.00,
                estimatedDays: {
                    standard: '3-5 radnih dana',
                    express: '2-3 radna dana'
                }
            },
            {
                id: 'continental-north',
                name: 'Sjeverna kontinentalna Hrvatska',
                counties: ['Varaždinska županija', 'Međimurska županija', 'Krapinsko-zagorska županija'],
                cities: ['Varaždin', 'Čakovec', 'Krapina', 'Ivanec', 'Prelog'],
                standardCost: 30.00,
                expressCost: 50.00,
                freeShippingThreshold: 200.00,
                estimatedDays: {
                    standard: '2-3 radna dana',
                    express: '1-2 radna dana'
                }
            },
            {
                id: 'continental-east',
                name: 'Istočna Hrvatska',
                counties: ['Osječko-baranjska županija', 'Vukovarsko-srijemska županija', 'Brodsko-posavska županija'],
                cities: ['Osijek', 'Vukovar', 'Slavonski Brod', 'Vinkovci', 'Đakovo'],
                standardCost: 35.00,
                expressCost: 55.00,
                freeShippingThreshold: 250.00,
                estimatedDays: {
                    standard: '2-4 radna dana',
                    express: '1-3 radna dana'
                }
            },
            {
                id: 'continental-central',
                name: 'Središnja Hrvatska',
                counties: ['Karlovačka županija', 'Sisačko-moslavačka županija', 'Bjelovarsko-bilogorska županija'],
                cities: ['Karlovac', 'Sisak', 'Bjelovar', 'Ogulin', 'Petrinja'],
                standardCost: 30.00,
                expressCost: 50.00,
                freeShippingThreshold: 200.00,
                estimatedDays: {
                    standard: '2-3 radna dana',
                    express: '1-2 radna dana'
                }
            }
        ];
        this.croatianHolidays2025 = [
            { date: '2025-01-01', name: 'Nova godina', type: 'national', affectsShipping: true },
            { date: '2025-01-06', name: 'Bogojavljenje', type: 'religious', affectsShipping: true },
            { date: '2025-04-20', name: 'Uskrs', type: 'religious', affectsShipping: true },
            { date: '2025-04-21', name: 'Uskrsni ponedjeljak', type: 'religious', affectsShipping: true },
            { date: '2025-05-01', name: 'Praznik rada', type: 'national', affectsShipping: true },
            { date: '2025-06-08', name: 'Tijelovo', type: 'religious', affectsShipping: true },
            { date: '2025-06-22', name: 'Dan antifašističke borbe', type: 'national', affectsShipping: true },
            { date: '2025-06-25', name: 'Dan državnosti', type: 'national', affectsShipping: true },
            { date: '2025-08-05', name: 'Dan pobjede i domovinske zahvalnosti', type: 'national', affectsShipping: true },
            { date: '2025-08-15', name: 'Velika Gospa', type: 'religious', affectsShipping: true },
            { date: '2025-11-01', name: 'Dan svih svetih', type: 'religious', affectsShipping: true },
            { date: '2025-12-25', name: 'Božić', type: 'religious', affectsShipping: true },
            { date: '2025-12-26', name: 'Sveti Stjepan', type: 'religious', affectsShipping: true }
        ];
    }
    calculateShipping(city, orderValue, method = 'standard') {
        const zone = this.getShippingZone(city);
        if (!zone) {
            return null;
        }
        const baseCost = method === 'express' ? zone.expressCost : zone.standardCost;
        const isFree = orderValue >= zone.freeShippingThreshold;
        const cost = isFree ? 0 : baseCost;
        return {
            zone,
            method,
            cost,
            estimatedDelivery: zone.estimatedDays[method],
            isFree,
            carrier: this.getRecommendedCarrier(zone.id, method)
        };
    }
    getShippingZone(city) {
        return this.shippingZones.find(zone => zone.cities.some(zoneCity => zoneCity.toLowerCase() === city.toLowerCase())) || null;
    }
    getAllShippingZones() {
        return this.shippingZones;
    }
    getRecommendedCarrier(zoneId, method) {
        if (method === 'express') {
            return 'DPD Express';
        }
        switch (zoneId) {
            case 'zagreb-metro':
                return 'Hrvatska pošta - Zagreb';
            case 'coastal-north':
            case 'coastal-central':
            case 'coastal-south':
                return 'Overseas Express';
            default:
                return 'Hrvatska pošta';
        }
    }
    isHoliday(date) {
        return this.croatianHolidays2025.find(holiday => holiday.date === date) || null;
    }
    getCroatianHolidays() {
        return this.croatianHolidays2025;
    }
    calculateDeliveryDate(shippingDate, estimatedDays, method) {
        const days = this.parseEstimatedDays(estimatedDays, method);
        let deliveryDate = new Date(shippingDate);
        let addedDays = 0;
        while (addedDays < days) {
            deliveryDate.setDate(deliveryDate.getDate() + 1);
            if (deliveryDate.getDay() === 0 || deliveryDate.getDay() === 6) {
                continue;
            }
            const dateString = deliveryDate.toISOString().split('T')[0];
            const holiday = this.isHoliday(dateString);
            if (holiday && holiday.affectsShipping) {
                continue;
            }
            addedDays++;
        }
        return deliveryDate;
    }
    parseEstimatedDays(estimatedDays, method) {
        if (estimatedDays.includes('isti dan')) {
            return 0;
        }
        const match = estimatedDays.match(/(\d+)/);
        if (match) {
            return parseInt(match[1]);
        }
        return method === 'express' ? 1 : 3;
    }
    getShippingOptions(city, orderValue) {
        return {
            standard: this.calculateShipping(city, orderValue, 'standard'),
            express: this.calculateShipping(city, orderValue, 'express')
        };
    }
    isSameDayDeliveryAvailable(city) {
        const zone = this.getShippingZone(city);
        return zone?.id === 'zagreb-metro' && zone.estimatedDays.express === 'isti dan';
    }
    getFreeShippingThreshold(city) {
        const zone = this.getShippingZone(city);
        return zone ? zone.freeShippingThreshold : null;
    }
};
exports.CroatiaShippingService = CroatiaShippingService;
exports.CroatiaShippingService = CroatiaShippingService = __decorate([
    (0, common_1.Injectable)()
], CroatiaShippingService);
//# sourceMappingURL=croatia-shipping.service.js.map