'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Download,
  FileText,
  PieChart,
  Euro,
  Package,
  ShoppingCart,
  Users,
  Filter,
  RefreshCw
} from 'lucide-react';

interface ReportData {
  period: string;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  totalSavings: number;
  topProducts: ProductMetric[];
  ordersByMonth: MonthlyMetric[];
  tierDistribution: TierMetric[];
}

interface ProductMetric {
  productName: string;
  sku: string;
  quantity: number;
  revenue: number;
}

interface MonthlyMetric {
  month: string;
  orders: number;
  revenue: number;
}

interface TierMetric {
  tierName: string;
  customerCount: number;
  revenue: number;
  percentage: number;
}

export default function B2BReports() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('year');
  const [selectedReport, setSelectedReport] = useState('overview');

  useEffect(() => {
    fetchReportData();
  }, [selectedPeriod]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      // Mock data for now - replace with actual API call
      const mockData: ReportData = {
        period: selectedPeriod === 'year' ? '2024' : 'Last 30 Days',
        totalRevenue: 145750.00,
        totalOrders: 89,
        averageOrderValue: 1637.64,
        totalSavings: 18234.50,
        topProducts: [
          {
            productName: 'Professional Nail Polish Set',
            sku: 'TNP001',
            quantity: 245,
            revenue: 8950.55
          },
          {
            productName: 'UV Gel Base Coat',
            sku: 'TNP002',
            quantity: 189,
            revenue: 5386.50
          },
          {
            productName: 'Professional Nail Files',
            sku: 'TNP003',
            quantity: 156,
            revenue: 3586.44
          },
          {
            productName: 'LED Nail Lamp',
            sku: 'TNP005',
            quantity: 45,
            revenue: 4049.55
          },
          {
            productName: 'Cuticle Oil Premium',
            sku: 'TNP004',
            quantity: 312,
            revenue: 5850.00
          }
        ],
        ordersByMonth: [
          { month: 'Jan', orders: 8, revenue: 13450 },
          { month: 'Feb', orders: 6, revenue: 9890 },
          { month: 'Mar', orders: 12, revenue: 19650 },
          { month: 'Apr', orders: 9, revenue: 14750 },
          { month: 'May', orders: 11, revenue: 18900 },
          { month: 'Jun', orders: 7, revenue: 11500 },
          { month: 'Jul', orders: 10, revenue: 16800 },
          { month: 'Aug', orders: 8, revenue: 13200 },
          { month: 'Sep', orders: 9, revenue: 15400 },
          { month: 'Oct', orders: 9, revenue: 12210 }
        ],
        tierDistribution: [
          { tierName: 'Bronze', customerCount: 45, revenue: 58750, percentage: 40.3 },
          { tierName: 'Silver', customerCount: 28, revenue: 52100, percentage: 35.7 },
          { tierName: 'Gold', customerCount: 12, revenue: 29600, percentage: 20.3 },
          { tierName: 'Platinum', customerCount: 3, revenue: 5300, percentage: 3.6 }
        ]
      };

      setReportData(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching report data:', error);
      setLoading(false);
    }
  };

  const exportReport = (format: 'pdf' | 'csv' | 'excel') => {
    console.log(`Exporting report in ${format} format...`);
    // Implement export functionality
  };

  const refreshData = () => {
    fetchReportData();
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No data available</h3>
          <p className="mt-1 text-sm text-gray-500">Unable to load report data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">B2B Analytics & Reports</h1>
            <p className="text-gray-600">Comprehensive insights into your B2B sales performance</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={refreshData}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
              title="Refresh data"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
            
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              title="Select time period"
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 3 Months</option>
              <option value="year">Last 12 Months</option>
            </select>
          </div>
        </div>
      </div>

      {/* Report Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'overview', label: 'Overview', icon: BarChart3 },
              { key: 'products', label: 'Product Performance', icon: Package },
              { key: 'customers', label: 'Customer Tiers', icon: Users },
              { key: 'trends', label: 'Trends', icon: TrendingUp }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedReport(tab.key)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  selectedReport === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                €{reportData.totalRevenue.toLocaleString()}
              </p>
              <p className="text-xs text-green-600 mt-1">+12.5% vs last period</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Euro className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.totalOrders}</p>
              <p className="text-xs text-green-600 mt-1">+8.3% vs last period</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900">
                €{reportData.averageOrderValue.toLocaleString()}
              </p>
              <p className="text-xs text-green-600 mt-1">+3.8% vs last period</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Customer Savings</p>
              <p className="text-2xl font-bold text-gray-900">
                €{reportData.totalSavings.toLocaleString()}
              </p>
              <p className="text-xs text-orange-600 mt-1">Total discounts given</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <PieChart className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Report Content */}
      {selectedReport === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Revenue Chart */}
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Revenue Trend</h3>
            <div className="space-y-3">
              {reportData.ordersByMonth.map((month, index) => (
                <div key={month.month} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-900 w-8">{month.month}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 w-32">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(month.revenue / Math.max(...reportData.ordersByMonth.map(m => m.revenue))) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900">
                      €{month.revenue.toLocaleString()}
                    </span>
                    <div className="text-xs text-gray-500">{month.orders} orders</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performing Products</h3>
            <div className="space-y-4">
              {reportData.topProducts.map((product, index) => (
                <div key={product.sku} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-800">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.productName}</p>
                      <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      €{product.revenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">{product.quantity} units</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedReport === 'customers' && (
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Customer Tier Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportData.tierDistribution.map((tier) => (
              <div key={tier.tierName} className="bg-gray-50 p-4 rounded-lg border">
                <div className="text-center">
                  <h4 className="text-lg font-bold text-gray-900">{tier.tierName}</h4>
                  <div className="mt-2">
                    <p className="text-2xl font-bold text-blue-600">{tier.customerCount}</p>
                    <p className="text-xs text-gray-500">customers</p>
                  </div>
                  <div className="mt-3">
                    <p className="text-lg font-medium text-gray-900">
                      €{tier.revenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">{tier.percentage}% of total revenue</p>
                  </div>
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${tier.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedReport === 'products' && (
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Product Performance Analysis</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Units Sold
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.topProducts.map((product, index) => (
                  <tr key={product.sku}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-800">#{index + 1}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.productName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      €{product.revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full"
                            style={{ 
                              width: `${(product.revenue / Math.max(...reportData.topProducts.map(p => p.revenue))) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {Math.round((product.revenue / Math.max(...reportData.topProducts.map(p => p.revenue))) * 100)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Export Options */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Export Reports</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => exportReport('pdf')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export as PDF
          </button>
          
          <button
            onClick={() => exportReport('excel')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <FileText className="h-4 w-4 mr-2" />
            Export as Excel
          </button>
          
          <button
            onClick={() => exportReport('csv')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Export as CSV
          </button>
        </div>
      </div>
    </div>
  );
}
