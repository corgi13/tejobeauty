"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  Calendar,
  Download,
  Eye,
  Filter,
  RefreshCw,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  BarChart3,
  PieChart,
  LineChart,
  UserPlus,
  ShoppingCart,
  Percent,
  Share2,
} from "lucide-react";
import RoleGuard from "@/lib/auth/role-guard";

// Mock data for analytics
const mockDashboardMetrics = {
  totalRevenue: 42568.97,
  totalOrders: 1243,
  activeUsers: 856,
  conversionRate: 3.2,
  topProducts: [
    { id: 1, name: "Professional LED Nail Lamp", sales: 156, revenue: 12480.0 },
    {
      id: 2,
      name: "Premium Nail Polish Collection",
      sales: 243,
      revenue: 8748.0,
    },
    { id: 3, name: "Cuticle Care Essential Kit", sales: 198, revenue: 5940.0 },
    {
      id: 4,
      name: "Professional Nail File Bundle",
      sales: 312,
      revenue: 4680.0,
    },
    { id: 5, name: "Nail Art Brush Set - Deluxe", sales: 134, revenue: 3350.0 },
  ],
  salesByCategory: [
    { category: "Nail Polish", sales: 18750.45, percentage: 44.05 },
    { category: "Nail Care", sales: 12340.23, percentage: 29.0 },
    { category: "Tools", sales: 6789.12, percentage: 15.95 },
    { category: "Equipment", sales: 3456.78, percentage: 8.12 },
    { category: "Kits & Bundles", sales: 1232.39, percentage: 2.88 },
  ],
  lastUpdated: new Date(),
};

const mockRealtimeMetrics = {
  onlineUsers: 78,
  activeOrders: 12,
  todayRevenue: 2345.67,
  conversionRate: 4.2,
};

const mockRevenueData = {
  daily: Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      revenue: Math.random() * 2000 + 500,
    };
  }),
  weekly: Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (11 - i) * 7);
    return {
      date: `Week ${i + 1}`,
      revenue: Math.random() * 10000 + 3000,
    };
  }),
  monthly: Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - i));
    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
      revenue: Math.random() * 50000 + 15000,
    };
  }),
};

const mockUserAnalytics = {
  retention: 68.5,
  acquisitionSources: [
    { source: "Direct", users: 235, percentage: 35.2 },
    { source: "Social Media", users: 189, percentage: 28.3 },
    { source: "Google", users: 156, percentage: 23.4 },
    { source: "Email", users: 87, percentage: 13.1 },
  ],
  demographics: [
    { age: "18-24", percentage: 21 },
    { age: "25-34", percentage: 38 },
    { age: "35-44", percentage: 24 },
    { age: "45-54", percentage: 12 },
    { age: "55+", percentage: 5 },
  ],
  userGrowth: Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - i));
    return {
      date: date.toLocaleDateString("en-US", { month: "short" }),
      newUsers: Math.floor(Math.random() * 100 + 50),
      totalUsers: Math.floor(Math.random() * 500 + 1000 + i * 100),
    };
  }),
};

