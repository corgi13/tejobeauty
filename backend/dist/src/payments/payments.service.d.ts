import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma.service";
import { CreatePaymentIntentDto } from "./dto/create-payment-intent.dto";
export declare class PaymentsService {
    private readonly configService;
    private readonly prisma;
    private stripe;
    constructor(configService: ConfigService, prisma: PrismaService);
    createPaymentIntent(createPaymentIntentDto: CreatePaymentIntentDto): Promise<{
        clientSecret: any;
        paymentIntentId: any;
    }>;
    confirmPayment(paymentIntentId: string): Promise<{
        status: any;
        amount: any;
        currency: any;
        metadata: any;
    }>;
    createRefund(paymentIntentId: string, amount?: number): Promise<{
        refundId: any;
        status: any;
        amount: any;
    }>;
    handleWebhook(signature: string, payload: Buffer): Promise<{
        received: boolean;
    }>;
    private handlePaymentSucceeded;
    private handlePaymentFailed;
}
