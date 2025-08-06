import * as fs from "fs";
import * as path from "path";

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as handlebars from "handlebars";
import * as nodemailer from "nodemailer";

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    // Create a nodemailer transporter
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>("EMAIL_HOST"),
      port: this.configService.get<number>("EMAIL_PORT"),
      secure: this.configService.get<boolean>("EMAIL_SECURE"),
      auth: {
        user: this.configService.get<string>("EMAIL_USER"),
        pass: this.configService.get<string>("EMAIL_PASSWORD"),
      },
    });
  }

  /**
   * Get the template content from file
   * @param templateName The name of the template
   * @param locale The locale for the template
   * @returns The template content
   */
  private async getTemplateContent(
    templateName: string,
    locale: string,
  ): Promise<string> {
    // Validate and sanitize template name to prevent path traversal
    const allowedTemplates = ['welcome', 'password-reset', 'order-confirmation', 'email-verification'];
    const sanitizedTemplateName = path.basename(templateName.replace(/[^a-zA-Z0-9-_]/g, ''));
    
    if (!allowedTemplates.includes(sanitizedTemplateName)) {
      throw new Error(`Invalid template name: ${templateName}`);
    }

    // Default to English if the requested locale is not available
    const availableLocales = ["en", "hr"];
    const sanitizedLocale = availableLocales.includes(locale) ? locale : "en";

    const templatePath = path.join(
      __dirname,
      "templates",
      sanitizedLocale,
      `${sanitizedTemplateName}.html`,
    );
    
    // Ensure the resolved path is within the templates directory
    const templatesDir = path.join(__dirname, "templates");
    const resolvedPath = path.resolve(templatePath);
    if (!resolvedPath.startsWith(path.resolve(templatesDir))) {
      throw new Error('Invalid template path');
    }

    try {
      return fs.readFileSync(templatePath, "utf8");
    } catch (error) {
      // If the template doesn't exist in the requested locale, fall back to English
      if (templateLocale !== "en") {
        const fallbackPath = path.join(
          __dirname,
          "templates",
          "en",
          `${templateName}.html`,
        );
        return fs.readFileSync(fallbackPath, "utf8");
      }
      throw error;
    }
  }

  /**
   * Compile the template with the provided data
   * @param template The template content
   * @param data The data to compile the template with
   * @returns The compiled template
   */
  private compileTemplate(template: string, data: any): string {
    const compiledTemplate = handlebars.compile(template);
    return compiledTemplate(data);
  }

  /**
   * Send an email using a template
   * @param to The recipient email address
   * @param subject The email subject
   * @param templateName The name of the template
   * @param data The data to compile the template with
   * @param locale The locale for the template
   * @returns A promise that resolves when the email is sent
   */
  async sendTemplateEmail(
    to: string,
    subject: string,
    templateName: string,
    data: any,
    locale: string = "en",
  ): Promise<void> {
    try {
      // Get the template content
      const templateContent = await this.getTemplateContent(
        templateName,
        locale,
      );

      // Compile the template with the provided data
      const html = this.compileTemplate(templateContent, data);

      // Send the email
      await this.transporter.sendMail({
        from: this.configService.get<string>("EMAIL_FROM"),
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error(`Failed to send email: ${error.message}`);
      throw error;
    }
  }

  /**
   * Send a welcome email
   * @param to The recipient email address
   * @param userName The user's name
   * @param locale The user's locale
   * @returns A promise that resolves when the email is sent
   */
  async sendWelcomeEmail(
    to: string,
    userName: string,
    locale: string = "en",
  ): Promise<void> {
    const subject =
      locale === "hr" ? "Dobrodošli u Tejo Nails" : "Welcome to Tejo Nails";

    const data = {
      userName,
      logoUrl:
        this.configService.get<string>("WEBSITE_URL") + "/images/logo.png",
      shopUrl: this.configService.get<string>("WEBSITE_URL") + "/products",
      product1Image:
        this.configService.get<string>("WEBSITE_URL") +
        "/images/products/product1.jpg",
      product1Name: locale === "hr" ? "Gel lak u boji" : "Gel Polish Color",
      product1Price: locale === "hr" ? "15,99 €" : "$19.99",
      product2Image:
        this.configService.get<string>("WEBSITE_URL") +
        "/images/products/product2.jpg",
      product2Name: locale === "hr" ? "Set za manikuru" : "Manicure Set",
      product2Price: locale === "hr" ? "24,99 €" : "$29.99",
      product3Image:
        this.configService.get<string>("WEBSITE_URL") +
        "/images/products/product3.jpg",
      product3Name: locale === "hr" ? "Ulje za kutikulu" : "Cuticle Oil",
      product3Price: locale === "hr" ? "9,99 €" : "$12.99",
      facebookUrl: "https://facebook.com/tejonails",
      instagramUrl: "https://instagram.com/tejonails",
      twitterUrl: "https://twitter.com/tejonails",
      pinterestUrl: "https://pinterest.com/tejonails",
      unsubscribeUrl:
        this.configService.get<string>("WEBSITE_URL") + "/unsubscribe",
      privacyUrl: this.configService.get<string>("WEBSITE_URL") + "/privacy",
      termsUrl: this.configService.get<string>("WEBSITE_URL") + "/terms",
    };

    await this.sendTemplateEmail(to, subject, "welcome", data, locale);
  }

  /**
   * Send a password reset email
   * @param to The recipient email address
   * @param userName The user's name
   * @param resetToken The password reset token
   * @param locale The user's locale
   * @returns A promise that resolves when the email is sent
   */
  async sendPasswordResetEmail(
    to: string,
    userName: string,
    resetToken: string,
    locale: string = "en",
  ): Promise<void> {
    const subject = locale === "hr" ? "Resetiranje lozinke" : "Password Reset";

    const resetUrl = `${this.configService.get<string>("WEBSITE_URL")}/reset-password?token=${resetToken}`;

    const data = {
      userName,
      resetUrl,
      logoUrl:
        this.configService.get<string>("WEBSITE_URL") + "/images/logo.png",
      privacyUrl: this.configService.get<string>("WEBSITE_URL") + "/privacy",
      termsUrl: this.configService.get<string>("WEBSITE_URL") + "/terms",
    };

    await this.sendTemplateEmail(to, subject, "password-reset", data, locale);
  }

  /**
   * Send an order confirmation email
   * @param to The recipient email address
   * @param orderData The order data
   * @param locale The user's locale
   * @returns A promise that resolves when the email is sent
   */
  async sendOrderConfirmationEmail(
    to: string,
    orderData: any,
    locale: string = "en",
  ): Promise<void> {
    const subject = locale === "hr" ? "Potvrda narudžbe" : "Order Confirmation";

    // Format currency based on locale
    const formatCurrency = (amount: number): string => {
      return locale === "hr"
        ? `${amount.toFixed(2).replace(".", ",")} €`
        : `$${amount.toFixed(2)}`;
    };

    // Format date based on locale
    const formatDate = (date: Date): string => {
      return locale === "hr"
        ? date.toLocaleDateString("hr-HR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          });
    };

    // Format the order items with localized currency
    const items = orderData.items.map((item: any) => ({
      ...item,
      price: formatCurrency(item.price),
    }));

    const data = {
      customerName: orderData.customerName,
      orderNumber: orderData.orderNumber,
      orderDate: formatDate(new Date(orderData.orderDate)),
      paymentMethod: orderData.paymentMethod,
      items,
      subtotal: formatCurrency(orderData.subtotal),
      shipping: formatCurrency(orderData.shipping),
      tax: formatCurrency(orderData.tax),
      total: formatCurrency(orderData.total),
      shippingAddress: orderData.shippingAddress,
      shippingMethod: orderData.shippingMethod,
      estimatedDelivery: formatDate(new Date(orderData.estimatedDelivery)),
      trackingUrl: `${this.configService.get<string>("WEBSITE_URL")}/orders/${orderData.orderNumber}/track`,
      logoUrl:
        this.configService.get<string>("WEBSITE_URL") + "/images/logo.png",
      unsubscribeUrl:
        this.configService.get<string>("WEBSITE_URL") + "/unsubscribe",
      privacyUrl: this.configService.get<string>("WEBSITE_URL") + "/privacy",
      termsUrl: this.configService.get<string>("WEBSITE_URL") + "/terms",
    };

    await this.sendTemplateEmail(
      to,
      subject,
      "order-confirmation",
      data,
      locale,
    );
  }
}
