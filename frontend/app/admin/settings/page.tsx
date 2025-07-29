"use client";

import { useState } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import RoleGuard from "@/lib/auth/role-guard";
import {
  Save,
  Settings,
  Globe,
  Mail,
  CreditCard,
  ShieldCheck,
  Server,
  Bell,
  RefreshCw,
  CheckCircle,
  X,
  AlertTriangle,
  Info,
} from "lucide-react";

// Mock settings data
const mockSettings = {
  general: {
    siteName: "Tejo Nails",
    siteDescription:
      "Professional nail care products for salons and individuals",
    customerServiceEmail: "support@tejonails.com",
    customerServicePhone: "+385 1 234 5678",
    address: "Ilica 242, 10000 Zagreb, Croatia",
  },
  localization: {
    defaultLanguage: "en",
    availableLanguages: ["en", "hr"],
    defaultCurrency: "EUR",
    availableCurrencies: ["EUR", "USD", "HRK"],
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
  },
  email: {
    fromName: "Tejo Nails",
    fromEmail: "noreply@tejonails.com",
    smtpHost: "smtp.example.com",
    smtpPort: "587",
    smtpUsername: "smtp_user",
    smtpPassword: "••••••••••••",
    enableSsl: true,
  },
  payment: {
    stripePublicKey: "pk_test_••••••••••••••••••••••••••••••",
    stripeSecretKey: "••••••••••••••••••••••••••••••",
    enableTestMode: true,
    allowedPaymentMethods: ["card", "bank_transfer"],
    minimumOrderAmount: 10,
    vatRate: 25,
  },
  security: {
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireNumber: true,
    passwordRequireSpecial: true,
    mfaEnabled: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
  },
  features: {
    enableReviews: true,
    enableWishlist: true,
    enableProfessionalPortal: true,
    enableBulkOrdering: true,
    enableCommissions: true,
  },
  notifications: {
    orderConfirmation: true,
    orderStatusUpdate: true,
    orderShipped: true,
    lowStockAlert: true,
    lowStockThreshold: 10,
    newReviewAlert: true,
    newUserRegistration: false,
  },
  integrations: {
    algoliaAppId: "ALGOLIA_APP_ID",
    algoliaApiKey: "••••••••••••••••••••••••••••••",
    googleAnalyticsId: "G-XXXXXXXXXX",
    facebookPixelId: "",
  },
};

