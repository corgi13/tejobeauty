import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class SanitizationService {
  /**
   * Sanitize input for logging to prevent log injection
   */
  sanitizeLogInput(input: string): string {
    if (!input || typeof input !== 'string') {
      return '[INVALID_INPUT]';
    }
    // Remove newlines, carriage returns, and other control characters
    return input.replace(/[\r\n\t\x00-\x1f\x7f-\x9f]/g, '').substring(0, 100);
  }

  /**
   * Sanitize database ID to prevent NoSQL injection
   */
  sanitizeId(id: string): string {
    if (!id || typeof id !== 'string') {
      throw new BadRequestException('Invalid ID');
    }
    
    const sanitized = id.replace(/[^a-zA-Z0-9-_]/g, '').substring(0, 50);
    if (!sanitized) {
      throw new BadRequestException('Invalid ID format');
    }
    
    return sanitized;
  }

  /**
   * Sanitize email input
   */
  sanitizeEmail(email: string): string {
    if (!email || typeof email !== 'string') {
      throw new BadRequestException('Invalid email');
    }
    
    // Basic email sanitization - remove dangerous characters
    const sanitized = email.toLowerCase().trim().replace(/[<>'"]/g, '').substring(0, 254);
    
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitized)) {
      throw new BadRequestException('Invalid email format');
    }
    
    return sanitized;
  }

  /**
   * Sanitize text input for XSS prevention
   */
  sanitizeText(text: string, maxLength: number = 1000): string {
    if (!text || typeof text !== 'string') {
      return '';
    }
    
    // Remove HTML tags and dangerous characters
    return text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/[<>'"&]/g, '') // Remove dangerous characters
      .trim()
      .substring(0, maxLength);
  }

  /**
   * Sanitize numeric input
   */
  sanitizeNumber(value: any, min?: number, max?: number): number {
    const num = Number(value);
    
    if (isNaN(num) || !isFinite(num)) {
      throw new BadRequestException('Invalid number');
    }
    
    if (min !== undefined && num < min) {
      throw new BadRequestException(`Number must be at least ${min}`);
    }
    
    if (max !== undefined && num > max) {
      throw new BadRequestException(`Number must be at most ${max}`);
    }
    
    return num;
  }

  /**
   * Sanitize file path to prevent path traversal
   */
  sanitizeFilePath(filePath: string, allowedExtensions?: string[]): string {
    if (!filePath || typeof filePath !== 'string') {
      throw new BadRequestException('Invalid file path');
    }
    
    // Remove path traversal sequences
    const sanitized = filePath
      .replace(/\.\./g, '') // Remove ..
      .replace(/[\/\\]/g, '') // Remove path separators
      .replace(/[^a-zA-Z0-9._-]/g, '') // Only allow safe characters
      .substring(0, 255);
    
    if (!sanitized) {
      throw new BadRequestException('Invalid file path format');
    }
    
    // Check file extension if provided
    if (allowedExtensions && allowedExtensions.length > 0) {
      const extension = sanitized.split('.').pop()?.toLowerCase();
      if (!extension || !allowedExtensions.includes(extension)) {
        throw new BadRequestException(`File extension not allowed. Allowed: ${allowedExtensions.join(', ')}`);
      }
    }
    
    return sanitized;
  }

  /**
   * Validate and sanitize pagination parameters
   */
  sanitizePagination(skip?: any, take?: any): { skip: number; take: number } {
    const sanitizedSkip = Math.max(0, Math.floor(Number(skip) || 0));
    const sanitizedTake = Math.min(100, Math.max(1, Math.floor(Number(take) || 10)));
    
    return { skip: sanitizedSkip, take: sanitizedTake };
  }
}