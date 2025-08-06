export interface CroatianTaxCalculation {
    subtotal: number;
    pdvRate: number;
    pdvAmount: number;
    total: number;
    taxBreakdown: {
        base: number;
        pdv: number;
    };
}
export interface CroatianTaxRates {
    standard: number;
    reduced: number;
    super_reduced: number;
}
export declare class CroatiaTaxService {
    private readonly taxRates;
    calculatePDV(subtotal: number, productCategory?: 'cosmetic' | 'tool' | 'essential'): CroatianTaxCalculation;
    calculateMultiItemPDV(items: Array<{
        price: number;
        quantity: number;
        category: 'cosmetic' | 'tool' | 'essential';
    }>): CroatianTaxCalculation;
    getTaxRates(): CroatianTaxRates;
    formatPDVForInvoice(calculation: CroatianTaxCalculation): string;
    validateOIB(oib: string): boolean;
    formatOIB(oib: string): string;
    checkTaxBenefits(businessType: 'salon' | 'spa' | 'individual' | 'retail', annualRevenue: number): {
        eligible: boolean;
        benefits: string[];
        requirements: string[];
    };
}
