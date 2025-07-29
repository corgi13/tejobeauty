import React from "react";
import Link from "next/link";
import {
  Package,
  ShoppingBag,
  Users,
  UserCheck,
  TrendingUp,
  Settings,
} from "lucide-react";

export default function AdminPanel() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <Link
        href="/admin/products"
        className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center justify-center"
      >
        <Package className="h-8 w-8 text-blue-600 mb-2" />
        <span className="text-sm font-medium text-gray-900">Products</span>
      </Link>
      <Link
        href="/admin/orders"
        className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center justify-center"
      >
        <ShoppingBag className="h-8 w-8 text-purple-600 mb-2" />
        <span className="text-sm font-medium text-gray-900">Orders</span>
      </Link>
      <Link
        href="/admin/users"
        className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center justify-center"
      >
        <Users className="h-8 w-8 text-green-600 mb-2" />
        <span className="text-sm font-medium text-gray-900">Users</span>
      </Link>
      <Link
        href="/admin/professionals"
        className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center justify-center"
      >
        <UserCheck className="h-8 w-8 text-indigo-600 mb-2" />
        <span className="text-sm font-medium text-gray-900">Professionals</span>
      </Link>
      <Link
        href="/admin/analytics"
        className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center justify-center"
      >
        <TrendingUp className="h-8 w-8 text-yellow-600 mb-2" />
        <span className="text-sm font-medium text-gray-900">Analytics</span>
      </Link>
      <Link
        href="/admin/settings"
        className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center justify-center"
      >
        <Settings className="h-8 w-8 text-red-600 mb-2" />
        <span className="text-sm font-medium text-gray-900">Settings</span>
      </Link>
    </div>
  );
}