type SettingCategory =
  | "general"
  | "localization"
  | "email"
  | "payment"
  | "security"
  | "features"
  | "notifications"
  | "integrations";

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingCategory>("general");
  const [settings, setSettings] = useState(mockSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (
    category: SettingCategory,
    field: string,
    value: any,
  ) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [field]: value,
      },
    });
  };

  const handleCheckboxChange = (category: SettingCategory, field: string) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [field]: !(settings[category] as any)[field],
      },
    });
  };

  const handleSaveSettings = (category: SettingCategory) => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage(
        `${category.charAt(0).toUpperCase() + category.slice(1)} settings saved successfully`,
      );

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    }, 1000);
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="siteName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Site Name
          </label>
          <input
            type="text"
            id="siteName"
            value={settings.general.siteName}
            onChange={(e) =>
              handleInputChange("general", "siteName", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label
            htmlFor="customerServiceEmail"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Customer Service Email
          </label>
          <input
            type="email"
            id="customerServiceEmail"
            value={settings.general.customerServiceEmail}
            onChange={(e) =>
              handleInputChange(
                "general",
                "customerServiceEmail",
                e.target.value,
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="siteDescription"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Site Description
        </label>
        <textarea
          id="siteDescription"
          value={settings.general.siteDescription}
          onChange={(e) =>
            handleInputChange("general", "siteDescription", e.target.value)
          }
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="customerServicePhone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Customer Service Phone
          </label>
          <input
            type="text"
            id="customerServicePhone"
            value={settings.general.customerServicePhone}
            onChange={(e) =>
              handleInputChange(
                "general",
                "customerServicePhone",
                e.target.value,
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Business Address
          </label>
          <input
            type="text"
            id="address"
            value={settings.general.address}
            onChange={(e) =>
              handleInputChange("general", "address", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderLocalizationSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="defaultLanguage"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Default Language
          </label>
          <select
            id="defaultLanguage"
            value={settings.localization.defaultLanguage}
            onChange={(e) =>
              handleInputChange(
                "localization",
                "defaultLanguage",
                e.target.value,
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="en">English</option>
            <option value="hr">Croatian</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="defaultCurrency"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Default Currency
          </label>
          <select
            id="defaultCurrency"
            value={settings.localization.defaultCurrency}
            onChange={(e) =>
              handleInputChange(
                "localization",
                "defaultCurrency",
                e.target.value,
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="EUR">Euro (€)</option>
            <option value="USD">US Dollar ($)</option>
            <option value="HRK">Croatian Kuna (kn)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="dateFormat"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Date Format
          </label>
          <select
            id="dateFormat"
            value={settings.localization.dateFormat}
            onChange={(e) =>
              handleInputChange("localization", "dateFormat", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="timeFormat"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Time Format
          </label>
          <select
            id="timeFormat"
            value={settings.localization.timeFormat}
            onChange={(e) =>
              handleInputChange("localization", "timeFormat", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="12h">12-hour (AM/PM)</option>
            <option value="24h">24-hour</option>
          </select>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-md">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Info className="h-5 w-5 text-blue-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Available Languages
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                The platform currently supports English and Croatian. Additional
                languages can be added by uploading translation files.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="fromName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            From Name
          </label>
          <input
            type="text"
            id="fromName"
            value={settings.email.fromName}
            onChange={(e) =>
              handleInputChange("email", "fromName", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label
            htmlFor="fromEmail"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            From Email
          </label>
          <input
            type="email"
            id="fromEmail"
            value={settings.email.fromEmail}
            onChange={(e) =>
              handleInputChange("email", "fromEmail", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="smtpHost"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            SMTP Host
          </label>
          <input
            type="text"
            id="smtpHost"
            value={settings.email.smtpHost}
            onChange={(e) =>
              handleInputChange("email", "smtpHost", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label
            htmlFor="smtpPort"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            SMTP Port
          </label>
          <input
            type="text"
            id="smtpPort"
            value={settings.email.smtpPort}
            onChange={(e) =>
              handleInputChange("email", "smtpPort", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="smtpUsername"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            SMTP Username
          </label>
          <input
            type="text"
            id="smtpUsername"
            value={settings.email.smtpUsername}
            onChange={(e) =>
              handleInputChange("email", "smtpUsername", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label
            htmlFor="smtpPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            SMTP Password
          </label>
          <input
            type="password"
            id="smtpPassword"
            value={settings.email.smtpPassword}
            onChange={(e) =>
              handleInputChange("email", "smtpPassword", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="enableSsl"
          checked={settings.email.enableSsl}
          onChange={() => handleCheckboxChange("email", "enableSsl")}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="enableSsl" className="ml-2 block text-sm text-gray-900">
          Enable SSL/TLS
        </label>
      </div>

      <div className="mt-4">
        <button
          type="button"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Test Email Configuration
        </button>
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="stripePublicKey"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Stripe Public Key
          </label>
          <input
            type="text"
            id="stripePublicKey"
            value={settings.payment.stripePublicKey}
            onChange={(e) =>
              handleInputChange("payment", "stripePublicKey", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label
            htmlFor="stripeSecretKey"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Stripe Secret Key
          </label>
          <input
            type="password"
            id="stripeSecretKey"
            value={settings.payment.stripeSecretKey}
            onChange={(e) =>
              handleInputChange("payment", "stripeSecretKey", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="enableTestMode"
          checked={settings.payment.enableTestMode}
          onChange={() => handleCheckboxChange("payment", "enableTestMode")}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label
          htmlFor="enableTestMode"
          className="ml-2 block text-sm text-gray-900"
        >
          Enable Test Mode
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Allowed Payment Methods
        </label>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="paymentMethod_card"
              checked={settings.payment.allowedPaymentMethods.includes("card")}
              onChange={() => {
                const methods = settings.payment.allowedPaymentMethods.includes(
                  "card",
                )
                  ? settings.payment.allowedPaymentMethods.filter(
                      (m) => m !== "card",
                    )
                  : [...settings.payment.allowedPaymentMethods, "card"];
                handleInputChange("payment", "allowedPaymentMethods", methods);
              }}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label
              htmlFor="paymentMethod_card"
              className="ml-2 block text-sm text-gray-900"
            >
              Credit/Debit Card
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="paymentMethod_bank_transfer"
              checked={settings.payment.allowedPaymentMethods.includes(
                "bank_transfer",
              )}
              onChange={() => {
                const methods = settings.payment.allowedPaymentMethods.includes(
                  "bank_transfer",
                )
                  ? settings.payment.allowedPaymentMethods.filter(
                      (m) => m !== "bank_transfer",
                    )
                  : [
                      ...settings.payment.allowedPaymentMethods,
                      "bank_transfer",
                    ];
                handleInputChange("payment", "allowedPaymentMethods", methods);
              }}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label
              htmlFor="paymentMethod_bank_transfer"
              className="ml-2 block text-sm text-gray-900"
            >
              Bank Transfer
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="minimumOrderAmount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Minimum Order Amount (EUR)
          </label>
          <input
            type="number"
            id="minimumOrderAmount"
            value={settings.payment.minimumOrderAmount}
            onChange={(e) =>
              handleInputChange(
                "payment",
                "minimumOrderAmount",
                parseFloat(e.target.value),
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label
            htmlFor="vatRate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            VAT Rate (%)
          </label>
          <input
            type="number"
            id="vatRate"
            value={settings.payment.vatRate}
            onChange={(e) =>
              handleInputChange(
                "payment",
                "vatRate",
                parseFloat(e.target.value),
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="passwordMinLength"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Minimum Password Length
          </label>
          <input
            type="number"
            id="passwordMinLength"
            value={settings.security.passwordMinLength}
            onChange={(e) =>
              handleInputChange(
                "security",
                "passwordMinLength",
                parseInt(e.target.value),
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label
            htmlFor="sessionTimeout"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Session Timeout (minutes)
          </label>
          <input
            type="number"
            id="sessionTimeout"
            value={settings.security.sessionTimeout}
            onChange={(e) =>
              handleInputChange(
                "security",
                "sessionTimeout",
                parseInt(e.target.value),
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password Requirements
        </label>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="passwordRequireUppercase"
              checked={settings.security.passwordRequireUppercase}
              onChange={() =>
                handleCheckboxChange("security", "passwordRequireUppercase")
              }
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label
              htmlFor="passwordRequireUppercase"
              className="ml-2 block text-sm text-gray-900"
            >
              Require uppercase letter
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="passwordRequireNumber"
              checked={settings.security.passwordRequireNumber}
              onChange={() =>
                handleCheckboxChange("security", "passwordRequireNumber")
              }
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label
              htmlFor="passwordRequireNumber"
              className="ml-2 block text-sm text-gray-900"
            >
              Require number
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="passwordRequireSpecial"
              checked={settings.security.passwordRequireSpecial}
              onChange={() =>
                handleCheckboxChange("security", "passwordRequireSpecial")
              }
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label
              htmlFor="passwordRequireSpecial"
              className="ml-2 block text-sm text-gray-900"
            >
              Require special character
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="mfaEnabled"
          checked={settings.security.mfaEnabled}
          onChange={() => handleCheckboxChange("security", "mfaEnabled")}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label
          htmlFor="mfaEnabled"
          className="ml-2 block text-sm text-gray-900"
        >
          Enable Multi-Factor Authentication
        </label>
      </div>

      <div>
        <label
          htmlFor="maxLoginAttempts"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Maximum Login Attempts
        </label>
        <input
          type="number"
          id="maxLoginAttempts"
          value={settings.security.maxLoginAttempts}
          onChange={(e) =>
            handleInputChange(
              "security",
              "maxLoginAttempts",
              parseInt(e.target.value),
            )
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <p className="mt-1 text-sm text-gray-500">
          Number of failed login attempts before account is temporarily locked
        </p>
      </div>
    </div>
  );

  const renderFeatureSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="enableReviews"
              checked={settings.features.enableReviews}
              onChange={() => handleCheckboxChange("features", "enableReviews")}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label
              htmlFor="enableReviews"
              className="ml-2 block text-sm font-medium text-gray-900"
            >
              Product Reviews
            </label>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Enabled
          </span>
        </div>
        <p className="text-sm text-gray-500 ml-6">
          Allow customers to leave reviews and ratings on products
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="enableWishlist"
              checked={settings.features.enableWishlist}
              onChange={() =>
                handleCheckboxChange("features", "enableWishlist")
              }
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label
              htmlFor="enableWishlist"
              className="ml-2 block text-sm font-medium text-gray-900"
            >
              Wishlist
            </label>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Enabled
          </span>
        </div>
        <p className="text-sm text-gray-500 ml-6">
          Allow customers to save products to their wishlist
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="enableProfessionalPortal"
              checked={settings.features.enableProfessionalPortal}
              onChange={() =>
                handleCheckboxChange("features", "enableProfessionalPortal")
              }
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label
              htmlFor="enableProfessionalPortal"
              className="ml-2 block text-sm font-medium text-gray-900"
            >
              Professional Portal
            </label>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Enabled
          </span>
        </div>
        <p className="text-sm text-gray-500 ml-6">
          Enable the professional portal for nail care professionals
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="enableBulkOrdering"
              checked={settings.features.enableBulkOrdering}
              onChange={() =>
                handleCheckboxChange("features", "enableBulkOrdering")
              }
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label
              htmlFor="enableBulkOrdering"
              className="ml-2 block text-sm font-medium text-gray-900"
            >
              Bulk Ordering
            </label>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Enabled
          </span>
        </div>
        <p className="text-sm text-gray-500 ml-6">
          Allow professionals to place bulk orders with special pricing
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="enableCommissions"
              checked={settings.features.enableCommissions}
              onChange={() =>
                handleCheckboxChange("features", "enableCommissions")
              }
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label
              htmlFor="enableCommissions"
              className="ml-2 block text-sm font-medium text-gray-900"
            >
              Professional Commissions
            </label>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Enabled
          </span>
        </div>
        <p className="text-sm text-gray-500 ml-6">
          Enable commission tracking and payments for professionals
        </p>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="orderConfirmation"
            checked={settings.notifications.orderConfirmation}
            onChange={() =>
              handleCheckboxChange("notifications", "orderConfirmation")
            }
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label
            htmlFor="orderConfirmation"
            className="ml-2 block text-sm font-medium text-gray-900"
          >
            Order Confirmation
          </label>
        </div>
        <p className="text-sm text-gray-500 ml-6">
          Send email notification when an order is placed
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="orderStatusUpdate"
            checked={settings.notifications.orderStatusUpdate}
            onChange={() =>
              handleCheckboxChange("notifications", "orderStatusUpdate")
            }
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label
            htmlFor="orderStatusUpdate"
            className="ml-2 block text-sm font-medium text-gray-900"
          >
            Order Status Updates
          </label>
        </div>
        <p className="text-sm text-gray-500 ml-6">
          Send email notification when an order status changes
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="orderShipped"
            checked={settings.notifications.orderShipped}
            onChange={() =>
              handleCheckboxChange("notifications", "orderShipped")
            }
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label
            htmlFor="orderShipped"
            className="ml-2 block text-sm font-medium text-gray-900"
          >
            Order Shipped
          </label>
        </div>
        <p className="text-sm text-gray-500 ml-6">
          Send email notification when an order is shipped
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="lowStockAlert"
            checked={settings.notifications.lowStockAlert}
            onChange={() =>
              handleCheckboxChange("notifications", "lowStockAlert")
            }
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label
            htmlFor="lowStockAlert"
            className="ml-2 block text-sm font-medium text-gray-900"
          >
            Low Stock Alerts
          </label>
        </div>
        <div className="ml-6">
          <p className="text-sm text-gray-500 mb-2">
            Send notification when product inventory falls below threshold
          </p>
          <div className="flex items-center">
            <label
              htmlFor="lowStockThreshold"
              className="block text-sm font-medium text-gray-700 mr-2"
            >
              Threshold:
            </label>
            <input
              type="number"
              id="lowStockThreshold"
              value={settings.notifications.lowStockThreshold}
              onChange={(e) =>
                handleInputChange(
                  "notifications",
                  "lowStockThreshold",
                  parseInt(e.target.value),
                )
              }
              className="w-20 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="newReviewAlert"
            checked={settings.notifications.newReviewAlert}
            onChange={() =>
              handleCheckboxChange("notifications", "newReviewAlert")
            }
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label
            htmlFor="newReviewAlert"
            className="ml-2 block text-sm font-medium text-gray-900"
          >
            New Review Alerts
          </label>
        </div>
        <p className="text-sm text-gray-500 ml-6">
          Send notification when a new product review is submitted
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="newUserRegistration"
            checked={settings.notifications.newUserRegistration}
            onChange={() =>
              handleCheckboxChange("notifications", "newUserRegistration")
            }
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label
            htmlFor="newUserRegistration"
            className="ml-2 block text-sm font-medium text-gray-900"
          >
            New User Registration
          </label>
        </div>
        <p className="text-sm text-gray-500 ml-6">
          Send notification when a new user registers
        </p>
      </div>
    </div>
  );

  const renderIntegrationSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="algoliaAppId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Algolia App ID
          </label>
          <input
            type="text"
            id="algoliaAppId"
            value={settings.integrations.algoliaAppId}
            onChange={(e) =>
              handleInputChange("integrations", "algoliaAppId", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label
            htmlFor="algoliaApiKey"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Algolia API Key
          </label>
          <input
            type="password"
            id="algoliaApiKey"
            value={settings.integrations.algoliaApiKey}
            onChange={(e) =>
              handleInputChange("integrations", "algoliaApiKey", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="googleAnalyticsId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Google Analytics ID
          </label>
          <input
            type="text"
            id="googleAnalyticsId"
            value={settings.integrations.googleAnalyticsId}
            onChange={(e) =>
              handleInputChange(
                "integrations",
                "googleAnalyticsId",
                e.target.value,
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label
            htmlFor="facebookPixelId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Facebook Pixel ID
          </label>
          <input
            type="text"
            id="facebookPixelId"
            value={settings.integrations.facebookPixelId}
            onChange={(e) =>
              handleInputChange(
                "integrations",
                "facebookPixelId",
                e.target.value,
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-md">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Integration Note
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                After changing integration settings, you may need to rebuild the
                search indices or clear the cache for changes to take effect.
              </p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
              >
                Rebuild Search Indices
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "general":
        return renderGeneralSettings();
      case "localization":
        return renderLocalizationSettings();
      case "email":
        return renderEmailSettings();
      case "payment":
        return renderPaymentSettings();
      case "security":
        return renderSecuritySettings();
      case "features":
        return renderFeatureSettings();
      case "notifications":
        return renderNotificationSettings();
      case "integrations":
        return renderIntegrationSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  System Settings
                </h1>
                <p className="text-sm text-gray-600">
                  Configure system-wide settings and preferences
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-md flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                {successMessage}
              </div>
              <button onClick={() => setSuccessMessage("")}>
                <X className="h-5 w-5 text-green-800" />
              </button>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-md flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                {errorMessage}
              </div>
              <button onClick={() => setErrorMessage("")}>
                <X className="h-5 w-5 text-red-800" />
              </button>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-6">
            {/* Settings Navigation */}
            <div className="w-full md:w-64 bg-white rounded-lg shadow-md p-6">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab("general")}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === "general"
                      ? "bg-primary-100 text-primary-800"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Settings
                    className={`mr-3 h-5 w-5 ${activeTab === "general" ? "text-primary-600" : "text-gray-400"}`}
                  />
                  General
                </button>
                <button
                  onClick={() => setActiveTab("localization")}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === "localization"
                      ? "bg-primary-100 text-primary-800"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Globe
                    className={`mr-3 h-5 w-5 ${activeTab === "localization" ? "text-primary-600" : "text-gray-400"}`}
                  />
                  Localization
                </button>
                <button
                  onClick={() => setActiveTab("email")}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === "email"
                      ? "bg-primary-100 text-primary-800"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Mail
                    className={`mr-3 h-5 w-5 ${activeTab === "email" ? "text-primary-600" : "text-gray-400"}`}
                  />
                  Email
                </button>
                <button
                  onClick={() => setActiveTab("payment")}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === "payment"
                      ? "bg-primary-100 text-primary-800"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <CreditCard
                    className={`mr-3 h-5 w-5 ${activeTab === "payment" ? "text-primary-600" : "text-gray-400"}`}
                  />
                  Payment
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === "security"
                      ? "bg-primary-100 text-primary-800"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <ShieldCheck
                    className={`mr-3 h-5 w-5 ${activeTab === "security" ? "text-primary-600" : "text-gray-400"}`}
                  />
                  Security
                </button>
                <button
                  onClick={() => setActiveTab("features")}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === "features"
                      ? "bg-primary-100 text-primary-800"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Server
                    className={`mr-3 h-5 w-5 ${activeTab === "features" ? "text-primary-600" : "text-gray-400"}`}
                  />
                  Features
                </button>
                <button
                  onClick={() => setActiveTab("notifications")}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === "notifications"
                      ? "bg-primary-100 text-primary-800"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Bell
                    className={`mr-3 h-5 w-5 ${activeTab === "notifications" ? "text-primary-600" : "text-gray-400"}`}
                  />
                  Notifications
                </button>
                <button
                  onClick={() => setActiveTab("integrations")}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === "integrations"
                      ? "bg-primary-100 text-primary-800"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <RefreshCw
                    className={`mr-3 h-5 w-5 ${activeTab === "integrations" ? "text-primary-600" : "text-gray-400"}`}
                  />
                  Integrations
                </button>
              </nav>
            </div>

            {/* Settings Content */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6 capitalize">
                  {activeTab} Settings
                </h2>

                <form>
                  {renderActiveTabContent()}

                  <div className="mt-8 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleSaveSettings(activeTab)}
                      disabled={isLoading}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Settings
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
