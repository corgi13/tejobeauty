export declare class SanitizationService {
    sanitizeLogInput(input: string): string;
    sanitizeId(id: string): string;
    sanitizeEmail(email: string): string;
    sanitizeText(text: string, maxLength?: number): string;
    sanitizeNumber(value: any, min?: number, max?: number): number;
    sanitizeFilePath(filePath: string, allowedExtensions?: string[]): string;
    sanitizePagination(skip?: any, take?: any): {
        skip: number;
        take: number;
    };
}
