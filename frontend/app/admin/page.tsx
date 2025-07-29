"use client";

import { useState } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import RoleGuard from "@/lib/auth/role-guard";
import {
  Users,
  ShoppingBag,
  Package,
  CreditCard,
  TrendingUp,
  Settings,
  UserCheck,
  Bell,
  Calendar,
  ChevronRight,
  Search,
  Filter,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  ShoppingCart,
  Star,
  Activity,
} from "lucide-react";

// Mock data for dashboard
const mockAnalytics = {
  revenue: {
    today: 1245.89,
    yesterday: 1089.34,
    weekToDate: 8976.45,
    monthToDate: 32456.78,
    percentChange: 14.3,
  },
  orders: {
    today: 28,
    yesterday: 23,
    weekToDate: 187,
    monthToDate: 743,
    percentChange: 21.7,
  },
  customers: {
    today: 15,
    yesterday: 12,
    weekToDate: 98,
    monthToDate: 412,
    percentChange: 8.3,
  },
  averageOrderValue: {
    today: 44.5,
    yesterday: 47.36,
    weekToDate: 48.0,
    monthToDate: 43.68,
    percentChange: -6.0,
  },
};

const mockRecentOrders = [
  {
    id: "ORD-2024-1234",
    customer: "Sarah Johnson",
    date: "2024-07-17T09:24:32",
    total: 89.97,
    status: "processing",
    items: 3,
  },
  {
    id: "ORD-2024-1233",
    customer: "Michael Chen",
    date: "2024-07-17T08:12:15",
    total: 124.5,
    status: "paid",
    items: 5,
  },
  {
    id: "ORD-2024-1232",
    customer: "Emma Rodriguez",
    date: "2024-07-16T19:45:22",
    total: 67.25,
    status: "shipped",
    items: 2,
  },
  {
    id: "ORD-2024-1231",
    customer: "David Kim",
    date: "2024-07-16T16:30:45",
    total: 210.99,
    status: "delivered",
    items: 7,
  },
  {
    id: "ORD-2024-1230",
    customer: "Lisa Patel",
    date: "2024-07-16T14:22:18",
    total: 45.0,
    status: "cancelled",
    items: 1,
  },
];

const mockInventoryAlerts = [
  {
    id: "P-1001",
    name: "Premium Nail Polish - Ruby Red",
    sku: "NP-RR-001",
    stock: 3,
    threshold: 10,
    status: "critical",
  },
  {
    id: "P-1042",
    name: "Cuticle Oil Treatment",
    sku: "CO-TR-042",
    stock: 8,
    threshold: 15,
    status: "warning",
  },
  {
    id: "P-2031",
    name: "Professional Nail File Set",
    sku: "NF-PR-031",
    stock: 12,
    threshold: 20,
    status: "warning",
  },
];

const mockPendingApprovals = [
  {
    id: "PRO-2024-089",
    businessName: "Elegant Nails Studio",
    ownerName: "Jennifer Wilson",
    submittedDate: "2024-07-15T10:24:32",
    type: "professional_verification",
  },
  {
    id: "REV-2024-156",
    productName: "Deluxe Nail Care Kit",
    customerName: "Robert Garcia",
    submittedDate: "2024-07-16T16:45:12",
    type: "review_approval",
  },
  {
    id: "REF-2024-023",
    orderNumber: "ORD-2024-1156",
    customerName: "Amanda Taylor",
    submittedDate: "2024-07-17T08:12:45",
    type: "refund_request",
  },
];

