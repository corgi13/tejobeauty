"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Eye,
  Edit,
  Printer,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Calendar,
  CreditCard,
  User,
} from "lucide-react";
import RoleGuard from "@/lib/auth/role-guard";

// Mock order data
const mockOrders = [
  {
    id: "ORD-2024-1234",
    customer: {
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      phone: "+1 (555) 123-4567",
    },
    date: "2024-07-17T09:24:32",
    total: 89.97,
    subtotal: 79.97,
    tax: 8.0,
    shipping: 2.0,
    discount: 0,
    status: "processing",
    paymentStatus: "paid",
    paymentMethod: "credit_card",
    shippingMethod: "standard",
    items: [
      {
        id: "1",
        name: "Premium Nail Polish - Ruby Red",
        sku: "NP-RR-001",
        quantity: 2,
        price: 12.99,
        total: 25.98,
      },
      {
        id: "2",
        name: "Cuticle Oil Treatment",
        sku: "CO-TR-042",
        quantity: 1,
        price: 24.99,
        total: 24.99,
      },
      {
        id: "3",
        name: "Professional Nail File Set",
        sku: "NF-PR-031",
        quantity: 1,
        price: 29.0,
        total: 29.0,
      },
    ],
    shippingAddress: {
      name: "Sarah Johnson",
      address: "123 Main St",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "United States",
    },
    billingAddress: {
      name: "Sarah Johnson",
      address: "123 Main St",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "United States",
    },
    notes: "",
  },
  {
    id: "ORD-2024-1233",
    customer: {
      name: "Michael Chen",
      email: "michael.chen@example.com",
      phone: "+1 (555) 987-6543",
    },
    date: "2024-07-17T08:12:15",
    total: 124.5,
    subtotal: 114.5,
    tax: 10.0,
    shipping: 0,
    discount: 0,
    status: "paid",
    paymentStatus: "paid",
    paymentMethod: "paypal",
    shippingMethod: "express",
    items: [
      {
        id: "1",
        name: "Professional LED Nail Lamp",
        sku: "NL-LED-089",
        quantity: 1,
        price: 79.99,
        total: 79.99,
      },
      {
        id: "2",
        name: "Nail Art Brush Set",
        sku: "NA-BR-001",
        quantity: 1,
        price: 34.51,
        total: 34.51,
      },
    ],
    shippingAddress: {
      name: "Michael Chen",
      address: "456 Oak Ave",
      city: "San Francisco",
      state: "CA",
      postalCode: "94107",
      country: "United States",
    },
    billingAddress: {
      name: "Michael Chen",
      address: "456 Oak Ave",
      city: "San Francisco",
      state: "CA",
      postalCode: "94107",
      country: "United States",
    },
    notes: "Please deliver to front desk",
  },
  {
    id: "ORD-2024-1232",
    customer: {
      name: "Emma Rodriguez",
      email: "emma.rodriguez@example.com",
      phone: "+1 (555) 234-5678",
    },
    date: "2024-07-16T19:45:22",
    total: 67.25,
    subtotal: 57.25,
    tax: 5.0,
    shipping: 5.0,
    discount: 0,
    status: "shipped",
    paymentStatus: "paid",
    paymentMethod: "credit_card",
    shippingMethod: "standard",
    items: [
      {
        id: "1",
        name: "Premium Nail Polish Collection",
        sku: "NP-COL-567",
        quantity: 1,
        price: 35.99,
        total: 35.99,
      },
      {
        id: "2",
        name: "Nail Polish Remover - Acetone Free",
        sku: "NPR-AF-001",
        quantity: 2,
        price: 8.99,
        total: 17.98,
      },
      {
        id: "3",
        name: "Cotton Pads",
        sku: "CP-STD-001",
        quantity: 1,
        price: 3.28,
        total: 3.28,
      },
    ],
    shippingAddress: {
      name: "Emma Rodriguez",
      address: "789 Pine St",
      city: "Chicago",
      state: "IL",
      postalCode: "60601",
      country: "United States",
    },
    billingAddress: {
      name: "Emma Rodriguez",
      address: "789 Pine St",
      city: "Chicago",
      state: "IL",
      postalCode: "60601",
      country: "United States",
    },
    notes: "",
    trackingNumber: "1Z999AA10123456784",
  },
  {
    id: "ORD-2024-1231",
    customer: {
      name: "David Kim",
      email: "david.kim@example.com",
      phone: "+1 (555) 876-5432",
    },
    date: "2024-07-16T16:30:45",
    total: 210.99,
    subtotal: 195.99,
    tax: 15.0,
    shipping: 0,
    discount: 0,
    status: "delivered",
    paymentStatus: "paid",
    paymentMethod: "credit_card",
    shippingMethod: "express",
    items: [
      {
        id: "1",
        name: "Professional Nail Kit Deluxe",
        sku: "NK-DLX-001",
        quantity: 1,
        price: 149.99,
        total: 149.99,
      },
      {
        id: "2",
        name: "Cuticle Care Essential Kit",
        sku: "CC-KIT-045",
        quantity: 1,
        price: 29.99,
        total: 29.99,
      },
      {
        id: "3",
        name: "Professional Nail File Bundle",
        sku: "NF-BUN-256",
        quantity: 1,
        price: 14.99,
        total: 14.99,
      },
    ],
    shippingAddress: {
      name: "David Kim",
      address: "101 Maple Dr",
      city: "Seattle",
      state: "WA",
      postalCode: "98101",
      country: "United States",
    },
    billingAddress: {
      name: "David Kim",
      address: "101 Maple Dr",
      city: "Seattle",
      state: "WA",
      postalCode: "98101",
      country: "United States",
    },
    notes: "",
    trackingNumber: "1Z999AA10123456785",
    deliveredDate: "2024-07-17T10:15:22",
  },
  {
    id: "ORD-2024-1230",
    customer: {
      name: "Lisa Patel",
      email: "lisa.patel@example.com",
      phone: "+1 (555) 345-6789",
    },
    date: "2024-07-16T14:22:18",
    total: 45.0,
    subtotal: 39.0,
    tax: 6.0,
    shipping: 0,
    discount: 0,
    status: "cancelled",
    paymentStatus: "refunded",
    paymentMethod: "credit_card",
    shippingMethod: "standard",
    items: [
      {
        id: "1",
        name: "Nail Art Brush Set - Deluxe",
        sku: "NA-BR-001",
        quantity: 1,
        price: 24.99,
        total: 24.99,
      },
      {
        id: "2",
        name: "Nail Stickers - Floral Collection",
        sku: "NS-FL-001",
        quantity: 2,
        price: 7.0,
        total: 14.0,
      },
    ],
    shippingAddress: {
      name: "Lisa Patel",
      address: "202 Elm St",
      city: "Boston",
      state: "MA",
      postalCode: "02108",
      country: "United States",
    },
    billingAddress: {
      name: "Lisa Patel",
      address: "202 Elm St",
      city: "Boston",
      state: "MA",
      postalCode: "02108",
      country: "United States",
    },
    notes: "Customer requested cancellation",
    cancelledDate: "2024-07-16T15:45:12",
    cancelReason: "Customer changed mind",
  },
  {
    id: "ORD-2024-1229",
    customer: {
      name: "James Wilson",
      email: "james.wilson@example.com",
      phone: "+1 (555) 456-7890",
    },
    date: "2024-07-15T11:34:56",
    total: 156.75,
    subtotal: 141.75,
    tax: 15.0,
    shipping: 0,
    discount: 0,
    status: "delivered",
    paymentStatus: "paid",
    paymentMethod: "credit_card",
    shippingMethod: "standard",
    items: [
      {
        id: "1",
        name: "Professional LED Nail Lamp",
        sku: "NL-LED-089",
        quantity: 1,
        price: 79.99,
        total: 79.99,
      },
      {
        id: "2",
        name: "Premium Nail Polish Set - 24 Colors",
        sku: "NP-PRO-24",
        quantity: 1,
        price: 61.76,
        total: 61.76,
      },
    ],
    shippingAddress: {
      name: "James Wilson",
      address: "303 Cedar Ln",
      city: "Austin",
      state: "TX",
      postalCode: "78701",
      country: "United States",
    },
    billingAddress: {
      name: "James Wilson",
      address: "303 Cedar Ln",
      city: "Austin",
      state: "TX",
      postalCode: "78701",
      country: "United States",
    },
    notes: "",
    trackingNumber: "1Z999AA10123456786",
    deliveredDate: "2024-07-16T14:22:45",
  },
  {
    id: "ORD-2024-1228",
    customer: {
      name: "Sophia Garcia",
      email: "sophia.garcia@example.com",
      phone: "+1 (555) 567-8901",
    },
    date: "2024-07-15T09:12:34",
    total: 92.5,
    subtotal: 82.5,
    tax: 10.0,
    shipping: 0,
    discount: 0,
    status: "processing",
    paymentStatus: "paid",
    paymentMethod: "paypal",
    shippingMethod: "standard",
    items: [
      {
        id: "1",
        name: "Cuticle Care Essential Kit",
        sku: "CC-KIT-045",
        quantity: 1,
        price: 29.99,
        total: 29.99,
      },
      {
        id: "2",
        name: "Premium Nail Polish - Sapphire Blue",
        sku: "NP-SB-002",
        quantity: 2,
        price: 12.99,
        total: 25.98,
      },
      {
        id: "3",
        name: "Premium Nail Polish - Ruby Red",
        sku: "NP-RR-001",
        quantity: 2,
        price: 12.99,
        total: 25.98,
      },
    ],
    shippingAddress: {
      name: "Sophia Garcia",
      address: "404 Birch Ave",
      city: "Miami",
      state: "FL",
      postalCode: "33101",
      country: "United States",
    },
    billingAddress: {
      name: "Sophia Garcia",
      address: "404 Birch Ave",
      city: "Miami",
      state: "FL",
      postalCode: "33101",
      country: "United States",
    },
    notes: "",
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Filter orders based on search, status, and date range
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" || order.status === selectedStatus;

    let matchesDateRange = true;
    const orderDate = new Date(order.date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateRange === "today") {
      matchesDateRange = orderDate.toDateString() === today.toDateString();
    } else if (dateRange === "yesterday") {
      matchesDateRange = orderDate.toDateString() === yesterday.toDateString();
    } else if (dateRange === "week") {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesDateRange = orderDate >= weekAgo;
    } else if (dateRange === "month") {
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      matchesDateRange = orderDate >= monthAgo;
    }

    return matchesSearch && matchesStatus && matchesDateRange;
  });

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === "date") {
      return sortOrder === "asc"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === "total") {
      return sortOrder === "asc" ? a.total - b.total : b.total - a.total;
    } else if (sortBy === "id") {
      return sortOrder === "asc"
        ? a.id.localeCompare(b.id)
        : b.id.localeCompare(a.id);
    }
    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleOrderSelect = (orderId: string) => {
    setSelectedOrder(orderId);
  };

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    setIsUpdatingStatus(true);

    // Simulate API call
    setTimeout(() => {
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order,
        ),
      );

      setSuccessMessage(`Order ${orderId} status updated to ${newStatus}`);
      setTimeout(() => setSuccessMessage(""), 3000);
      setIsUpdatingStatus(false);
    }, 1000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
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
      case "refunded":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processing":
        return <Clock className="h-5 w-5 text-blue-600" />;
      case "paid":
        return <CreditCard className="h-5 w-5 text-yellow-600" />;
      case "shipped":
        return <Truck className="h-5 w-5 text-purple-600" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "cancelled":
        return <X className="h-5 w-5 text-red-600" />;
      case "refunded":
        return <CreditCard className="h-5 w-5 text-orange-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "credit_card":
        return "Credit Card";
      case "paypal":
        return "PayPal";
      case "bank_transfer":
        return "Bank Transfer";
      default:
        return method;
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
                  Order Management
                </h1>
                <p className="text-sm text-gray-600">
                  View and manage customer orders
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                  <Printer className="h-4 w-4 mr-2 text-gray-600" />
                  <span>Print Orders</span>
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
            <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-md flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                {successMessage}
              </div>
              <button onClick={() => setSuccessMessage("")}>
                <X className="h-5 w-5 text-green-800" />
              </button>
            </div>
          )}

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search orders or customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full sm:w-64"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="processing">Processing</option>
                    <option value="paid">Paid</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                  <Filter className="h-4 w-4 mr-2 text-gray-600" />
                  <span>More Filters</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Orders List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div
                            className="flex items-center cursor-pointer"
                            onClick={() => handleSort("id")}
                          >
                            Order
                            {sortBy === "id" &&
                              (sortOrder === "asc" ? (
                                <ChevronUp className="h-4 w-4 ml-1" />
                              ) : (
                                <ChevronDown className="h-4 w-4 ml-1" />
                              ))}
                          </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div
                            className="flex items-center cursor-pointer"
                            onClick={() => handleSort("date")}
                          >
                            Date
                            {sortBy === "date" &&
                              (sortOrder === "asc" ? (
                                <ChevronUp className="h-4 w-4 ml-1" />
                              ) : (
                                <ChevronDown className="h-4 w-4 ml-1" />
                              ))}
                          </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div
                            className="flex items-center cursor-pointer"
                            onClick={() => handleSort("total")}
                          >
                            Total
                            {sortBy === "total" &&
                              (sortOrder === "asc" ? (
                                <ChevronUp className="h-4 w-4 ml-1" />
                              ) : (
                                <ChevronDown className="h-4 w-4 ml-1" />
                              ))}
                          </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentItems.map((order) => (
                        <tr
                          key={order.id}
                          className={`hover:bg-gray-50 ${selectedOrder === order.id ? "bg-blue-50" : ""}`}
                          onClick={() => handleOrderSelect(order.id)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-primary-600">
                              {order.id}
                            </div>
                            <div className="text-xs text-gray-500">
                              {order.items.length} items
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {order.customer.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {order.customer.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(order.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatCurrency(order.total)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleOrderExpansion(order.id);
                                }}
                                className="text-gray-400 hover:text-gray-600"
                                title="View details"
                              >
                                {expandedOrder === order.id ? (
                                  <ChevronUp className="h-5 w-5" />
                                ) : (
                                  <ChevronDown className="h-5 w-5" />
                                )}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Navigate to order detail page
                                }}
                                className="text-blue-600 hover:text-blue-900"
                                title="Edit order"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Print order
                                }}
                                className="text-gray-600 hover:text-gray-900"
                                title="Print order"
                              >
                                <Printer className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() =>
                        handlePageChange(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() =>
                        handlePageChange(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing{" "}
                        <span className="font-medium">
                          {indexOfFirstItem + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium">
                          {Math.min(indexOfLastItem, sortedOrders.length)}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium">
                          {sortedOrders.length}
                        </span>{" "}
                        orders
                      </p>
                    </div>
                    <div>
                      <nav
                        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                        aria-label="Pagination"
                      >
                        <button
                          onClick={() =>
                            handlePageChange(Math.max(1, currentPage - 1))
                          }
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <span className="sr-only">Previous</span>
                          <ChevronLeft className="h-5 w-5" />
                        </button>

                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }

                            return (
                              <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                  currentPage === pageNum
                                    ? "z-10 bg-primary-50 border-primary-500 text-primary-600"
                                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          },
                        )}

                        <button
                          onClick={() =>
                            handlePageChange(
                              Math.min(totalPages, currentPage + 1),
                            )
                          }
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <span className="sr-only">Next</span>
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="lg:col-span-1">
              {selectedOrder ? (
                (() => {
                  const order = orders.find((o) => o.id === selectedOrder);
                  if (!order) return null;

                  return (
                    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">
                          Order Details
                        </h2>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="border-t border-b py-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-gray-500">Order ID</div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.id}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-gray-500">Date</div>
                          <div className="text-sm text-gray-900">
                            {formatDate(order.date)}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            Payment Method
                          </div>
                          <div className="text-sm text-gray-900">
                            {getPaymentMethodLabel(order.paymentMethod)}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-2">
                          Customer
                        </h3>
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="h-6 w-6 text-gray-400" />
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {order.customer.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.customer.email}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.customer.phone}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-2">
                          Shipping Address
                        </h3>
                        <div className="text-sm text-gray-600">
                          <div>{order.shippingAddress.name}</div>
                          <div>{order.shippingAddress.address}</div>
                          <div>
                            {order.shippingAddress.city},{" "}
                            {order.shippingAddress.state}{" "}
                            {order.shippingAddress.postalCode}
                          </div>
                          <div>{order.shippingAddress.country}</div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-2">
                          Order Summary
                        </h3>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Subtotal</span>
                            <span className="text-gray-900">
                              {formatCurrency(order.subtotal)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Tax</span>
                            <span className="text-gray-900">
                              {formatCurrency(order.tax)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Shipping</span>
                            <span className="text-gray-900">
                              {formatCurrency(order.shipping)}
                            </span>
                          </div>
                          {order.discount > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Discount</span>
                              <span className="text-green-600">
                                -{formatCurrency(order.discount)}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between text-sm font-medium pt-2 border-t">
                            <span className="text-gray-900">Total</span>
                            <span className="text-gray-900">
                              {formatCurrency(order.total)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Order Actions */}
                      <div className="border-t pt-4">
                        <h3 className="text-sm font-medium text-gray-900 mb-3">
                          Update Order Status
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {order.status !== "processing" && (
                            <button
                              onClick={() =>
                                handleUpdateStatus(order.id, "processing")
                              }
                              disabled={isUpdatingStatus}
                              className="px-3 py-2 bg-blue-100 text-blue-800 rounded-md text-sm font-medium hover:bg-blue-200 flex items-center justify-center"
                            >
                              <Clock className="h-4 w-4 mr-1" />
                              Processing
                            </button>
                          )}
                          {order.status !== "paid" && (
                            <button
                              onClick={() =>
                                handleUpdateStatus(order.id, "paid")
                              }
                              disabled={isUpdatingStatus}
                              className="px-3 py-2 bg-yellow-100 text-yellow-800 rounded-md text-sm font-medium hover:bg-yellow-200 flex items-center justify-center"
                            >
                              <CreditCard className="h-4 w-4 mr-1" />
                              Paid
                            </button>
                          )}
                          {order.status !== "shipped" && (
                            <button
                              onClick={() =>
                                handleUpdateStatus(order.id, "shipped")
                              }
                              disabled={isUpdatingStatus}
                              className="px-3 py-2 bg-purple-100 text-purple-800 rounded-md text-sm font-medium hover:bg-purple-200 flex items-center justify-center"
                            >
                              <Truck className="h-4 w-4 mr-1" />
                              Shipped
                            </button>
                          )}
                          {order.status !== "delivered" && (
                            <button
                              onClick={() =>
                                handleUpdateStatus(order.id, "delivered")
                              }
                              disabled={isUpdatingStatus}
                              className="px-3 py-2 bg-green-100 text-green-800 rounded-md text-sm font-medium hover:bg-green-200 flex items-center justify-center"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Delivered
                            </button>
                          )}
                          {order.status !== "cancelled" && (
                            <button
                              onClick={() =>
                                handleUpdateStatus(order.id, "cancelled")
                              }
                              disabled={isUpdatingStatus}
                              className="px-3 py-2 bg-red-100 text-red-800 rounded-md text-sm font-medium hover:bg-red-200 flex items-center justify-center"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Additional Actions */}
                      <div className="flex space-x-2">
                        <button className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center">
                          <Printer className="h-4 w-4 mr-1" />
                          Print
                        </button>
                        <button className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No Order Selected
                  </h3>
                  <p className="text-gray-500">
                    Select an order to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
