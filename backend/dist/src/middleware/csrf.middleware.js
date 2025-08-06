"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsrfMiddleware = void 0;
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
let CsrfMiddleware = class CsrfMiddleware {
    constructor() {
        this.tokenSecret = process.env.CSRF_SECRET || 'default-csrf-secret-change-in-production';
    }
    use(req, res, next) {
        if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
            return next();
        }
        if (req.headers['x-api-key']) {
            return next();
        }
        const token = req.headers['x-csrf-token'];
        if (!token) {
            throw new common_1.ForbiddenException('CSRF token missing');
        }
        if (!this.validateToken(token)) {
            throw new common_1.ForbiddenException('Invalid CSRF token');
        }
        next();
    }
    generateToken() {
        const timestamp = Date.now().toString();
        const randomBytes = crypto.randomBytes(16).toString('hex');
        const payload = `${timestamp}:${randomBytes}`;
        const signature = crypto
            .createHmac('sha256', this.tokenSecret)
            .update(payload)
            .digest('hex');
        return Buffer.from(`${payload}:${signature}`).toString('base64');
    }
    validateToken(token) {
        try {
            const decoded = Buffer.from(token, 'base64').toString('utf8');
            const [timestamp, randomBytes, signature] = decoded.split(':');
            if (!timestamp || !randomBytes || !signature) {
                return false;
            }
            const tokenTime = parseInt(timestamp);
            const currentTime = Date.now();
            const oneHour = 60 * 60 * 1000;
            if (currentTime - tokenTime > oneHour) {
                return false;
            }
            const payload = `${timestamp}:${randomBytes}`;
            const expectedSignature = crypto
                .createHmac('sha256', this.tokenSecret)
                .update(payload)
                .digest('hex');
            return crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expectedSignature, 'hex'));
        }
        catch (error) {
            return false;
        }
    }
};
exports.CsrfMiddleware = CsrfMiddleware;
exports.CsrfMiddleware = CsrfMiddleware = __decorate([
    (0, common_1.Injectable)()
], CsrfMiddleware);
//# sourceMappingURL=csrf.middleware.js.map