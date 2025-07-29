import { CreatePaymentIntentDto } from "./dto/create-payment-intent.dto";
import { PaymentsService } from "./payments.service";
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    createPaymentIntent(createPaymentIntentDto: CreatePaymentIntentDto): Promise<{
        clientSecret: string | null;
        paymentIntentId: string;
    }>;
    confirmPayment(paymentIntentId: string): Promise<{
        status: import("stripe").Stripe.PaymentIntent.Status;
        amount: number;
        currency: string;
        metadata: import("stripe").Stripe.Metadata;
    }>;
    createRefund(paymentIntentId: string, amount?: number): Promise<{
        refundId: string;
        status: string | null;
        amount: number;
    }>;
    handleWebhook(signature: string, payload: Buffer): Promise<{
        received: boolean;
    }>;
}
