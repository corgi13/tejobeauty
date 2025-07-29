import { ConfigService } from "@nestjs/config";
export declare class EmailService {
    private configService;
    private transporter;
    constructor(configService: ConfigService);
    private getTemplateContent;
    private compileTemplate;
    sendTemplateEmail(to: string, subject: string, templateName: string, data: any, locale?: string): Promise<void>;
    sendWelcomeEmail(to: string, userName: string, locale?: string): Promise<void>;
    sendPasswordResetEmail(to: string, userName: string, resetToken: string, locale?: string): Promise<void>;
    sendOrderConfirmationEmail(to: string, orderData: any, locale?: string): Promise<void>;
}
