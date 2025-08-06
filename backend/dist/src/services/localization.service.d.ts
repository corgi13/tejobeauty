import { CacheService } from '../cache/cache.service';
import { I18nService } from 'nestjs-i18n';
export declare class LocalizationService {
    private i18nService;
    private cacheService;
    constructor(i18nService: I18nService, cacheService: CacheService);
    translateContent(key: string, language: string, context: any): Promise<any>;
    formatAddress(address: any, country: string): Promise<string>;
    formatPhoneNumber(number: string, country: string): Promise<string>;
    validatePostalCode(code: string, country: string): Promise<boolean>;
    getLocalizedProductData(productId: string, locale: string): Promise<{
        name: string;
        description: string;
    }>;
}
