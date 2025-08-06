import { CreatePaymentIntentDto } from "./dto/create-payment-intent.dto";
import { PaymentsService } from "./payments.service";
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
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
}
