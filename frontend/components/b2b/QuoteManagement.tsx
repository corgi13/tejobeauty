'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, 
  Eye, 
  Download, 
  CheckCircle, 
  XCircle, 
  Clock,
  ShoppingCart,
  Euro
} from 'lucide-react';

interface Quote {
  id: string;
  total: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  createdAt: string;
  itemCount: number;
  validUntil?: string;
  items: QuoteItem[];
}

interface QuoteItem {
  id: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export default function QuoteManagement() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      // Mock data for now - replace with actual API call
      setQuotes([
        {
          id: '1',
          total: 2150.00,
          status: 'sent',
          createdAt: '2025-08-01',
          itemCount: 15,
          validUntil: '2025-08-15',
          items: [
            {
              id: '1',
              productName: 'Professional Nail Polish Set',
              sku: 'TNP001',
              quantity: 10,
              unitPrice: 38.99,
              totalPrice: 389.90
            },
            {
              id: '2',
              productName: 'UV Gel Base Coat',
              sku: 'TNP002',
              quantity: 5,
              unitPrice: 24.23,
              totalPrice: 121.15
            }
          ]
        },
        {
          id: '2',
          total: 3420.50,
          status: 'draft',
          createdAt: '2025-07-30',
          itemCount: 25,
          items: []
        },
        {
          id: '3',
          total: 1875.00,
          status: 'accepted',
          createdAt: '2025-07-28',
          itemCount: 12,
          items: []
        }
      ]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      case 'sent':
        return <Clock className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const filteredQuotes = quotes.filter(quote => {
    if (filter === 'all') return true;
    return quote.status === filter;
  });

  const handleAcceptQuote = async (quoteId: string) => {
    try {
      // API call to accept quote
      console.log('Accepting quote:', quoteId);
      
      setQuotes(quotes.map(quote => 
        quote.id === quoteId 
          ? { ...quote, status: 'accepted' as const }
          : quote
      ));
      
      alert('Quote accepted! Redirecting to order...');
    } catch (error) {
      console.error('Error accepting quote:', error);
    }
  };

  const handleRejectQuote = async (quoteId: string) => {
    try {
      // API call to reject quote
      console.log('Rejecting quote:', quoteId);
      
      setQuotes(quotes.map(quote => 
        quote.id === quoteId 
          ? { ...quote, status: 'rejected' as const }
          : quote
      ));
    } catch (error) {
      console.error('Error rejecting quote:', error);
    }
  };

  const handleDownloadQuote = (quoteId: string) => {
    console.log('Downloading quote:', quoteId);
    // Implement PDF download logic
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quote Management</h1>
        <p className="text-gray-600">Review and manage your bulk order quotes</p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'all', label: 'All Quotes', count: quotes.length },
              { key: 'draft', label: 'Drafts', count: quotes.filter(q => q.status === 'draft').length },
              { key: 'sent', label: 'Pending', count: quotes.filter(q => q.status === 'sent').length },
              { key: 'accepted', label: 'Accepted', count: quotes.filter(q => q.status === 'accepted').length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  filter === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>
      </div>

      {filteredQuotes.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No quotes found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filter === 'all' ? 'You have no quotes yet.' : `No ${filter} quotes found.`}
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredQuotes.map((quote) => (
              <li key={quote.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {getStatusIcon(quote.status)}
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900">
                            Quote #{quote.id}
                          </p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                            {quote.status}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                          <span>{quote.itemCount} items</span>
                          <span>•</span>
                          <span>Created {quote.createdAt}</span>
                          {quote.validUntil && (
                            <>
                              <span>•</span>
                              <span>Valid until {quote.validUntil}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          €{quote.total.toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedQuote(quote)}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </button>
                        
                        <button
                          onClick={() => handleDownloadQuote(quote.id)}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          PDF
                        </button>

                        {quote.status === 'sent' && (
                          <>
                            <button
                              onClick={() => handleAcceptQuote(quote.id)}
                              className="inline-flex items-center px-3 py-1 border border-green-300 rounded-md text-sm text-green-700 bg-green-50 hover:bg-green-100"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Accept
                            </button>
                            
                            <button
                              onClick={() => handleRejectQuote(quote.id)}
                              className="inline-flex items-center px-3 py-1 border border-red-300 rounded-md text-sm text-red-700 bg-red-50 hover:bg-red-100"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </button>
                          </>
                        )}

                        {quote.status === 'accepted' && (
                          <button className="inline-flex items-center px-3 py-1 border border-blue-300 rounded-md text-sm text-blue-700 bg-blue-50 hover:bg-blue-100">
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Reorder
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Quote Detail Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Quote #{selectedQuote.id}</h2>
                  <p className="text-gray-500">Created on {selectedQuote.createdAt}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedQuote.status)}`}>
                    {selectedQuote.status}
                  </span>
                  <button
                    onClick={() => setSelectedQuote(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {selectedQuote.items.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Quote Items</h3>
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
                            Quantity
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Unit Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedQuote.items.map((item) => (
                          <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {item.productName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.sku}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.quantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              €{item.unitPrice.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              €{item.totalPrice.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Quote Value:</span>
                  <span className="flex items-center">
                    <Euro className="h-5 w-5 mr-1" />
                    {selectedQuote.total.toLocaleString()}
                  </span>
                </div>
              </div>

              {selectedQuote.status === 'sent' && (
                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={() => {
                      handleAcceptQuote(selectedQuote.id);
                      setSelectedQuote(null);
                    }}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Accept Quote
                  </button>
                  
                  <button
                    onClick={() => {
                      handleRejectQuote(selectedQuote.id);
                      setSelectedQuote(null);
                    }}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                  >
                    <XCircle className="h-5 w-5 mr-2" />
                    Reject Quote
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
