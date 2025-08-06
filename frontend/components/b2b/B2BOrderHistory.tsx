'use client';

import { useState, useEffect } from 'react';
import { 
  Package, 
  Calendar, 
  Eye, 
  Download, 
  RefreshCw,
  Truck,
  CheckCircle,
  AlertCircle,
  Clock,
  Search,
  Filter
} from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  itemCount: number;
  orderDate: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  items: OrderItem[];
  shippingAddress: {
    company: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

interface OrderItem {
  id: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  imageUrl?: string;
}

export default function B2BOrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Mock data for now - replace with actual API call
      setOrders([
        {
          id: '1',
          orderNumber: 'TB-2025-001',
          status: 'delivered',
          total: 2150.00,
          itemCount: 15,
          orderDate: '2025-01-15',
          estimatedDelivery: '2025-01-22',
          trackingNumber: 'TRK123456789',
          items: [
            {
              id: '1',
              productName: 'Professional Nail Polish Set',
              sku: 'TNP001',
              quantity: 10,
              unitPrice: 38.99,
              totalPrice: 389.90,
              imageUrl: '/images/products/nail-polish-set.jpg'
            },
            {
              id: '2',
              productName: 'UV Gel Base Coat',
              sku: 'TNP002',
              quantity: 5,
              unitPrice: 24.23,
              totalPrice: 121.15
            }
          ],
          shippingAddress: {
            company: 'Beauty Salon Pro',
            street: '123 Main Street',
            city: 'New York',
            postalCode: '10001',
            country: 'USA'
          }
        },
        {
          id: '2',
          orderNumber: 'TB-2025-002',
          status: 'shipped',
          total: 3420.50,
          itemCount: 25,
          orderDate: '2025-01-18',
          estimatedDelivery: '2025-01-25',
          trackingNumber: 'TRK987654321',
          items: [],
          shippingAddress: {
            company: 'Nail Art Studio',
            street: '456 Beauty Ave',
            city: 'Los Angeles',
            postalCode: '90210',
            country: 'USA'
          }
        },
        {
          id: '3',
          orderNumber: 'TB-2025-003',
          status: 'processing',
          total: 1875.00,
          itemCount: 12,
          orderDate: '2025-01-20',
          estimatedDelivery: '2025-01-27',
          items: [],
          shippingAddress: {
            company: 'Elite Beauty Center',
            street: '789 Glamour St',
            city: 'Miami',
            postalCode: '33101',
            country: 'USA'
          }
        }
      ]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'processing':
        return <RefreshCw className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.shippingAddress.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    let matchesDate = true;
    if (dateRange !== 'all') {
      const orderDate = new Date(order.orderDate);
      const now = new Date();
      const daysAgo = parseInt(dateRange);
      const cutoffDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
      matchesDate = orderDate >= cutoffDate;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleReorder = async (orderId: string) => {
    try {
      console.log('Reordering:', orderId);
      alert('Items added to cart for reorder!');
    } catch (error) {
      console.error('Error reordering:', error);
    }
  };

  const handleDownloadInvoice = (orderNumber: string) => {
    console.log('Downloading invoice for:', orderNumber);
    // Implement PDF invoice download logic
  };

  const handleTrackOrder = (trackingNumber: string) => {
    console.log('Tracking order:', trackingNumber);
    // Open tracking page or modal
    window.open(`https://tracking-service.com/track/${trackingNumber}`, '_blank');
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
        <p className="text-gray-600">Track and manage your bulk orders</p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:space-x-4">
        {/* Search */}
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by order number or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Date Range Filter */}
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-gray-400" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Time</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="365">Last year</option>
          </select>
        </div>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Orders', value: orders.length, color: 'blue' },
          { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, color: 'green' },
          { label: 'In Transit', value: orders.filter(o => o.status === 'shipped').length, color: 'purple' },
          { label: 'Processing', value: orders.filter(o => o.status === 'processing').length, color: 'yellow' }
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                <Package className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all' || dateRange !== 'all' 
              ? 'Try adjusting your filters to see more results.'
              : 'You have no orders yet.'}
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <div key={order.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Order {order.orderNumber}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{order.shippingAddress.company}</span>
                        <span>•</span>
                        <span>{order.itemCount} items</span>
                        <span>•</span>
                        <span>{order.orderDate}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        €{order.total.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {order.estimatedDelivery && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center text-sm text-blue-800">
                      <Truck className="h-4 w-4 mr-2" />
                      {order.status === 'delivered' 
                        ? `Delivered on ${order.estimatedDelivery}` 
                        : `Estimated delivery: ${order.estimatedDelivery}`}
                      {order.trackingNumber && (
                        <button
                          onClick={() => handleTrackOrder(order.trackingNumber!)}
                          className="ml-2 underline hover:no-underline"
                        >
                          Track package
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    <p>Ship to: {order.shippingAddress.company}</p>
                    <p>{order.shippingAddress.street}, {order.shippingAddress.city}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </button>
                    
                    <button
                      onClick={() => handleDownloadInvoice(order.orderNumber)}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Invoice
                    </button>

                    {order.status === 'delivered' && (
                      <button
                        onClick={() => handleReorder(order.id)}
                        className="inline-flex items-center px-3 py-1 border border-blue-300 rounded-md text-sm text-blue-700 bg-blue-50 hover:bg-blue-100"
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Reorder
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Order {selectedOrder.orderNumber}
                  </h2>
                  <p className="text-gray-500">Placed on {selectedOrder.orderDate}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-gray-600"
                    title="Close"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">{selectedOrder.shippingAddress.company}</p>
                  <p>{selectedOrder.shippingAddress.street}</p>
                  <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
                  <p>{selectedOrder.shippingAddress.country}</p>
                </div>
              </div>

              {/* Order Items */}
              {selectedOrder.items.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        {item.imageUrl && (
                          <div className="flex-shrink-0 w-16 h-16">
                            <img 
                              src={item.imageUrl} 
                              alt={item.productName}
                              className="w-full h-full object-cover rounded"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/images/products/placeholder.jpg';
                              }}
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.productName}</h4>
                          <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity} × €{item.unitPrice.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            €{item.totalPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Order Value:</span>
                  <span>€{selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => handleDownloadInvoice(selectedOrder.orderNumber)}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download Invoice
                </button>
                
                {selectedOrder.status === 'delivered' && (
                  <button
                    onClick={() => {
                      handleReorder(selectedOrder.id);
                      setSelectedOrder(null);
                    }}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <RefreshCw className="h-5 w-5 mr-2" />
                    Reorder Items
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
