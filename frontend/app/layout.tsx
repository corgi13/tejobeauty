import "./globals.css";
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import ScrollToTop from "../components/ScrollToTop";
import { CartProvider } from "@/components/cart/cart-provider";
import { ToastProvider } from "../components/ToastProvider";
import CartDrawer from "@/components/cart/cart-drawer";
import { I18nProvider } from "@/lib/i18n/i18n-provider";
import ClientProviders from "@/components/providers/client-providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tejo Nails Platform",
  description:
    "Professional nail care products for professionals and individuals",
  openGraph: {
    title: "Tejo Nails Platform",
    description:
      "Najbolji proizvodi za njegu noktiju za profesionalce i krajnje korisnike.",
    url: "https://tejonails.com",
    siteName: "Tejo Nails Platform",
    images: [
      {
        url: "https://tejonails.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tejo Nails Platform",
      },
    ],
    locale: "hr_HR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tejo Nails Platform",
    description:
      "Najbolji proizvodi za njegu noktiju za profesionalce i krajnje korisnike.",
    site: "@tejonails",
    creator: "@tejonails",
    images: ["https://tejonails.com/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#ec4899" />
      </head>
      <body className="min-h-screen bg-gray-50 font-sans">
        <ToastProvider>
          <ScrollToTop />
          <I18nProvider>
            <ClientProviders>
              <CartProvider>
                {children}
                <CartDrawer />
              </CartProvider>
            </ClientProviders>
          </I18nProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