const mockProductPerformance = {
  viewsToCart: 24.3,
  cartToCheckout: 62.8,
  checkoutToComplete: 85.2,
  productViews: [
    { product: "Professional LED Nail Lamp", views: 3245 },
    { product: "Premium Nail Polish Collection", views: 2876 },
    { product: "Cuticle Care Essential Kit", views: 2543 },
    { product: "Professional Nail File Bundle", views: 2187 },
    { product: "Nail Art Brush Set - Deluxe", views: 1954 },
  ],
};

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState("daily");
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardMetrics, setDashboardMetrics] =
    useState(mockDashboardMetrics);
  const [realtimeMetrics, setRealtimeMetrics] = useState(mockRealtimeMetrics);
  const [revenueData, setRevenueData] = useState(mockRevenueData.daily);
  const [userAnalytics, setUserAnalytics] = useState(mockUserAnalytics);
  const [productPerformance, setProductPerformance] = useState(
    mockProductPerformance,
  );

  useEffect(() => {
    // In a real implementation, we would fetch data from the API
    // For now, we'll just use the mock data
    switch (timeframe) {
      case "weekly":
        setRevenueData(mockRevenueData.weekly);
        break;
      case "monthly":
        setRevenueData(mockRevenueData.monthly);
        break;
      default:
        setRevenueData(mockRevenueData.daily);
    }
  }, [timeframe]);

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage.toFixed(1)}%`;
  };

  return (
    <RoleGuard allowedRoles={["ADMIN", "MANAGER"]}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Analytics Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Comprehensive analytics and reporting for your business
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                  <Download className="h-4 w-4 mr-2 text-gray-600" />
                  <span>Export Report</span>
                </button>
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
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Time Range Selector */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="daily">Last 30 Days</option>
                <option value="weekly">Last 12 Weeks</option>
                <option value="monthly">Last 12 Months</option>
              </select>
              <div className="text-sm text-gray-500">
                Last updated: {dashboardMetrics.lastUpdated.toLocaleString()}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                <Filter className="h-4 w-4 mr-2 text-gray-600" />
                <span>Filters</span>
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-600" />
                <span>Custom Range</span>
              </button>
            </div>
          </div>

          {/* Realtime Metrics */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Realtime Metrics
              </h2>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span>Live</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 border border-gray-100 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-gray-500">
                    Online Users
                  </div>
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {realtimeMetrics.onlineUsers}
                </div>
              </div>
              <div className="p-4 border border-gray-100 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-gray-500">
                    Active Orders
                  </div>
                  <ShoppingBag className="h-5 w-5 text-purple-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {realtimeMetrics.activeOrders}
                </div>
              </div>
              <div className="p-4 border border-gray-100 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-gray-500">
                    Today's Revenue
                  </div>
                  <DollarSign className="h-5 w-5 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(realtimeMetrics.todayRevenue)}
                </div>
              </div>
              <div className="p-4 border border-gray-100 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-gray-500">
                    Conversion Rate
                  </div>
                  <Percent className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatPercentage(realtimeMetrics.conversionRate)}
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Revenue Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">
                  Total Revenue
                </h3>
                <div className="p-2 rounded-full bg-green-100">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(dashboardMetrics.totalRevenue)}
                  </p>
                  <div className="flex items-center mt-2 text-green-600">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">
                      12.5% from previous period
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Orders Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">
                  Total Orders
                </h3>
                <div className="p-2 rounded-full bg-blue-100">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatNumber(dashboardMetrics.totalOrders)}
                  </p>
                  <div className="flex items-center mt-2 text-green-600">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">
                      8.3% from previous period
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Users Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">
                  Active Users
                </h3>
                <div className="p-2 rounded-full bg-purple-100">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatNumber(dashboardMetrics.activeUsers)}
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

            {/* Conversion Rate Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">
                  Conversion Rate
                </h3>
                <div className="p-2 rounded-full bg-yellow-100">
                  <Percent className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPercentage(dashboardMetrics.conversionRate)}
                  </p>
                  <div className="flex items-center mt-2 text-red-600">
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">
                      0.8% from previous period
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Revenue Chart */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Revenue Over Time
                </h2>
                <div className="flex items-center">
                  <LineChart className="h-5 w-5 text-gray-400 mr-2" />
                  <select
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="text-sm border-none focus:ring-0"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <div className="h-80 w-full">
                {/* This would be a chart component in a real implementation */}
                <div className="h-full w-full flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <LineChart className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">Revenue Chart Visualization</p>
                    <p className="text-sm text-gray-400">
                      (In a real implementation, this would be a chart showing
                      revenue over time)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sales by Category */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Sales by Category
                </h2>
                <PieChart className="h-5 w-5 text-gray-400" />
              </div>

              <div className="h-80 w-full">
                {/* This would be a chart component in a real implementation */}
                <div className="h-64 w-full flex items-center justify-center bg-gray-50 rounded-lg mb-4">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">Category Distribution</p>
                    <p className="text-sm text-gray-400">
                      (In a real implementation, this would be a pie chart)
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {dashboardMetrics.salesByCategory
                    .slice(0, 3)
                    .map((category, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-3 h-3 rounded-full mr-2 ${
                              index === 0
                                ? "bg-blue-500"
                                : index === 1
                                  ? "bg-green-500"
                                  : index === 2
                                    ? "bg-yellow-500"
                                    : "bg-purple-500"
                            }`}
                          ></div>
                          <span className="text-sm text-gray-700">
                            {category.category}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {formatPercentage(category.percentage)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* User Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* User Growth */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  User Growth
                </h2>
                <div className="flex items-center">
                  <BarChart3 className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-500">Last 12 months</span>
                </div>
              </div>

              <div className="h-80 w-full">
                {/* This would be a chart component in a real implementation */}
                <div className="h-full w-full flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">User Growth Visualization</p>
                    <p className="text-sm text-gray-400">
                      (In a real implementation, this would be a bar chart
                      showing user growth)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* User Acquisition */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  User Acquisition
                </h2>
                <UserPlus className="h-5 w-5 text-gray-400" />
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Retention Rate</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatPercentage(userAnalytics.retention)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${userAnalytics.retention}%` }}
                  ></div>
                </div>
              </div>

              <h3 className="text-sm font-medium text-gray-700 mb-4">
                Acquisition Sources
              </h3>
              <div className="space-y-4">
                {userAnalytics.acquisitionSources.map((source, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">
                        {source.source}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatPercentage(source.percentage)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          index === 0
                            ? "bg-blue-500"
                            : index === 1
                              ? "bg-purple-500"
                              : index === 2
                                ? "bg-yellow-500"
                                : "bg-green-500"
                        }`}
                        style={{ width: `${source.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Conversion Funnel */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Conversion Funnel
                </h2>
                <Share2 className="h-5 w-5 text-gray-400" />
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">
                      Product Views to Cart
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatPercentage(productPerformance.viewsToCart)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full"
                      style={{ width: `${productPerformance.viewsToCart}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">
                      Cart to Checkout
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatPercentage(productPerformance.cartToCheckout)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-purple-500 h-3 rounded-full"
                      style={{ width: `${productPerformance.cartToCheckout}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">
                      Checkout to Complete
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatPercentage(productPerformance.checkoutToComplete)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full"
                      style={{
                        width: `${productPerformance.checkoutToComplete}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full">
                  <span className="text-sm font-medium">
                    Overall Conversion: 12.9%
                  </span>
                </div>
              </div>
            </div>

            {/* Top Products by Views */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Top Products by Views
                </h2>
                <Eye className="h-5 w-5 text-gray-400" />
              </div>

              <div className="space-y-4">
                {productPerformance.productViews.map((product, index) => (
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
                        {product.product}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-700">
                        {formatNumber(product.views)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Products Table */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Top Selling Products
              </h2>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
                View All Products
                <ChevronDown className="h-4 w-4 ml-1" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sales
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trend
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dashboardMetrics.topProducts.map((product, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatNumber(product.sales)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatCurrency(product.revenue)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-green-600">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          <span className="text-sm">12%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Export Options */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Export Reports
              </h2>
              <Download className="h-5 w-5 text-gray-400" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center justify-center">
                <div className="p-3 bg-blue-100 rounded-full mb-3">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-900">
                  Sales Report
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  CSV, PDF, Excel
                </span>
              </button>

              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center justify-center">
                <div className="p-3 bg-purple-100 rounded-full mb-3">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-900">
                  User Analytics
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  CSV, PDF, Excel
                </span>
              </button>

              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center justify-center">
                <div className="p-3 bg-green-100 rounded-full mb-3">
                  <ShoppingBag className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-900">
                  Product Performance
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  CSV, PDF, Excel
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
