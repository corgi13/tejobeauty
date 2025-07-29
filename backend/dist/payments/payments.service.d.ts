import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";
import { PrismaService } from "../prisma.service";
import { CreatePaymentIntentDto } from "./dto/create-payment-intent.dto";
export declare class PaymentsService {
    private readonly configService;
    private readonly prisma;
    private stripe;
    constructor(configService: ConfigService, prisma: PrismaService);
    createPaymentIntent(createPaymentIntentDto: CreatePaymentIntentDto): Promise<{
        clientSecret: string | null;
        paymentIntentId: string;
    }>;
    confirmPayment(paymentIntentId: string): Promise<{
        status: Stripe.PaymentIntent.Status;
        amount: number;
        currency: string;
        metadata: Stripe.Metadata;
    }>;
    createRefund(paymentIntentId: string, amount?: number): Promise<{
        refundId: string;
        status: string | null;
        amount: number;
    }>;
    handleWebhook(signature: string, payload: Buffer): Promise<{
        received: boolean;
    }>;
    private handlePaymentSucceeded;
    private handlePaymentFailed;
}
