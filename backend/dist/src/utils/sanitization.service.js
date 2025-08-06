"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SanitizationService = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
let SanitizationService = class SanitizationService {
    sanitizeLogInput(input) {
        if (!input || typeof input !== 'string') {
            return '[INVALID_INPUT]';
        }
        return input.replace(/[\r\n\t\x00-\x1f\x7f-\x9f]/g, '').substring(0, 100);
    }
    sanitizeId(id) {
        if (!id || typeof id !== 'string') {
            throw new common_2.BadRequestException('Invalid ID');
        }
        const sanitized = id.replace(/[^a-zA-Z0-9-_]/g, '').substring(0, 50);
        if (!sanitized) {
            throw new common_2.BadRequestException('Invalid ID format');
        }
        return sanitized;
    }
    sanitizeEmail(email) {
        if (!email || typeof email !== 'string') {
            throw new common_2.BadRequestException('Invalid email');
        }
        const sanitized = email.toLowerCase().trim().replace(/[<>'"]/g, '').substring(0, 254);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(sanitized)) {
            throw new common_2.BadRequestException('Invalid email format');
        }
        return sanitized;
    }
    sanitizeText(text, maxLength = 1000) {
        if (!text || typeof text !== 'string') {
            return '';
        }
        return text
            .replace(/<[^>]*>/g, '')
            .replace(/[<>'"&]/g, '')
            .trim()
            .substring(0, maxLength);
    }
    sanitizeNumber(value, min, max) {
        const num = Number(value);
        if (isNaN(num) || !isFinite(num)) {
            throw new common_2.BadRequestException('Invalid number');
        }
        if (min !== undefined && num < min) {
            throw new common_2.BadRequestException(`Number must be at least ${min}`);
        }
        if (max !== undefined && num > max) {
            throw new common_2.BadRequestException(`Number must be at most ${max}`);
        }
        return num;
    }
    sanitizeFilePath(filePath, allowedExtensions) {
        if (!filePath || typeof filePath !== 'string') {
            throw new common_2.BadRequestException('Invalid file path');
        }
        const sanitized = filePath
            .replace(/\.\./g, '')
            .replace(/[\/\\]/g, '')
            .replace(/[^a-zA-Z0-9._-]/g, '')
            .substring(0, 255);
        if (!sanitized) {
            throw new common_2.BadRequestException('Invalid file path format');
        }
        if (allowedExtensions && allowedExtensions.length > 0) {
            const extension = sanitized.split('.').pop()?.toLowerCase();
            if (!extension || !allowedExtensions.includes(extension)) {
                throw new common_2.BadRequestException(`File extension not allowed. Allowed: ${allowedExtensions.join(', ')}`);
            }
        }
        return sanitized;
    }
    sanitizePagination(skip, take) {
        const sanitizedSkip = Math.max(0, Math.floor(Number(skip) || 0));
        const sanitizedTake = Math.min(100, Math.max(1, Math.floor(Number(take) || 10)));
        return { skip: sanitizedSkip, take: sanitizedTake };
    }
};
exports.SanitizationService = SanitizationService;
exports.SanitizationService = SanitizationService = __decorate([
    (0, common_1.Injectable)()
], SanitizationService);
//# sourceMappingURL=sanitization.service.js.map