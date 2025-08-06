'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  TrendingUp, 
  ShoppingCart, 
  FileText, 
  Users, 
  Package, 
  DollarSign,
  Calendar,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Download
} from 'lucide-react';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  activeQuotes: number;
  customerCount: number;
  topProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customer: string;
    total: number;
    status: string;
    date: string;
  }>;
  monthlyStats: Array<{
    month: string;
    orders: number;
    revenue: number;
  }>;
}

interface B2BDashboardProps {
  userRole: 'CUSTOMER' | 'PROFESSIONAL' | 'MANAGER' | 'ADMIN';
  userId: string;
}

export default function B2BDashboard({ userRole, userId }: B2BDashboardProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const mockStats: DashboardStats = {
        totalOrders: 156,
        totalRevenue: 45280.50,
        activeQuotes: 12,
        customerCount: 89,
        topProducts: [
          { id: '1', name: 'Professional Nail Polish Set', sales: 45, revenue: 2250 },
          { id: '2', name: 'UV LED Nail Lamp', sales: 23, revenue: 3450 },
          { id: '3', name: 'Cuticle Care Kit', sales: 67, revenue: 1340 },
          { id: '4', name: 'Gel Base Coat', sales: 89, revenue: 1780 },
        ],
        recentOrders: [
          { id: '1', orderNumber: 'TB202412001', customer: 'Beauty Salon Zagreb', total: 450.00, status: 'DELIVERED', date: '2024-12-15' },
          { id: '2', orderNumber: 'TB202412002', customer: 'Nail Studio Split', total: 280.50, status: 'SHIPPED', date: '2024-12-14' },
          { id: '3', orderNumber: 'TB202412003', customer: 'Spa Wellness Rijeka', total: 720.00, status: 'PROCESSING', date: '2024-12-13' },
          { id: '4', orderNumber: 'TB202412004', customer: 'Beauty Center Osijek', total: 195.75, status: 'PENDING', date: '2024-12-12' },
        ],
        monthlyStats: [
          { month: 'Jan', orders: 45, revenue: 12500 },
          { month: 'Feb', orders: 52, revenue: 14200 },
          { month: 'Mar', orders: 48, revenue: 13800 },
          { month: 'Apr', orders: 61, revenue: 16900 },
          { month: 'May', orders: 58, revenue: 15600 },
          { month: 'Jun', orders: 67, revenue: 18200 },
        ],
      };
      
      setStats(mockStats);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'text-green-600 bg-green-100';
      case 'SHIPPED': return 'text-blue-600 bg-blue-100';
      case 'PROCESSING': return 'text-yellow-600 bg-yellow-100';
      case 'PENDING': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {userRole === 'ADMIN' ? 'Admin Dashboard' : 
             userRole === 'MANAGER' ? 'Manager Dashboard' : 
             'B2B Dashboard'}
          </h1>
          <p className="text-gray-600">
            Welcome back! Here's what's happening with your business.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button leftIcon={<Download className="h-4 w-4" />}>
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">+12.5%</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">€{stats.totalRevenue.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">+8.2%</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Quotes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeQuotes}</p>
                <div className="flex items-center mt-1">
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-600">-2.1%</span>
                </div>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <FileText className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Customers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.customerCount}</p>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">+5.7%</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Top Products</h2>
              <Button variant="ghost" size="sm" leftIcon={<Eye className="h-4 w-4" />}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {stats.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-600">
                          {index + 1}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.sales} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      €{product.revenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <Button variant="ghost" size="sm" leftIcon={<Eye className="h-4 w-4" />}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{order.orderNumber}</p>
                    <p className="text-xs text-gray-500">{order.customer}</p>
                    <p className="text-xs text-gray-400">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      €{order.total.toFixed(2)}
                    </p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-500">Monthly Performance</span>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <div className="h-64 flex items-end justify-between space-x-2">
            {stats.monthlyStats.map((stat, index) => (
              <div key={stat.month} className="flex flex-col items-center flex-1">
                <div
                  className="w-full bg-primary-600 rounded-t-md transition-all duration-300 hover:bg-primary-700"
                  style={{
                    height: `${(stat.revenue / Math.max(...stats.monthlyStats.map(s => s.revenue))) * 200}px`,
                    minHeight: '20px'
                  }}
                  title={`${stat.month}: €${stat.revenue.toLocaleString()}`}
                />
                <div className="mt-2 text-center">
                  <p className="text-xs font-medium text-gray-900">{stat.month}</p>
                  <p className="text-xs text-gray-500">€{(stat.revenue / 1000).toFixed(1)}k</p>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="secondary"
              fullWidth
              leftIcon={<FileText className="h-4 w-4" />}
            >
              Create New Quote
            </Button>
            <Button
              variant="secondary"
              fullWidth
              leftIcon={<Package className="h-4 w-4" />}
            >
              Manage Inventory
            </Button>
            <Button
              variant="secondary"
              fullWidth
              leftIcon={<Users className="h-4 w-4" />}
            >
              Customer Management
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}