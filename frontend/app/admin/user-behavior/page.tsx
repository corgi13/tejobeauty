"use client";

import { useState } from "react";
import {
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Users,
  Clock,
  MousePointer,
  TrendingUp,
  BarChart3,
  PieChart,
  ArrowRight,
  CheckCircle,
  X,
  AlertTriangle,
  Smartphone,
  Monitor,
  Tablet,
  ArrowDownRight,
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  Search,
} from "lucide-react";
import RoleGuard from "@/lib/auth/role-guard";

// Mock data for user behavior analytics
const mockUserBehaviorMetrics = {
  totalSessions: 15000,
  averageSessionDuration: 240, // 4 minutes in seconds
  bounceRate: 35.2,
  pageViewsPerSession: 4.5,
  topEntryPages: [
    { page: "Home", count: 8500, percentage: 56.7 },
    { page: "Products", count: 2250, percentage: 15.0 },
    { page: "Search Results", count: 1500, percentage: 10.0 },
    { page: "Blog", count: 1125, percentage: 7.5 },
    { page: "Promotions", count: 1625, percentage: 10.8 },
  ],
  topExitPages: [
    { page: "Home", count: 3000, percentage: 20.0 },
    { page: "Product Detail", count: 3750, percentage: 25.0 },
    { page: "Cart", count: 2250, percentage: 15.0 },
    { page: "Checkout Confirmation", count: 4500, percentage: 30.0 },
    { page: "Contact", count: 1500, percentage: 10.0 },
  ],
  deviceBreakdown: [
    { device: "Desktop", count: 7500, percentage: 50.0 },
    { device: "Mobile", count: 6000, percentage: 40.0 },
    { device: "Tablet", count: 1500, percentage: 10.0 },
  ],
  newVsReturning: [
    { type: "new", count: 9000, percentage: 60.0 },
    { type: "returning", count: 6000, percentage: 40.0 },
  ],
};

const mockConversionFunnels = {
  purchase: {
    name: "Purchase Funnel",
    steps: [
      {
        name: "Product View",
        eventCategory: "product",
        eventAction: "view",
        count: 10000,
        dropoffRate: 0,
      },
      {
        name: "Add to Cart",
        eventCategory: "cart",
        eventAction: "add",
        count: 3000,
        dropoffRate: 70,
      },
      {
        name: "Begin Checkout",
        eventCategory: "checkout",
        eventAction: "begin",
        count: 1500,
        dropoffRate: 50,
      },
      {
        name: "Add Payment Info",
        eventCategory: "checkout",
        eventAction: "payment",
        count: 1200,
        dropoffRate: 20,
      },
      {
        name: "Purchase",
        eventCategory: "checkout",
        eventAction: "purchase_completed",
        count: 1000,
        dropoffRate: 16.7,
      },
    ],
    conversionRate: 10,
    averageTimeToConversion: 300, // 5 minutes in seconds
  },
  signup: {
    name: "Signup Funnel",
    steps: [
      {
        name: "View Registration",
        eventCategory: "registration",
        eventAction: "view",
        count: 5000,
        dropoffRate: 0,
      },
      {
        name: "Begin Registration",
        eventCategory: "registration",
        eventAction: "begin",
        count: 2000,
        dropoffRate: 60,
      },
      {
        name: "Submit Form",
        eventCategory: "registration",
        eventAction: "submit",
        count: 1200,
        dropoffRate: 40,
      },
      {
        name: "Verify Email",
        eventCategory: "registration",
        eventAction: "verify",
        count: 800,
        dropoffRate: 33.3,
      },
      {
        name: "Complete Registration",
        eventCategory: "registration",
        eventAction: "signup_completed",
        count: 700,
        dropoffRate: 12.5,
      },
    ],
    conversionRate: 14,
    averageTimeToConversion: 420, // 7 minutes in seconds
  },
  professional_registration: {
    name: "Professional Registration Funnel",
    steps: [
      {
        name: "View Pro Registration",
        eventCategory: "pro_registration",
        eventAction: "view",
        count: 2000,
        dropoffRate: 0,
      },
      {
        name: "Begin Pro Registration",
        eventCategory: "pro_registration",
        eventAction: "begin",
        count: 800,
        dropoffRate: 60,
      },
      {
        name: "Submit Business Info",
        eventCategory: "pro_registration",
        eventAction: "submit_business",
        count: 500,
        dropoffRate: 37.5,
      },
      {
        name: "Upload Documents",
        eventCategory: "pro_registration",
        eventAction: "upload_docs",
        count: 400,
        dropoffRate: 20,
      },
      {
        name: "Complete Registration",
        eventCategory: "pro_registration",
        eventAction: "professional_registration_completed",
        count: 350,
        dropoffRate: 12.5,
      },
    ],
    conversionRate: 17.5,
    averageTimeToConversion: 600, // 10 minutes in seconds
  },
};

