import { Injectable, BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";

import { PrismaService } from "../prisma.service";
import { CreatePaymentIntentDto } from "./dto/create-payment-intent.dto";

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const stripeSecretKey = this.configService.get<string>("STRIPE_SECRET_KEY");

    if (!stripeSecretKey) {
      console.warn(
        "Stripe secret key not found. Payment functionality will be limited.",
      );
      return;
    }

    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-06-30.basil",
    });
  }

  async createPaymentIntent(createPaymentIntentDto: CreatePaymentIntentDto) {
    if (!this.stripe) {
      throw new BadRequestException("Payment service not configured");
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
    } catch (error) {
      console.error("Error creating payment intent:", error);
      throw new BadRequestException("Failed to create payment intent");
    }
  }

  async confirmPayment(paymentIntentId: string) {
    if (!this.stripe) {
      throw new BadRequestException("Payment service not configured");
    }

    try {
      const paymentIntent =
        await this.stripe.paymentIntents.retrieve(paymentIntentId);

      return {
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        metadata: paymentIntent.metadata,
      };
    } catch (error) {
      console.error("Error confirming payment:", error);
      throw new BadRequestException("Failed to confirm payment");
    }
  }

  async createRefund(paymentIntentId: string, amount?: number) {
    if (!this.stripe) {
      throw new BadRequestException("Payment service not configured");
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
    } catch (error) {
      console.error("Error creating refund:", error);
      throw new BadRequestException("Failed to create refund");
    }
  }

  async handleWebhook(signature: string, payload: Buffer) {
    if (!this.stripe) {
      throw new BadRequestException("Payment service not configured");
    }

    const webhookSecret = this.configService.get<string>(
      "STRIPE_WEBHOOK_SECRET",
    );

    if (!webhookSecret) {
      throw new BadRequestException("Webhook secret not configured");
    }

    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );

      // Handle different event types
      switch (event.type) {
        case "payment_intent.succeeded":
          await this.handlePaymentSucceeded(
            event.data.object as Stripe.PaymentIntent,
          );
          break;
        case "payment_intent.payment_failed":
          await this.handlePaymentFailed(
            event.data.object as Stripe.PaymentIntent,
          );
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      console.error("Webhook error:", error);
      throw new BadRequestException("Webhook verification failed");
    }
  }

  private async handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    console.log("Payment succeeded:", paymentIntent.id);

    // Update order status in database
    if (paymentIntent.metadata.orderId) {
      try {
        await this.prisma.order.update({
          where: { id: paymentIntent.metadata.orderId },
          data: {
            paymentStatus: "PAID",
            paymentIntentId: paymentIntent.id,
          },
        });
      } catch (error) {
        console.error("Error updating order after payment success:", error);
      }
    }
  }

  private async handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
    console.log("Payment failed:", paymentIntent.id);

    // Update order status in database
    if (paymentIntent.metadata.orderId) {
      try {
        await this.prisma.order.update({
          where: { id: paymentIntent.metadata.orderId },
          data: {
            paymentStatus: "FAILED",
            paymentIntentId: paymentIntent.id,
          },
        });
      } catch (error) {
        console.error("Error updating order after payment failure:", error);
      }
    }
  }
}
