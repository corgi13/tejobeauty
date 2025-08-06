import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  private readonly tokenSecret = process.env.CSRF_SECRET || 'default-csrf-secret-change-in-production';

  use(req: Request, res: Response, next: NextFunction) {
    // Skip CSRF protection for GET, HEAD, OPTIONS requests
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      return next();
    }

    // Skip CSRF protection for API endpoints that use API keys
    if (req.headers['x-api-key']) {
      return next();
    }

    const token = req.headers['x-csrf-token'] as string;
    
    if (!token) {
      throw new ForbiddenException('CSRF token missing');
    }

    if (!this.validateToken(token)) {
      throw new ForbiddenException('Invalid CSRF token');
    }

    next();
  }

  generateToken(): string {
    const timestamp = Date.now().toString();
    const randomBytes = crypto.randomBytes(16).toString('hex');
    const payload = `${timestamp}:${randomBytes}`;
    const signature = crypto
      .createHmac('sha256', this.tokenSecret)
      .update(payload)
      .digest('hex');
    
    return Buffer.from(`${payload}:${signature}`).toString('base64');
  }

  private validateToken(token: string): boolean {
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf8');
      const [timestamp, randomBytes, signature] = decoded.split(':');
      
      if (!timestamp || !randomBytes || !signature) {
        return false;
      }

      // Check if token is not older than 1 hour
      const tokenTime = parseInt(timestamp);
      const currentTime = Date.now();
      const oneHour = 60 * 60 * 1000;
      
      if (currentTime - tokenTime > oneHour) {
        return false;
      }

      // Verify signature
      const payload = `${timestamp}:${randomBytes}`;
      const expectedSignature = crypto
        .createHmac('sha256', this.tokenSecret)
        .update(payload)
        .digest('hex');
      
      return crypto.timingSafeEqual(
        Buffer.from(signature, 'hex'),
        Buffer.from(expectedSignature, 'hex')
      );
    } catch (error) {
      return false;
    }
  }
}