const mockPopularPaths = [
  {
    path: [
      "Home",
      "Category: Nail Polish",
      "Product Detail",
      "Add to Cart",
      "Checkout",
      "Purchase Completed",
    ],
    count: 245,
    conversionRate: 3.2,
  },
  {
    path: [
      "Home",
      "Search Results",
      "Product Detail",
      "Add to Cart",
      "Checkout",
      "Purchase Completed",
    ],
    count: 187,
    conversionRate: 2.8,
  },
  {
    path: [
      "Home",
      "Featured Products",
      "Product Detail",
      "Add to Cart",
      "Checkout",
      "Purchase Completed",
    ],
    count: 156,
    conversionRate: 2.4,
  },
  {
    path: [
      "Home",
      "Category: Tools",
      "Product Detail",
      "Add to Cart",
      "Checkout",
      "Purchase Completed",
    ],
    count: 132,
    conversionRate: 2.1,
  },
  {
    path: [
      "Home",
      "Promotions",
      "Product Detail",
      "Add to Cart",
      "Checkout",
      "Purchase Completed",
    ],
    count: 98,
    conversionRate: 1.9,
  },
];

const mockUserJourneys = [
  {
    userId: "user123",
    sessionId: "session-1",
    startTime: "2024-07-17T10:24:32",
    endTime: "2024-07-17T10:35:18",
    steps: [
      { page: "Home", timestamp: "2024-07-17T10:24:32", action: "page_view" },
      {
        page: "Category: Nail Polish",
        timestamp: "2024-07-17T10:26:45",
        action: "page_view",
      },
      {
        page: "Product Detail: Premium Nail Polish - Ruby Red",
        timestamp: "2024-07-17T10:28:12",
        action: "page_view",
      },
      {
        page: "Product Detail: Premium Nail Polish - Ruby Red",
        timestamp: "2024-07-17T10:29:30",
        action: "add_to_cart",
      },
      { page: "Cart", timestamp: "2024-07-17T10:30:15", action: "page_view" },
      {
        page: "Checkout",
        timestamp: "2024-07-17T10:32:20",
        action: "begin_checkout",
      },
      {
        page: "Checkout",
        timestamp: "2024-07-17T10:34:45",
        action: "purchase_completed",
      },
    ],
    conversionAchieved: true,
    conversionType: "purchase_completed",
    conversionValue: 12.99,
  },
  {
    userId: "user456",
    sessionId: "session-2",
    startTime: "2024-07-17T11:15:22",
    endTime: "2024-07-17T11:22:48",
    steps: [
      { page: "Home", timestamp: "2024-07-17T11:15:22", action: "page_view" },
      {
        page: "Search Results",
        timestamp: "2024-07-17T11:16:30",
        action: "page_view",
      },
      {
        page: "Product Detail: Cuticle Oil Treatment",
        timestamp: "2024-07-17T11:18:12",
        action: "page_view",
      },
      {
        page: "Product Detail: Cuticle Oil Treatment",
        timestamp: "2024-07-17T11:19:45",
        action: "add_to_cart",
      },
      { page: "Cart", timestamp: "2024-07-17T11:20:10", action: "page_view" },
      {
        page: "Checkout",
        timestamp: "2024-07-17T11:21:30",
        action: "begin_checkout",
      },
    ],
    conversionAchieved: false,
  },
  {
    userId: "user789",
    sessionId: "session-3",
    startTime: "2024-07-17T14:05:12",
    endTime: "2024-07-17T14:18:35",
    steps: [
      { page: "Home", timestamp: "2024-07-17T14:05:12", action: "page_view" },
      {
        page: "Professional Portal",
        timestamp: "2024-07-17T14:07:25",
        action: "page_view",
      },
      {
        page: "Professional Registration",
        timestamp: "2024-07-17T14:09:30",
        action: "page_view",
      },
      {
        page: "Professional Registration",
        timestamp: "2024-07-17T14:12:45",
        action: "begin_registration",
      },
      {
        page: "Professional Registration",
        timestamp: "2024-07-17T14:15:20",
        action: "submit_business",
      },
      {
        page: "Professional Registration",
        timestamp: "2024-07-17T14:17:50",
        action: "upload_docs",
      },
      {
        page: "Professional Registration",
        timestamp: "2024-07-17T14:18:35",
        action: "professional_registration_completed",
      },
    ],
    conversionAchieved: true,
    conversionType: "professional_registration_completed",
  },
];

