import {
  Controller,
  Post,
  Body,
  Param,
  Headers,
  RawBody,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";

import { CreatePaymentIntentDto } from "./dto/create-payment-intent.dto";
import { PaymentsService } from "./payments.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags("payments")
@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post("create-payment-intent")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a payment intent" })
  @ApiResponse({
    status: 201,
    description: "Payment intent created successfully",
  })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async createPaymentIntent(
    @Body() createPaymentIntentDto: CreatePaymentIntentDto,
  ) {
    return this.paymentsService.createPaymentIntent(createPaymentIntentDto);
  }

  @Post("confirm/:paymentIntentId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Confirm a payment" })
  @ApiResponse({ status: 200, description: "Payment confirmed successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async confirmPayment(@Param("paymentIntentId") paymentIntentId: string) {
    return this.paymentsService.confirmPayment(paymentIntentId);
  }

  @Post("refund/:paymentIntentId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a refund" })
  @ApiResponse({ status: 201, description: "Refund created successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async createRefund(
    @Param("paymentIntentId") paymentIntentId: string,
    @Body("amount") amount?: number,
  ) {
    return this.paymentsService.createRefund(paymentIntentId, amount);
  }

  @Post("webhook")
  @ApiOperation({ summary: "Handle Stripe webhooks" })
  @ApiResponse({ status: 200, description: "Webhook processed successfully" })
  @ApiResponse({ status: 400, description: "Webhook verification failed" })
  async handleWebhook(
    @Headers("stripe-signature") signature: string,
    @RawBody() payload: Buffer,
  ) {
    return this.paymentsService.handleWebhook(signature, payload);
  }
}
