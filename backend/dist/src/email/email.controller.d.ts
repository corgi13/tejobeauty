import { EmailService } from "./email.service";
export declare class EmailController {
    private readonly emailService;
    constructor(emailService: EmailService);
    testWelcomeEmail(email: string, name: string, locale?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    testPasswordResetEmail(email: string, name: string, token: string, locale?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    testOrderConfirmationEmail(email: string, orderData: any, locale?: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
