"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const stripe_1 = require("stripe");
const prisma_service_1 = require("../prisma.service");
let PaymentsService = class PaymentsService {
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
        const stripeSecretKey = this.configService.get("STRIPE_SECRET_KEY");
        if (!stripeSecretKey) {
            console.warn("Stripe secret key not found. Payment functionality will be limited.");
            return;
        }
        this.stripe = new stripe_1.default(stripeSecretKey, {
            apiVersion: "2025-06-30.basil",
        });
    }
    async createPaymentIntent(createPaymentIntentDto) {
        if (!this.stripe) {
            throw new common_1.BadRequestException("Payment service not configured");
        }
        const { amount, currency, orderId, customerId } = createPaymentIntentDto;
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount,
                currency,
                metadata: {
                    ...(orderId && { orderId }),
                    ...(customerId && { customerId }),
                },
                automatic_payment_methods: {
                    enabled: true,
                },
            });
            return {
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id,
            };
        }
        catch (error) {
            console.error("Error creating payment intent:", error);
            throw new common_1.BadRequestException("Failed to create payment intent");
        }
    }
    async confirmPayment(paymentIntentId) {
        if (!this.stripe) {
            throw new common_1.BadRequestException("Payment service not configured");
        }
        try {
            const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
            return {
                status: paymentIntent.status,
                amount: paymentIntent.amount,
                currency: paymentIntent.currency,
                metadata: paymentIntent.metadata,
            };
        }
        catch (error) {
            console.error("Error confirming payment:", error);
            throw new common_1.BadRequestException("Failed to confirm payment");
        }
    }
    async createRefund(paymentIntentId, amount) {
        if (!this.stripe) {
            throw new common_1.BadRequestException("Payment service not configured");
        }
        try {
            const refund = await this.stripe.refunds.create({
                payment_intent: paymentIntentId,
                ...(amount && { amount }),
            });
            return {
                refundId: refund.id,
                status: refund.status,
                amount: refund.amount,
            };
        }
        catch (error) {
            console.error("Error creating refund:", error);
            throw new common_1.BadRequestException("Failed to create refund");
        }
    }
    async handleWebhook(signature, payload) {
        if (!this.stripe) {
            throw new common_1.BadRequestException("Payment service not configured");
        }
        const webhookSecret = this.configService.get("STRIPE_WEBHOOK_SECRET");
        if (!webhookSecret) {
            throw new common_1.BadRequestException("Webhook secret not configured");
        }
        try {
            const event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
            switch (event.type) {
                case "payment_intent.succeeded":
                    await this.handlePaymentSucceeded(event.data.object);
                    break;
                case "payment_intent.payment_failed":
                    await this.handlePaymentFailed(event.data.object);
                    break;
                default:
                    console.log(`Unhandled event type: ${event.type}`);
            }
            return { received: true };
        }
        catch (error) {
            console.error("Webhook error:", error);
            throw new common_1.BadRequestException("Webhook verification failed");
        }
    }
    async handlePaymentSucceeded(paymentIntent) {
        console.log("Payment succeeded:", paymentIntent.id);
        if (paymentIntent.metadata.orderId) {
            try {
                await this.prisma.order.update({
                    where: { id: paymentIntent.metadata.orderId },
                    data: {
                        paymentStatus: "PAID",
                        paymentIntentId: paymentIntent.id,
                    },
                });
            }
            catch (error) {
                console.error("Error updating order after payment success:", error);
            }
        }
    }
    async handlePaymentFailed(paymentIntent) {
        console.log("Payment failed:", paymentIntent.id);
        if (paymentIntent.metadata.orderId) {
            try {
                await this.prisma.order.update({
                    where: { id: paymentIntent.metadata.orderId },
                    data: {
                        paymentStatus: "FAILED",
                        paymentIntentId: paymentIntent.id,
                    },
                });
            }
            catch (error) {
                console.error("Error updating order after payment failure:", error);
            }
        }
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map