const mockTopProducts = [
  {
    id: "P-2089",
    name: "Professional LED Nail Lamp",
    sales: 156,
    revenue: 12480.0,
    rating: 4.8,
  },
  {
    id: "P-1567",
    name: "Premium Nail Polish Collection",
    sales: 243,
    revenue: 8748.0,
    rating: 4.9,
  },
  {
    id: "P-3045",
    name: "Cuticle Care Essential Kit",
    sales: 198,
    revenue: 5940.0,
    rating: 4.7,
  },
  {
    id: "P-2256",
    name: "Professional Nail File Bundle",
    sales: 312,
    revenue: 4680.0,
    rating: 4.6,
  },
];

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState("today");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "paid":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getInventoryStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "text-red-600";
      case "warning":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const getApprovalTypeIcon = (type: string) => {
    switch (type) {
      case "professional_verification":
        return <UserCheck className="h-5 w-5 text-blue-600" />;
      case "review_approval":
        return <Star className="h-5 w-5 text-yellow-600" />;
      case "refund_request":
        return <CreditCard className="h-5 w-5 text-red-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
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
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {user?.firstName || "Admin"} |{" "}
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <button
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                  title="Notifications"
                >
                  <Bell className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Analytics Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                title="Select date range"
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="custom">Custom Range</option>
              </select>
              <button
                onClick={handleRefresh}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                disabled={isRefreshing}
                title="Refresh analytics"
              >
                <RefreshCw
                  className={`h-5 w-5 text-gray-600 ${isRefreshing ? "animate-spin" : ""}`}
                />
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
                title="Filter analytics"
              >
                <Filter className="h-4 w-4 mr-2 text-gray-600" />
                <span>Filters</span>
              </button>
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
                title="Export analytics"
              >
                <Download className="h-4 w-4 mr-2 text-gray-600" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Revenue Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">Revenue</h3>
                <div className="p-2 rounded-full bg-green-100">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(mockAnalytics.revenue.today)}
                  </p>
                  <div
                    className={`flex items-center mt-2 ${mockAnalytics.revenue.percentChange >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {mockAnalytics.revenue.percentChange >= 0 ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingUp className="h-4 w-4 mr-1 transform rotate-180" />
                    )}
                    <span className="text-sm font-medium">
                      {Math.abs(mockAnalytics.revenue.percentChange)}% from
                      yesterday
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Orders Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">Orders</h3>
                <div className="p-2 rounded-full bg-blue-100">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockAnalytics.orders.today}
                  </p>
                  <div
                    className={`flex items-center mt-2 ${mockAnalytics.orders.percentChange >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {mockAnalytics.orders.percentChange >= 0 ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingUp className="h-4 w-4 mr-1 transform rotate-180" />
                    )}
                    <span className="text-sm font-medium">
                      {Math.abs(mockAnalytics.orders.percentChange)}% from
                      yesterday
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customers Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">
                  New Customers
                </h3>
                <div className="p-2 rounded-full bg-purple-100">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockAnalytics.customers.today}
                  </p>
                  <div
                    className={`flex items-center mt-2 ${mockAnalytics.customers.percentChange >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {mockAnalytics.customers.percentChange >= 0 ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingUp className="h-4 w-4 mr-1 transform rotate-180" />
                    )}
                    <span className="text-sm font-medium">
                      {Math.abs(mockAnalytics.customers.percentChange)}% from
                      yesterday
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Average Order Value Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">
                  Avg. Order Value
                </h3>
                <div className="p-2 rounded-full bg-yellow-100">
                  <Activity className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(mockAnalytics.averageOrderValue.today)}
                  </p>
                  <div
                    className={`flex items-center mt-2 ${mockAnalytics.averageOrderValue.percentChange >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {mockAnalytics.averageOrderValue.percentChange >= 0 ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingUp className="h-4 w-4 mr-1 transform rotate-180" />
                    )}
                    <span className="text-sm font-medium">
                      {Math.abs(mockAnalytics.averageOrderValue.percentChange)}%
                      from yesterday
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Recent Orders */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Recent Orders
                  </h2>
                  <a
                    href="/admin/orders"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                  >
                    View All
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </a>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockRecentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600 hover:text-primary-800">
                            <a href={`/admin/orders/${order.id}`}>{order.id}</a>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {order.customer}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(order.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(order.total)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                            >
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top Products */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Top Products
                  </h2>
                  <a
                    href="/admin/products"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                  >
                    View All
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </a>
                </div>

                <div className="space-y-4">
                  {mockTopProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center mr-4">
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {product.name}
                          </h3>
                          <div className="flex items-center mt-1">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400" />
                              <span className="text-xs text-gray-600 ml-1">
                                {product.rating}
                              </span>
                            </div>
                            <span className="mx-2 text-gray-300">|</span>
                            <span className="text-xs text-gray-600">
                              {product.sales} sold
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatCurrency(product.revenue)}
                        </div>
                        <div className="text-xs text-gray-500">Revenue</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <a
                    href="/admin/products/new"
                    className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <Package className="h-6 w-6 text-blue-600 mb-2" />
                    <span className="text-sm font-medium text-gray-900">
                      Add Product
                    </span>
                  </a>
                  <a
                    href="/admin/orders"
                    className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <ShoppingBag className="h-6 w-6 text-purple-600 mb-2" />
                    <span className="text-sm font-medium text-gray-900">
                      Process Orders
                    </span>
                  </a>
                  <a
                    href="/admin/users"
                    className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <Users className="h-6 w-6 text-green-600 mb-2" />
                    <span className="text-sm font-medium text-gray-900">
                      Manage Users
                    </span>
                  </a>
                  <a
                    href="/admin/analytics"
                    className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <TrendingUp className="h-6 w-6 text-yellow-600 mb-2" />
                    <span className="text-sm font-medium text-gray-900">
                      View Reports
                    </span>
                  </a>
                </div>
              </div>

              {/* Inventory Alerts */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Inventory Alerts
                  </h2>
                  <a
                    href="/admin/inventory"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                  >
                    View All
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </a>
                </div>

                <div className="space-y-3">
                  {mockInventoryAlerts.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 border border-gray-100 rounded-lg"
                    >
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                      </div>
                      <div
                        className={`text-sm font-medium ${getInventoryStatusColor(item.status)}`}
                      >
                        {item.stock} left
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Approvals */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Pending Approvals
                  </h2>
                  <a
                    href="/admin/approvals"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                  >
                    View All
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </a>
                </div>

                <div className="space-y-3">
                  {mockPendingApprovals.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start p-3 border border-gray-100 rounded-lg"
                    >
                      <div className="flex-shrink-0 mt-1">
                        {getApprovalTypeIcon(item.type)}
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-900">
                          {item.type === "professional_verification" &&
                            `New Professional: ${item.businessName}`}
                          {item.type === "review_approval" &&
                            `Product Review: ${item.productName}`}
                          {item.type === "refund_request" &&
                            `Refund Request: ${item.orderNumber}`}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {item.type === "professional_verification" &&
                            `From: ${item.ownerName}`}
                          {item.type === "review_approval" &&
                            `By: ${item.customerName}`}
                          {item.type === "refund_request" &&
                            `From: ${item.customerName}`}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Submitted: {formatDate(item.submittedDate)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calendar */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Calendar
                  </h2>
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <div className="text-3xl font-bold text-gray-900 my-2">
                    {new Date().getDate()}
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>3 orders to be shipped today</p>
                    <p>2 new product launches</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Navigation */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <a
              href="/admin/products"
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center justify-center"
            >
              <Package className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">
                Products
              </span>
            </a>
            <a
              href="/admin/orders"
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center justify-center"
            >
              <ShoppingBag className="h-8 w-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Orders</span>
            </a>
            <a
              href="/admin/users"
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center justify-center"
            >
              <Users className="h-8 w-8 text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Users</span>
            </a>
            <a
              href="/admin/professionals"
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center justify-center"
            >
              <UserCheck className="h-8 w-8 text-indigo-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">
                Professionals
              </span>
            </a>
            <a
              href="/admin/analytics"
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center justify-center"
            >
              <TrendingUp className="h-8 w-8 text-yellow-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">
                Analytics
              </span>
            </a>
            <a
              href="/admin/settings"
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center justify-center"
            >
              <Settings className="h-8 w-8 text-red-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">
                Settings
              </span>
            </a>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
