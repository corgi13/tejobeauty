export interface CroatianShippingZone {
    id: string;
    name: string;
    counties: string[];
    cities: string[];
    standardCost: number;
    expressCost: number;
    freeShippingThreshold: number;
    estimatedDays: {
        standard: string;
        express: string;
    };
}
export interface ShippingCalculation {
    zone: CroatianShippingZone;
    method: 'standard' | 'express';
    cost: number;
    estimatedDelivery: string;
    isFree: boolean;
    carrier: string;
}
export interface CroatianHoliday {
    date: string;
    name: string;
    type: 'national' | 'religious' | 'regional';
    affectsShipping: boolean;
}
export declare class CroatiaShippingService {
    private readonly shippingZones;
    private readonly croatianHolidays2025;
    calculateShipping(city: string, orderValue: number, method?: 'standard' | 'express'): ShippingCalculation | null;
    getShippingZone(city: string): CroatianShippingZone | null;
    getAllShippingZones(): CroatianShippingZone[];
    private getRecommendedCarrier;
    isHoliday(date: string): CroatianHoliday | null;
    getCroatianHolidays(): CroatianHoliday[];
    calculateDeliveryDate(shippingDate: Date, estimatedDays: string, method: 'standard' | 'express'): Date;
    private parseEstimatedDays;
    getShippingOptions(city: string, orderValue: number): {
        standard: ShippingCalculation | null;
        express: ShippingCalculation | null;
    };
    isSameDayDeliveryAvailable(city: string): boolean;
    getFreeShippingThreshold(city: string): number | null;
}
