import { CroatiaTaxService } from './croatia-tax.service';
import { CroatiaBusinessService } from './croatia-business.service';
import { CroatiaShippingService } from './croatia-shipping.service';
export declare class CroatiaController {
    private readonly taxService;
    private readonly businessService;
    private readonly shippingService;
    constructor(taxService: CroatiaTaxService, businessService: CroatiaBusinessService, shippingService: CroatiaShippingService);
    getTaxRates(): {
        success: boolean;
        data: import("./croatia-tax.service").CroatianTaxRates;
        description: string;
    };
    calculateTax(body: {
        subtotal: number;
        category?: 'cosmetic' | 'tool' | 'essential';
    }): {
        success: boolean;
        data: import("./croatia-tax.service").CroatianTaxCalculation;
        formatted: string;
    };
    calculateMultiItemTax(body: {
        items: Array<{
            price: number;
            quantity: number;
            category: 'cosmetic' | 'tool' | 'essential';
        }>;
    }): {
        success: boolean;
        data: import("./croatia-tax.service").CroatianTaxCalculation;
        formatted: string;
    };
    validateOIB(oib: string): {
        success: boolean;
        data: {
            valid: boolean;
            formatted?: string;
            error?: string;
        };
    };
    getCroatianCounties(): {
        success: boolean;
        data: import("./croatia-business.service").CroatianCounty[];
    };
    getCitiesByCounty(code: string): {
        success: boolean;
        data: string[];
    };
    getBeautyActivityCodes(): {
        success: boolean;
        data: {
            code: string;
            description: string;
        }[];
    };
    validateBusinessRegistration(businessData: {
        oib: string;
        businessName: string;
        businessType: string;
        activityCode: string;
        address: any;
    }): {
        success: boolean;
        data: {
            valid: boolean;
            errors: string[];
            warnings: string[];
        };
    };
    getRegistrationRequirements(type: string): {
        success: boolean;
        data: {
            documents: string[];
            fees: {
                name: string;
                amount: number;
                currency: string;
            }[];
            timeframe: string;
            authority: string;
        };
    };
    getBeautyLicenseRequirements(): {
        success: boolean;
        data: {
            required: boolean;
            licenses: Array<{
                name: string;
                authority: string;
                duration: string;
                requirements: string[];
            }>;
        };
    };
    getShippingZones(): {
        success: boolean;
        data: import("./croatia-shipping.service").CroatianShippingZone[];
    };
    calculateShipping(city: string, orderValue: string, method?: 'standard' | 'express'): {
        success: boolean;
        error: string;
        data?: undefined;
    } | {
        success: boolean;
        data: import("./croatia-shipping.service").ShippingCalculation;
        error?: undefined;
    };
    getShippingOptions(city: string, orderValue: string): {
        success: boolean;
        data: {
            standard: import("./croatia-shipping.service").ShippingCalculation | null;
            express: import("./croatia-shipping.service").ShippingCalculation | null;
        };
        sameDayAvailable: boolean;
        freeShippingThreshold: number;
    };
    getCroatianHolidays(): {
        success: boolean;
        data: import("./croatia-shipping.service").CroatianHoliday[];
    };
    checkHoliday(date: string): {
        success: boolean;
        data: {
            isHoliday: boolean;
            holiday: import("./croatia-shipping.service").CroatianHoliday;
        };
    };
    checkTaxBenefits(businessType: 'salon' | 'spa' | 'individual' | 'retail', annualRevenue: string): {
        success: boolean;
        data: {
            eligible: boolean;
            benefits: string[];
            requirements: string[];
        };
    };
}