export default function UserBehaviorPage() {
  const [dateRange, setDateRange] = useState("last30days");
  const [selectedFunnel, setSelectedFunnel] = useState("purchase");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate data refresh
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage("Data refreshed successfully");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    }, 1000);
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatPercentage = (percentage: number): string => {
    return `${percentage.toFixed(1)}%`;
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case "desktop":
        return <Monitor className="h-5 w-5 text-blue-500" />;
      case "mobile":
        return <Smartphone className="h-5 w-5 text-green-500" />;
      case "tablet":
        return <Tablet className="h-5 w-5 text-purple-500" />;
      default:
        return <Monitor className="h-5 w-5 text-gray-500" />;
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">
              Total Sessions
            </h3>
            <div className="p-2 rounded-full bg-blue-100">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(mockUserBehaviorMetrics.totalSessions)}
              </p>
              <div className="flex items-center mt-2 text-green-600">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">
                  8.5% from previous period
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">
              Avg. Session Duration
            </h3>
            <div className="p-2 rounded-full bg-green-100">
              <Clock className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {formatDuration(mockUserBehaviorMetrics.averageSessionDuration)}
              </p>
              <div className="flex items-center mt-2 text-green-600">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">
                  12.3% from previous period
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Bounce Rate</h3>
            <div className="p-2 rounded-full bg-red-100">
              <ArrowRight className="h-5 w-5 text-red-600" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {formatPercentage(mockUserBehaviorMetrics.bounceRate)}
              </p>
              <div className="flex items-center mt-2 text-red-600">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">
                  2.1% from previous period
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">
              Pages / Session
            </h3>
            <div className="p-2 rounded-full bg-purple-100">
              <MousePointer className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {mockUserBehaviorMetrics.pageViewsPerSession.toFixed(1)}
              </p>
              <div className="flex items-center mt-2 text-green-600">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">
                  5.2% from previous period
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Device & User Type Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Device Breakdown
            </h2>
            <Monitor className="h-5 w-5 text-gray-400" />
          </div>

          <div className="space-y-6">
            {mockUserBehaviorMetrics.deviceBreakdown.map((device, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    {getDeviceIcon(device.device)}
                    <span className="text-sm font-medium text-gray-700 ml-2">
                      {device.device}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {formatPercentage(device.percentage)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      index === 0
                        ? "bg-blue-500"
                        : index === 1
                          ? "bg-green-500"
                          : "bg-purple-500"
                    }`}
                    style={{ width: `${device.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              New vs. Returning Users
            </h2>
            <Users className="h-5 w-5 text-gray-400" />
          </div>

          <div className="h-64 w-full flex items-center justify-center bg-gray-50 rounded-lg mb-4">
            <div className="text-center">
              <PieChart className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">User Type Distribution</p>
              <p className="text-sm text-gray-400">
                (In a real implementation, this would be a pie chart)
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {mockUserBehaviorMetrics.newVsReturning.map((type, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-2 ${
                      type.type === "new" ? "bg-blue-500" : "bg-green-500"
                    }`}
                  ></div>
                  <span className="text-sm text-gray-700 capitalize">
                    {type.type} Users
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {formatPercentage(type.percentage)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Entry & Exit Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Top Entry Pages
            </h2>
            <ArrowRight className="h-5 w-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {mockUserBehaviorMetrics.topEntryPages.map((page, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border border-gray-100 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center mr-3">
                    <span className="text-xs font-medium text-gray-600">
                      {index + 1}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {page.page}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {formatNumber(page.count)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatPercentage(page.percentage)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Top Exit Pages
            </h2>
            <ArrowRight className="h-5 w-5 text-gray-400 transform rotate-180" />
          </div>

          <div className="space-y-4">
            {mockUserBehaviorMetrics.topExitPages.map((page, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border border-gray-100 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center mr-3">
                    <span className="text-xs font-medium text-gray-600">
                      {index + 1}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {page.page}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {formatNumber(page.count)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatPercentage(page.percentage)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  const renderFunnelsTab = () => {
    const funnel =
      mockConversionFunnels[
        selectedFunnel as keyof typeof mockConversionFunnels
      ];

    return (
      <div className="space-y-8">
        {/* Funnel Selection */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <h2 className="text-lg font-semibold text-gray-900">
              Conversion Funnels
            </h2>
            <div className="flex items-center space-x-4">
              <select
                value={selectedFunnel}
                onChange={(e) => setSelectedFunnel(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="purchase">Purchase Funnel</option>
                <option value="signup">Signup Funnel</option>
                <option value="professional_registration">
                  Professional Registration Funnel
                </option>
              </select>
              <button
                onClick={handleRefresh}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                disabled={isLoading}
              >
                <RefreshCw
                  className={`h-5 w-5 text-gray-600 ${isLoading ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Funnel Visualization */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {funnel.name}
              </h2>
              <p className="text-sm text-gray-500">
                Overall conversion rate:{" "}
                {formatPercentage(funnel.conversionRate)} | Avg. time to
                conversion: {formatDuration(funnel.averageTimeToConversion)}
              </p>
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
              <Download className="h-4 w-4 mr-2 text-gray-600" />
              <span>Export</span>
            </button>
          </div>

          <div className="space-y-6">
            {funnel.steps.map((step, index) => {
              const nextStep = funnel.steps[index + 1];
              const width = nextStep
                ? (nextStep.count / step.count) * 100
                : 100;

              return (
                <div key={index} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center mr-3">
                        <span className="text-xs font-medium">{index + 1}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {step.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {formatNumber(step.count)}
                      </div>
                      {index > 0 && (
                        <div className="text-xs text-red-600">
                          {formatPercentage(step.dropoffRate)} drop-off
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                    <div
                      className="bg-blue-600 h-4 rounded-full"
                      style={{ width: `${width}%` }}
                    ></div>
                  </div>

                  {index < funnel.steps.length - 1 && (
                    <div className="flex justify-center mb-4">
                      <ArrowDownRight className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Funnel Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-700">
                Biggest Drop-off
              </h3>
              <ArrowDownRight className="h-5 w-5 text-red-500" />
            </div>

            {(() => {
              const sortedSteps = [...funnel.steps].sort(
                (a, b) => b.dropoffRate - a.dropoffRate,
              );
              const biggestDropoff = sortedSteps[0];

              return biggestDropoff ? (
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {biggestDropoff.name}
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    Step{" "}
                    {funnel.steps.findIndex(
                      (s) => s.name === biggestDropoff.name,
                    ) + 1}
                  </p>
                  <div className="flex items-center text-red-600">
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">
                      {formatPercentage(biggestDropoff.dropoffRate)} drop-off
                    </span>
                  </div>
                </div>
              ) : null;
            })()}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-700">
                Conversion Rate
              </h3>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>

            <p className="text-lg font-semibold text-gray-900">
              {formatPercentage(funnel.conversionRate)}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              Overall funnel conversion
            </p>
            <div className="flex items-center text-green-600">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">
                2.3% from previous period
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-700">
                Avg. Time to Conversion
              </h3>
              <Clock className="h-5 w-5 text-blue-500" />
            </div>

            <p className="text-lg font-semibold text-gray-900">
              {formatDuration(funnel.averageTimeToConversion)}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              From first step to conversion
            </p>
            <div className="flex items-center text-green-600">
              <ArrowDownRight className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">
                15.2% from previous period
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPathsTab = () => (
    <div className="space-y-8">
      {/* Popular Paths */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Popular User Paths
          </h2>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
            <Download className="h-4 w-4 mr-2 text-gray-600" />
            <span>Export</span>
          </button>
        </div>

        <div className="space-y-8">
          {mockPopularPaths.map((path, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center mr-3">
                    <span className="text-xs font-medium">{index + 1}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      Path {index + 1}
                    </span>
                    <div className="text-xs text-gray-500">
                      {formatNumber(path.count)} users |{" "}
                      {formatPercentage(path.conversionRate)} conversion rate
                    </div>
                  </div>
                </div>
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>

              <div className="flex items-center overflow-x-auto pb-4">
                {path.path.map((step, stepIndex) => (
                  <div
                    key={stepIndex}
                    className="flex items-center flex-shrink-0"
                  >
                    <div className="px-4 py-2 bg-gray-100 rounded-lg">
                      <span className="text-sm text-gray-800">{step}</span>
                    </div>
                    {stepIndex < path.path.length - 1 && (
                      <ChevronRight className="h-5 w-5 text-gray-400 mx-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Path Analysis */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Path Analysis</h2>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
              <Filter className="h-4 w-4 mr-2 text-gray-600" />
              <span>Filter</span>
            </button>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center">
              <Search className="h-4 w-4 mr-2" />
              <span>Find Path</span>
            </button>
          </div>
        </div>

        <div className="h-80 w-full flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">Path Visualization</p>
            <p className="text-sm text-gray-400">
              (In a real implementation, this would be an interactive path
              visualization)
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderJourneysTab = () => (
    <div className="space-y-8">
      {/* User Journey Search */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <h2 className="text-lg font-semibold text-gray-900">User Journeys</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by user ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full md:w-64"
              />
            </div>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* User Journeys */}
      <div className="space-y-6">
        {mockUserJourneys.map((journey, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  User Journey: {journey.userId}
                </h3>
                <p className="text-sm text-gray-500">
                  Session: {journey.sessionId} | Duration:{" "}
                  {formatDuration(
                    (new Date(journey.endTime).getTime() -
                      new Date(journey.startTime).getTime()) /
                      1000,
                  )}
                </p>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  journey.conversionAchieved
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {journey.conversionAchieved ? "Converted" : "Not Converted"}
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                {journey.steps.map((step, stepIndex) => (
                  <div
                    key={stepIndex}
                    className="relative flex items-start mb-4 pl-12"
                  >
                    <div className="absolute left-2 mt-1 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-800">
                        {stepIndex + 1}
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-900">
                          {step.page}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDateTime(step.timestamp)}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Action: {step.action}
                      </div>

                      {step.action === "purchase_completed" &&
                        journey.conversionValue && (
                          <div className="mt-2 px-3 py-1 bg-green-50 text-green-700 text-xs rounded-md inline-block">
                            Purchase value: $
                            {journey.conversionValue.toFixed(2)}
                          </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <RoleGuard allowedRoles={["ADMIN", "MANAGER"]}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  User Behavior Analytics
                </h1>
                <p className="text-sm text-gray-600">
                  Track and analyze user interactions and conversion funnels
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleRefresh}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                  disabled={isLoading}
                >
                  <RefreshCw
                    className={`h-5 w-5 text-gray-600 ${isLoading ? "animate-spin" : ""}`}
                  />
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                  <Download className="h-4 w-4 mr-2 text-gray-600" />
                  <span>Export</span>
                </button>
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

          {/* Date Range Selector */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="thisMonth">This Month</option>
                  <option value="lastMonth">Last Month</option>
                  <option value="custom">Custom Range</option>
                </select>
                {dateRange === "custom" && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="date"
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="date"
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                  <Filter className="h-4 w-4 mr-2 text-gray-600" />
                  <span>Filters</span>
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-600" />
                  <span>Compare</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "overview"
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("funnels")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "funnels"
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Conversion Funnels
                </button>
                <button
                  onClick={() => setActiveTab("paths")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "paths"
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  User Paths
                </button>
                <button
                  onClick={() => setActiveTab("journeys")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "journeys"
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  User Journeys
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mb-8">
            {activeTab === "overview" && renderOverviewTab()}
            {activeTab === "funnels" && renderFunnelsTab()}
            {activeTab === "paths" && renderPathsTab()}
            {activeTab === "journeys" && renderJourneysTab()}
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
