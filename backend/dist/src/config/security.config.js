"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityConfig = void 0;
exports.securityConfig = {
    password: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        maxLength: 128,
    },
    rateLimit: {
        windowMs: 15 * 60 * 1000,
        max: 100,
        skipSuccessfulRequests: false,
        skipFailedRequests: false,
    },
    auth: {
        maxLoginAttempts: 5,
        lockoutDuration: 30 * 60 * 1000,
        sessionTimeout: 24 * 60 * 60 * 1000,
        jwtExpiresIn: '24h',
        refreshTokenExpiresIn: '7d',
    },
    cors: {
        origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
        credentials: true,
        optionsSuccessStatus: 200,
    },
    csp: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
            fontSrc: ["'self'", 'https://fonts.gstatic.com'],
            imgSrc: ["'self'", 'data:', 'https:'],
            scriptSrc: ["'self'"],
            connectSrc: ["'self'"],
            frameSrc: ["'none'"],
            objectSrc: ["'none'"],
            baseUri: ["'self'"],
            formAction: ["'self'"],
        },
    },
    fileUpload: {
        maxFileSize: 5 * 1024 * 1024,
        allowedMimeTypes: [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'application/pdf',
        ],
        allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf'],
    },
    validation: {
        maxStringLength: 1000,
        maxArrayLength: 100,
        maxObjectDepth: 5,
    },
    logging: {
        logLevel: process.env.LOG_LEVEL || 'info',
        logSensitiveData: false,
        maxLogLength: 1000,
    },
};
//# sourceMappingURL=security.config.js.map