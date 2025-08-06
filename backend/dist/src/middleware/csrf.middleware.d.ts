import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
export declare class CsrfMiddleware implements NestMiddleware {
    private readonly tokenSecret;
    use(req: Request, res: Response, next: NextFunction): void;
    generateToken(): string;
    private validateToken;
}
