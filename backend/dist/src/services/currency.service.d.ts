import { HttpService } from '@nestjs/axios';
import { CacheService } from '../cache/cache.service';
export declare class CurrencyService {
    private httpService;
    private cacheService;
    constructor(httpService: HttpService, cacheService: CacheService);
    convertPrice(amount: number, fromCurrency: string, toCurrency: string): Promise<number>;
    updateExchangeRates(): Promise<{
        message: string;
    }>;
    calculateLocalTaxes(amount: number, country: string): Promise<number>;
    formatCurrencyDisplay(amount: number, currency: string, locale: string): Promise<string>;
    manageRegionalPricing(productId: string, region: string, price: number): Promise<{
        message: string;
    }>;
}
