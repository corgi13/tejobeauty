"use client";

import React, { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
  Eye,
  Filter,
  ChevronDown,
  ChevronUp,
  Award,
  Target,
  Clock,
} from "lucide-react";

// Mock commission data
const mockCommissionData = {
  currentMonth: {
    totalEarned: 1247.83,
    totalSales: 8318.87,
    commissionRate: 15,
    ordersCount: 23,
    status: "active",
  },
  yearToDate: {
    totalEarned: 8934.56,
    totalSales: 59563.73,
    averageMonthly: 1490.76,
    ordersCount: 156,
  },
  nextPayment: {
    amount: 1247.83,
    date: "2024-02-01",
    status: "pending",
  },
};

const mockCommissionHistory = [
  {
    id: "COM-2024-01",
    period: "January 2024",
    orderId: "ORD-123456",
    customerName: "Sarah Johnson",
    orderDate: "2024-01-28",
    orderTotal: 156.5,
    commissionRate: 15,
    commissionAmount: 23.48,
    status: "paid",
    paidDate: "2024-02-01",
    products: [
      { name: "Premium Nail Polish Set", quantity: 2, price: 29.99 },
      { name: "Cuticle Care Oil", quantity: 3, price: 15.99 },
      { name: "Professional Nail File Kit", quantity: 1, price: 24.99 },
    ],
  },
  {
    id: "COM-2024-02",
    period: "January 2024",
    orderId: "ORD-123455",
    customerName: "Emily Davis",
    orderDate: "2024-01-25",
    orderTotal: 89.99,
    commissionRate: 15,
    commissionAmount: 13.5,
    status: "paid",
    paidDate: "2024-02-01",
    products: [{ name: "LED Nail Lamp", quantity: 1, price: 89.99 }],
  },
  {
    id: "COM-2024-03",
    period: "January 2024",
    orderId: "ORD-123454",
    customerName: "Maria Rodriguez",
    orderDate: "2024-01-22",
    orderTotal: 245.75,
    commissionRate: 15,
    commissionAmount: 36.86,
    status: "pending",
    paidDate: null,
    products: [
      { name: "Professional Nail Kit Deluxe", quantity: 1, price: 189.99 },
      { name: "Nail Art Brush Set", quantity: 2, price: 27.88 },
    ],
  },
  {
    id: "COM-2024-04",
    period: "December 2023",
    orderId: "ORD-123453",
    customerName: "Jennifer Wilson",
    orderDate: "2023-12-28",
    orderTotal: 67.5,
    commissionRate: 12,
    commissionAmount: 8.1,
    status: "paid",
    paidDate: "2024-01-01",
    products: [
      { name: "Cuticle Pusher Set", quantity: 1, price: 19.99 },
      { name: "Nail Buffer Kit", quantity: 2, price: 23.76 },
    ],
  },
];

const mockCommissionTiers = [
  {
    minSales: 0,
    maxSales: 2000,
    rate: 10,
    label: "Bronze",
    color: "bg-orange-100 text-orange-800",
  },
  {
    minSales: 2000,
    maxSales: 5000,
    rate: 12,
    label: "Silver",
    color: "bg-gray-100 text-gray-800",
  },
  {
    minSales: 5000,
    maxSales: 10000,
    rate: 15,
    label: "Gold",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    minSales: 10000,
    maxSales: Infinity,
    rate: 18,
    label: "Platinum",
    color: "bg-purple-100 text-purple-800",
  },
];

