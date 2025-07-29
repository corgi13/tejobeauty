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
exports.EmailService = void 0;
const fs = require("fs");
const path = require("path");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const handlebars = require("handlebars");
const nodemailer = require("nodemailer");
let EmailService = class EmailService {
    constructor(configService) {
        this.configService = configService;
        this.transporter = nodemailer.createTransport({
            host: this.configService.get("EMAIL_HOST"),
            port: this.configService.get("EMAIL_PORT"),
            secure: this.configService.get("EMAIL_SECURE"),
            auth: {
                user: this.configService.get("EMAIL_USER"),
                pass: this.configService.get("EMAIL_PASSWORD"),
            },
        });
    }
    async getTemplateContent(templateName, locale) {
        const availableLocales = ["en", "hr"];
        const templateLocale = availableLocales.includes(locale) ? locale : "en";
        const templatePath = path.join(__dirname, "templates", templateLocale, `${templateName}.html`);
        try {
            return fs.readFileSync(templatePath, "utf8");
        }
        catch (error) {
            if (templateLocale !== "en") {
                const fallbackPath = path.join(__dirname, "templates", "en", `${templateName}.html`);
                return fs.readFileSync(fallbackPath, "utf8");
            }
            throw error;
        }
    }
    compileTemplate(template, data) {
        const compiledTemplate = handlebars.compile(template);
        return compiledTemplate(data);
    }
    async sendTemplateEmail(to, subject, templateName, data, locale = "en") {
        try {
            const templateContent = await this.getTemplateContent(templateName, locale);
            const html = this.compileTemplate(templateContent, data);
            await this.transporter.sendMail({
                from: this.configService.get("EMAIL_FROM"),
                to,
                subject,
                html,
            });
        }
        catch (error) {
            console.error(`Failed to send email: ${error.message}`);
            throw error;
        }
    }
    async sendWelcomeEmail(to, userName, locale = "en") {
        const subject = locale === "hr" ? "Dobrodošli u Tejo Nails" : "Welcome to Tejo Nails";
        const data = {
            userName,
            logoUrl: this.configService.get("WEBSITE_URL") + "/images/logo.png",
            shopUrl: this.configService.get("WEBSITE_URL") + "/products",
            product1Image: this.configService.get("WEBSITE_URL") +
                "/images/products/product1.jpg",
            product1Name: locale === "hr" ? "Gel lak u boji" : "Gel Polish Color",
            product1Price: locale === "hr" ? "15,99 €" : "$19.99",
            product2Image: this.configService.get("WEBSITE_URL") +
                "/images/products/product2.jpg",
            product2Name: locale === "hr" ? "Set za manikuru" : "Manicure Set",
            product2Price: locale === "hr" ? "24,99 €" : "$29.99",
            product3Image: this.configService.get("WEBSITE_URL") +
                "/images/products/product3.jpg",
            product3Name: locale === "hr" ? "Ulje za kutikulu" : "Cuticle Oil",
            product3Price: locale === "hr" ? "9,99 €" : "$12.99",
            facebookUrl: "https://facebook.com/tejonails",
            instagramUrl: "https://instagram.com/tejonails",
            twitterUrl: "https://twitter.com/tejonails",
            pinterestUrl: "https://pinterest.com/tejonails",
            unsubscribeUrl: this.configService.get("WEBSITE_URL") + "/unsubscribe",
            privacyUrl: this.configService.get("WEBSITE_URL") + "/privacy",
            termsUrl: this.configService.get("WEBSITE_URL") + "/terms",
        };
        await this.sendTemplateEmail(to, subject, "welcome", data, locale);
    }
    async sendPasswordResetEmail(to, userName, resetToken, locale = "en") {
        const subject = locale === "hr" ? "Resetiranje lozinke" : "Password Reset";
        const resetUrl = `${this.configService.get("WEBSITE_URL")}/reset-password?token=${resetToken}`;
        const data = {
            userName,
            resetUrl,
            logoUrl: this.configService.get("WEBSITE_URL") + "/images/logo.png",
            privacyUrl: this.configService.get("WEBSITE_URL") + "/privacy",
            termsUrl: this.configService.get("WEBSITE_URL") + "/terms",
        };
        await this.sendTemplateEmail(to, subject, "password-reset", data, locale);
    }
    async sendOrderConfirmationEmail(to, orderData, locale = "en") {
        const subject = locale === "hr" ? "Potvrda narudžbe" : "Order Confirmation";
        const formatCurrency = (amount) => {
            return locale === "hr"
                ? `${amount.toFixed(2).replace(".", ",")} €`
                : `$${amount.toFixed(2)}`;
        };
        const formatDate = (date) => {
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
        const items = orderData.items.map((item) => ({
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
            trackingUrl: `${this.configService.get("WEBSITE_URL")}/orders/${orderData.orderNumber}/track`,
            logoUrl: this.configService.get("WEBSITE_URL") + "/images/logo.png",
            unsubscribeUrl: this.configService.get("WEBSITE_URL") + "/unsubscribe",
            privacyUrl: this.configService.get("WEBSITE_URL") + "/privacy",
            termsUrl: this.configService.get("WEBSITE_URL") + "/terms",
        };
        await this.sendTemplateEmail(to, subject, "order-confirmation", data, locale);
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map