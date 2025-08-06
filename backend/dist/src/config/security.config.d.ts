export declare const securityConfig: {
    password: {
        minLength: number;
        requireUppercase: boolean;
        requireLowercase: boolean;
        requireNumbers: boolean;
        requireSpecialChars: boolean;
        maxLength: number;
    };
    rateLimit: {
        windowMs: number;
        max: number;
        skipSuccessfulRequests: boolean;
        skipFailedRequests: boolean;
    };
    auth: {
        maxLoginAttempts: number;
        lockoutDuration: number;
        sessionTimeout: number;
        jwtExpiresIn: string;
        refreshTokenExpiresIn: string;
    };
    cors: {
        origin: string[];
        credentials: boolean;
        optionsSuccessStatus: number;
    };
    csp: {
        directives: {
            defaultSrc: string[];
            styleSrc: string[];
            fontSrc: string[];
            imgSrc: string[];
            scriptSrc: string[];
            connectSrc: string[];
            frameSrc: string[];
            objectSrc: string[];
            baseUri: string[];
            formAction: string[];
        };
    };
    fileUpload: {
        maxFileSize: number;
        allowedMimeTypes: string[];
        allowedExtensions: string[];
    };
    validation: {
        maxStringLength: number;
        maxArrayLength: number;
        maxObjectDepth: number;
    };
    logging: {
        logLevel: string;
        logSensitiveData: boolean;
        maxLogLength: number;
    };
};