export default function CommissionsPage() {
  const [commissionData] = useState(mockCommissionData);
  const [commissionHistory, setCommissionHistory] = useState(
    mockCommissionHistory,
  );
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");

  const getCurrentTier = () => {
    const currentSales = commissionData.yearToDate.totalSales;
    return (
      mockCommissionTiers.find(
        (tier) => currentSales >= tier.minSales && currentSales < tier.maxSales,
      ) || mockCommissionTiers[0]
    );
  };

  const getNextTier = () => {
    const currentTier = getCurrentTier();
    const currentIndex = mockCommissionTiers.findIndex(
      (tier) => tier.rate === currentTier.rate,
    );
    return currentIndex < mockCommissionTiers.length - 1
      ? mockCommissionTiers[currentIndex + 1]
      : null;
  };

  const toggleRowExpansion = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const filteredHistory = commissionHistory.filter((item) => {
    const statusMatch = statusFilter === "all" || item.status === statusFilter;
    const periodMatch = periodFilter === "all" || item.period === periodFilter;
    return statusMatch && periodMatch;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const currentTier = getCurrentTier();
  const nextTier = getNextTier();
  const progressToNextTier = nextTier
    ? ((commissionData.yearToDate.totalSales - currentTier.minSales) /
        (nextTier.minSales - currentTier.minSales)) *
      100
    : 100;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Commission Dashboard
        </h1>
        <p className="text-gray-600">
          Track your earnings, commission rates, and payment history
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(commissionData.currentMonth.totalEarned)}
              </p>
              <p className="text-sm text-gray-600">
                {commissionData.currentMonth.ordersCount} orders
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Year to Date</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(commissionData.yearToDate.totalEarned)}
              </p>
              <p className="text-sm text-gray-600">
                Avg: {formatCurrency(commissionData.yearToDate.averageMonthly)}
                /month
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Award className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Current Tier</p>
              <div className="flex items-center">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${currentTier.color}`}
                >
                  {currentTier.label}
                </span>
                <span className="ml-2 text-lg font-bold text-gray-900">
                  {currentTier.rate}%
                </span>
              </div>
              <p className="text-sm text-gray-600">Commission Rate</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Next Payment</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(commissionData.nextPayment.amount)}
              </p>
              <p className="text-sm text-gray-600">
                Due {formatDate(commissionData.nextPayment.date)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Commission Tier Progress */}
      {nextTier && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Commission Tier Progress
          </h2>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progress to {nextTier.label} ({nextTier.rate}%)
            </span>
            <span className="text-sm text-gray-600">
              {formatCurrency(commissionData.yearToDate.totalSales)} /{" "}
              {formatCurrency(nextTier.minSales)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-primary-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressToNextTier, 100)}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">
            {nextTier.minSales - commissionData.yearToDate.totalSales > 0 ? (
              <>
                Sell{" "}
                {formatCurrency(
                  nextTier.minSales - commissionData.yearToDate.totalSales,
                )}{" "}
                more to reach {nextTier.label} tier and increase your commission
                rate to {nextTier.rate}%
              </>
            ) : (
              "Congratulations! You've reached the highest tier."
            )}
          </p>
        </div>
      )}

      {/* Commission Tiers Table */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Commission Tiers
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sales Range
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockCommissionTiers.map((tier, index) => (
                <tr
                  key={index}
                  className={currentTier.rate === tier.rate ? "bg-blue-50" : ""}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tier.color}`}
                    >
                      {tier.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(tier.minSales)} -{" "}
                    {tier.maxSales === Infinity
                      ? "∞"
                      : formatCurrency(tier.maxSales)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {tier.rate}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {currentTier.rate === tier.rate ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Current
                      </span>
                    ) : commissionData.yearToDate.totalSales >=
                      tier.minSales ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Achieved
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                        Locked
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Commission History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Commission History
          </h2>
          <div className="flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
            </select>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHistory.map((commission) => (
                <React.Fragment key={commission.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {commission.orderId}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(commission.orderDate)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {commission.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(commission.orderTotal)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(commission.commissionAmount)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {commission.commissionRate}% rate
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(commission.status)}`}
                      >
                        {commission.status}
                      </span>
                      {commission.paidDate && (
                        <div className="text-xs text-gray-500 mt-1">
                          Paid {formatDate(commission.paidDate)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => toggleRowExpansion(commission.id)}
                        className="text-primary-600 hover:text-primary-900 flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        {expandedRows.has(commission.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                  {expandedRows.has(commission.id) && (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 bg-gray-50">
                        <div className="text-sm">
                          <h4 className="font-medium text-gray-900 mb-2">
                            Order Items:
                          </h4>
                          <div className="space-y-1">
                            {commission.products.map((product, index) => (
                              <div key={index} className="flex justify-between">
                                <span className="text-gray-600">
                                  {product.name} (x{product.quantity})
                                </span>
                                <span className="text-gray-900">
                                  {formatCurrency(
                                    product.price * product.quantity,
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {filteredHistory.length === 0 && (
          <div className="text-center py-8">
            <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">
              No commission records found for the selected filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
