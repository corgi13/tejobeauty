'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ShoppingCart,
  FileText,
  TrendingUp,
  Package,
  DollarSign,
  Users,
  Star,
  ArrowUpRight
} from 'lucide-react';

interface DashboardStats {
  totalOrders: number;
  pendingQuotes: number;
  monthlySpend: number;
  tierName: string;
  tierDiscount: number;
  nextTierRequirement: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  date: string;
}

interface PendingQuote {
  id: string;
  total: number;
  itemCount: number;
  createdAt: string;
}

export default function B2BDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [pendingQuotes, setPendingQuotes] = useState<PendingQuote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Mock data for now - replace with actual API calls
      setStats({
        totalOrders: 24,
        pendingQuotes: 3,
        monthlySpend: 15420.50,
        tierName: 'Gold Partner',
        tierDiscount: 15,
        nextTierRequirement: 4579.50
      });

      setRecentOrders([
        {
          id: '1',
          orderNumber: 'ORD-001',
          total: 1250.00,
          status: 'DELIVERED',
          date: '2025-08-01'
        },
        {
          id: '2',
          orderNumber: 'ORD-002',
          total: 890.75,
          status: 'PROCESSING',
          date: '2025-07-30'
        }
      ]);

      setPendingQuotes([
        {
          id: '1',
          total: 2150.00,
          itemCount: 15,
          createdAt: '2025-08-01'
        }
      ]);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'default';
      case 'PROCESSING':
        return 'secondary';
      case 'PENDING':
        return 'outline';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tejo Beauty B2B Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your business overview.
          </p>
        </div>
        <Button size="lg">
          <ShoppingCart className="mr-2 h-4 w-4" />
          New Order
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Total Orders</h3>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardBody>
            <div className="text-2xl font-bold">{stats?.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Pending Quotes</h3>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardBody>
            <div className="text-2xl font-bold">{stats?.pendingQuotes}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Monthly Spend</h3>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardBody>
            <div className="text-2xl font-bold">€{stats?.monthlySpend.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Partner Tier</h3>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardBody>
            <div className="text-lg font-bold">{stats?.tierName}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.tierDiscount}% discount
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Tier Progress */}
      {stats?.nextTierRequirement && (
        <Card>
          <CardHeader>
            <h3 className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tier Progress
            </h3>
            <p className="text-sm text-muted-foreground">
              You're €{stats.nextTierRequirement.toLocaleString()} away from the next tier!
            </p>
          </CardHeader>
          <CardBody>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to Platinum Partner</span>
                <span>75%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground">
                Reach €20,000 monthly spend to unlock 20% discount
              </p>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <h3>Recent Orders</h3>
            <p className="text-sm text-muted-foreground">Your latest order activity</p>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">{order.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">€{order.total.toLocaleString()}</span>
                    <Badge variant={getStatusBadgeVariant(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
              <Separator />
              <Button variant="ghost" className="w-full">
                View All Orders
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Pending Quotes */}
        <Card>
          <CardHeader>
            <h3>Pending Quotes</h3>
            <p className="text-sm text-muted-foreground">Quotes awaiting your approval</p>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {pendingQuotes.map((quote) => (
                <div key={quote.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{quote.itemCount} items</p>
                    <p className="text-xs text-muted-foreground">{quote.createdAt}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">€{quote.total.toLocaleString()}</span>
                    <Button size="sm">Review</Button>
                  </div>
                </div>
              ))}
              <Separator />
              <Button variant="ghost" className="w-full">
                View All Quotes
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
