"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
} from "lucide-react";

// Mock data - in a real app, this would come from API
const mockOrders = [
  {
    id: "ORD-123456",
    orderNumber: "ORD-123456",
    date: "2024-01-10",
    status: "Processing",
    paymentStatus: "Paid",
    total: 89.99,
    items: [
      { name: "Nail Polish Set", quantity: 2, price: 29.99 },
      { name: "Cuticle Oil", quantity: 1, price: 15.99 },
      { name: "Nail File Kit", quantity: 1, price: 14.01 },
    ],
    shippingAddress: {
      name: "John Doe",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    trackingNumber: null,
  },
  {
    id: "ORD-123455",
    orderNumber: "ORD-123455",
    date: "2024-01-05",
    status: "Delivered",
    paymentStatus: "Paid",
    total: 156.5,
    items: [
      { name: "Professional Nail Kit", quantity: 1, price: 89.99 },
      { name: "LED Nail Lamp", quantity: 1, price: 66.51 },
    ],
    shippingAddress: {
      name: "John Doe",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    trackingNumber: "TRK123456789",
  },
  {
    id: "ORD-123454",
    orderNumber: "ORD-123454",
    date: "2023-12-28",
    status: "Delivered",
    paymentStatus: "Paid",
    total: 75.25,
    items: [
      { name: "Nail Art Brushes", quantity: 3, price: 19.99 },
      { name: "Base Coat", quantity: 1, price: 15.28 },
    ],
    shippingAddress: {
      name: "John Doe",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    trackingNumber: "TRK987654321",
  },
  {
    id: "ORD-123453",
    orderNumber: "ORD-123453",
    date: "2023-12-15",
    status: "Cancelled",
    paymentStatus: "Refunded",
    total: 45.99,
    items: [{ name: "Nail Stickers", quantity: 2, price: 22.99 }],
    shippingAddress: {
      name: "John Doe",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    trackingNumber: null,
  },
];

const statusOptions = [
  "All",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState(mockOrders);
  const [filteredOrders, setFilteredOrders] = useState(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Fetch orders from API
  }, []);

  useEffect(() => {
    let filtered = orders;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.items.some((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }

    // Filter by status
    if (statusFilter !== "All") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter]);

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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "processing":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "shipped":
        return <Truck className="h-5 w-5 text-blue-500" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
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

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track and manage your orders
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="sm:w-48">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No orders found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== "All"
                ? "Try adjusting your search or filter criteria."
                : "You haven't placed any orders yet."}
            </p>
            {!searchTerm && statusFilter === "All" && (
              <div className="mt-6">
                <Link
                  href="/products"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white shadow rounded-lg overflow-hidden"
            >
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(order.status)}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Order #{order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Placed on {formatDate(order.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-lg font-medium text-gray-900">
                        {formatCurrency(order.total)}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            order.status,
                          )}`}
                        >
                          {order.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleOrderExpansion(order.id)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      {expandedOrder === order.id ? "Hide" : "View"} Details
                    </button>
                  </div>
                </div>

                {/* Expanded Order Details */}
                {expandedOrder === order.id && (
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Order Items */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">
                          Items ({order.items.length})
                        </h4>
                        <div className="space-y-3">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {item.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Quantity: {item.quantity}
                                </p>
                              </div>
                              <p className="text-sm font-medium text-gray-900">
                                {formatCurrency(item.price)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping & Tracking */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">
                          Shipping Information
                        </h4>
                        <div className="text-sm text-gray-600">
                          <p>{order.shippingAddress.name}</p>
                          <p>{order.shippingAddress.street}</p>
                          <p>
                            {order.shippingAddress.city},{" "}
                            {order.shippingAddress.state}{" "}
                            {order.shippingAddress.zipCode}
                          </p>
                          <p>{order.shippingAddress.country}</p>
                        </div>

                        {order.trackingNumber && (
                          <div className="mt-4">
                            <h5 className="text-sm font-medium text-gray-900 mb-2">
                              Tracking Information
                            </h5>
                            <div className="flex items-center space-x-2">
                              <Truck className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                Tracking #: {order.trackingNumber}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex flex-wrap gap-3">
                      {order.status === "Delivered" && (
                        <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          Reorder Items
                        </button>
                      )}
                      {order.trackingNumber && (
                        <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          Track Package
                        </button>
                      )}
                      <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Download Invoice
                      </button>
                      {order.status === "Processing" && (
                        <button className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
