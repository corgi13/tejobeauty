import { Controller, Post, Body, Query } from "@nestjs/common";

import { EmailService } from "./email.service";

@Controller("api/email")
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post("test/welcome")
  async testWelcomeEmail(
    @Body("email") email: string,
    @Body("name") name: string,
    @Query("locale") locale: string = "en",
  ) {
    await this.emailService.sendWelcomeEmail(email, name, locale);
    return { success: true, message: "Welcome email sent successfully" };
  }

  @Post("test/password-reset")
  async testPasswordResetEmail(
    @Body("email") email: string,
    @Body("name") name: string,
    @Body("token") token: string,
    @Query("locale") locale: string = "en",
  ) {
    await this.emailService.sendPasswordResetEmail(email, name, token, locale);
    return { success: true, message: "Password reset email sent successfully" };
  }

  @Post("test/order-confirmation")
  async testOrderConfirmationEmail(
    @Body("email") email: string,
    @Body("orderData") orderData: any,
    @Query("locale") locale: string = "en",
  ) {
    await this.emailService.sendOrderConfirmationEmail(
      email,
      orderData,
      locale,
    );
    return {
      success: true,
      message: "Order confirmation email sent successfully",
    };
  }
}
