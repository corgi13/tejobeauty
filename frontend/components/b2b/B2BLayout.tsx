'use client';

import { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  FileText, 
  Settings, 
  Users, 
  BarChart3,
  Menu,
  X,
  User,
  Bell,
  Search,
  Calculator,
  Crown,
  Quote,
  Package2
} from 'lucide-react';

interface B2BLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

export default function B2BLayout({ children, currentPage = 'dashboard' }: B2BLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/b2b', icon: LayoutDashboard, current: currentPage === 'dashboard' },
    { name: 'Bulk Orders', href: '/b2b/orders', icon: ShoppingCart, current: currentPage === 'orders' },
    { name: 'Pricing Calculator', href: '/b2b/calculator', icon: Calculator, current: currentPage === 'calculator' },
    { name: 'Quote Management', href: '/b2b/quotes', icon: Quote, current: currentPage === 'quotes' },
    { name: 'Order History', href: '/b2b/history', icon: Package2, current: currentPage === 'history' },
    { name: 'Customer Tier', href: '/b2b/tier', icon: Crown, current: currentPage === 'tier' },
    { name: 'Analytics & Reports', href: '/b2b/reports', icon: BarChart3, current: currentPage === 'reports' },
    { name: 'Team Management', href: '/b2b/team', icon: Users, current: currentPage === 'team' },
    { name: 'Settings', href: '/b2b/settings', icon: Settings, current: currentPage === 'settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
              title="Close sidebar"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-xl font-bold text-gray-900">Tejo Beauty B2B</h1>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`${
                    item.current
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors`}
                >
                  <item.icon
                    className={`${
                      item.current ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    } mr-4 h-6 w-6`}
                  />
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-gray-900">Tejo Beauty B2B</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`${
                    item.current
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
                >
                  <item.icon
                    className={`${
                      item.current ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    } mr-3 h-5 w-5`}
                  />
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
          
          {/* Tier Status in Sidebar */}
          <div className="p-4 border-t border-gray-200">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Crown className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Silver Tier</span>
              </div>
              <div className="text-xs text-blue-700">
                10% bulk discount active
              </div>
              <div className="mt-2">
                <div className="w-full bg-blue-200 rounded-full h-1.5">
                  <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" style={{width: '60%'}}></div>
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  €6,250 to Gold tier
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-100">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
            title="Open sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Top navigation bar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <div className="hidden md:block">
                  <div className="ml-4 flex items-center md:ml-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        placeholder="Search products, orders..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Quick Actions */}
                <div className="hidden lg:flex items-center space-x-2">
                  <a
                    href="/b2b/calculator"
                    className="inline-flex items-center px-3 py-1.5 border border-blue-300 rounded-md text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    <Calculator className="h-4 w-4 mr-1" />
                    Quick Quote
                  </a>
                  <a
                    href="/b2b/orders"
                    className="inline-flex items-center px-3 py-1.5 border border-green-300 rounded-md text-sm text-green-700 bg-green-50 hover:bg-green-100 transition-colors"
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Bulk Order
                  </a>
                </div>

                {/* Notifications */}
                <button 
                  className="text-gray-400 hover:text-gray-500 relative"
                  title="Notifications"
                >
                  <Bell className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                </button>
                
                {/* User Profile */}
                <div className="flex items-center space-x-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">Beauty Salon Pro</p>
                    <p className="text-xs text-gray-500 flex items-center">
                      <Crown className="h-3 w-3 mr-1 text-blue-500" />
                      Silver Tier • 10% discount
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center text-sm text-gray-500">
              <div>
                © 2025 Tejo Beauty B2B Portal. All rights reserved.
              </div>
              <div className="flex space-x-4">
                <a href="/support" className="hover:text-gray-700">Support</a>
                <a href="/docs" className="hover:text-gray-700">Documentation</a>
                <a href="/contact" className="hover:text-gray-700">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
