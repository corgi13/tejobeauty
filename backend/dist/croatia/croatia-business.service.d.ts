export interface CroatianBusinessInfo {
    oib: string;
    businessName: string;
    businessType: 'obrt' | 'doo' | 'jdoo' | 'ad' | 'individual';
    activityCode: string;
    address: {
        street: string;
        city: string;
        postalCode: string;
        county: string;
    };
    isActive: boolean;
    registrationDate: Date;
}
export interface CroatianCounty {
    code: string;
    name: string;
    cities: string[];
}
export declare class CroatiaBusinessService {
    private readonly croatianCounties;
    private readonly beautyIndustryActivityCodes;
    validateOIB(oib: string): {
        valid: boolean;
        formatted?: string;
        error?: string;
    };
    formatOIB(oib: string): string;
    getCroatianCounties(): CroatianCounty[];
    getCitiesByCounty(countyCode: string): string[];
    getBeautyIndustryActivityCodes(): {
        code: string;
        description: string;
    }[];
    validateBusinessRegistration(businessData: {
        oib: string;
        businessName: string;
        businessType: string;
        activityCode: string;
        address: any;
    }): {
        valid: boolean;
        errors: string[];
        warnings: string[];
    };
    getRegistrationRequirements(businessType: string): {
        documents: string[];
        fees: {
            name: string;
            amount: number;
            currency: string;
        }[];
        timeframe: string;
        authority: string;
    };
    getBeautyLicenseRequirements(): {
        required: boolean;
        licenses: Array<{
            name: string;
            authority: string;
            duration: string;
            requirements: string[];
        }>;
    };
}
