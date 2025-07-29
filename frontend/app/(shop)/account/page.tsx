"use client";

import { useState, useEffect } from "react";

// Force dynamic rendering
export const dynamic = "force-dynamic";
import Link from "next/link";
import {
  Package,
  MapPin,
  CreditCard,
  User,
  Calendar,
  DollarSign,
  Clock,
} from "lucide-react";

// Mock data - in a real app, this would come from API
const mockUser = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  memberSince: "2023-01-15",
};

const mockStats = {
  totalOrders: 12,
  totalSpent: 1250.0,
  pendingOrders: 2,
  recentOrderDate: "2024-01-10",
};

const mockRecentOrders = [
  {
    id: "ORD-123456",
    date: "2024-01-10",
    status: "Processing",
    total: 89.99,
    items: 3,
  },
  {
    id: "ORD-123455",
    date: "2024-01-05",
    status: "Delivered",
    total: 156.5,
    items: 5,
  },
  {
    id: "ORD-123454",
    date: "2023-12-28",
    status: "Delivered",
    total: 75.25,
    items: 2,
  },
];

const quickActions = [
  {
    name: "View Orders",
    description: "Track your order history and status",
    href: "/account/orders",
    icon: Package,
    color: "bg-blue-500",
  },
  {
    name: "Manage Addresses",
    description: "Update shipping and billing addresses",
    href: "/account/addresses",
    icon: MapPin,
    color: "bg-green-500",
  },
  {
    name: "Payment Methods",
    description: "Manage your saved payment methods",
    href: "/account/payment-methods",
    icon: CreditCard,
    color: "bg-purple-500",
  },
  {
    name: "Account Settings",
    description: "Update your profile and preferences",
    href: "/account/settings",
    icon: User,
    color: "bg-orange-500",
  },
];

export default function AccountDashboard() {
  const [user] = useState(mockUser);
  const [stats] = useState(mockStats);
  const [recentOrders] = useState(mockRecentOrders);

  useEffect(() => {
    // TODO: Fetch user data, stats, and recent orders from API
    // This would typically be done with a data fetching library like SWR or React Query
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                <User className="h-8 w-8 text-gray-600" />
              </div>
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user.firstName}!
              </h1>
              <p className="text-sm text-gray-500">
                Member since {formatDate(user.memberSince)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Orders
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.totalOrders}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Spent
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formatCurrency(stats.totalSpent)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pending Orders
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.pendingOrders}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Last Order
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formatDate(stats.recentOrderDate)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.name}
                  href={action.href}
                  className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div>
                    <span
                      className={`rounded-lg inline-flex p-3 ${action.color} text-white`}
                    >
                      <Icon className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      <span className="absolute inset-0" />
                      {action.name}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      {action.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Orders
            </h3>
            <Link
              href="/account/orders"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              View all orders
            </Link>
          </div>
          <div className="flow-root">
            <ul className="-my-5 divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <li key={order.id} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        Order #{order.id}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.date)} • {order.items} items
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          order.status,
                        )}`}
                      >
                        {order.status}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(order.total)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
