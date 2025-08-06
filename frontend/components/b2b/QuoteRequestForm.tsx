'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Plus, Minus, ShoppingCart, FileText, Send } from 'lucide-react';

interface QuoteItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  image?: string;
}

interface QuoteRequestFormProps {
  onSubmit: (items: QuoteItem[], notes: string) => Promise<void>;
  availableProducts: Array<{
    id: string;
    name: string;
    sku: string;
    price: number;
    image?: string;
    inventory: number;
  }>;
}

export default function QuoteRequestForm({ onSubmit, availableProducts }: QuoteRequestFormProps) {
  const [selectedItems, setSelectedItems] = useState<QuoteItem[]>([]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = availableProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addItem = (product: typeof availableProducts[0]) => {
    const existingItem = selectedItems.find(item => item.productId === product.id);
    
    if (existingItem) {
      setSelectedItems(items =>
        items.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setSelectedItems(items => [
        ...items,
        {
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          quantity: 1,
          unitPrice: product.price,
          image: product.image,
        }
      ]);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setSelectedItems(items => items.filter(item => item.productId !== productId));
    } else {
      setSelectedItems(items =>
        items.map(item =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeItem = (productId: string) => {
    setSelectedItems(items => items.filter(item => item.productId !== productId));
  };

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItems.length === 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit(selectedItems, notes);
      setSelectedItems([]);
      setNotes('');
    } catch (error) {
      console.error('Failed to submit quote request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Product Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Select Products</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-md mb-3"
                  />
                )}
                <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-2">SKU: {product.sku}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-primary-600">
                    €{product.price.toFixed(2)}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => addItem(product)}
                    leftIcon={<Plus className="h-4 w-4" />}
                  >
                    Add
                  </Button>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Stock: {product.inventory} units
                </p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Selected Items */}
      {selectedItems.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Selected Items ({selectedItems.length})
              </h2>
              <div className="text-right">
                <p className="text-sm text-gray-500">Estimated Total</p>
                <p className="text-2xl font-bold text-primary-600">
                  €{calculateTotal().toFixed(2)}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {selectedItems.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    )}
                    <div>
                      <h3 className="font-medium text-gray-900">{item.productName}</h3>
                      <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                      <p className="text-sm text-primary-600">€{item.unitPrice.toFixed(2)} each</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-right min-w-[80px]">
                      <p className="font-semibold text-gray-900">
                        €{(item.quantity * item.unitPrice).toFixed(2)}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="error"
                      onClick={() => removeItem(item.productId)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Quote Request Form */}
      {selectedItems.length > 0 && (
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Request Quote
              </h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes or Requirements
                  </label>
                  <textarea
                    id="notes"
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Please include any specific requirements, delivery preferences, or questions..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-vertical"
                  />
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Quote Summary</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Items:</span>
                      <span>{selectedItems.length} products</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Quantity:</span>
                      <span>{selectedItems.reduce((sum, item) => sum + item.quantity, 0)} units</span>
                    </div>
                    <div className="flex justify-between font-semibold text-base pt-2 border-t">
                      <span>Estimated Total:</span>
                      <span className="text-primary-600">€{calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    * Final pricing may vary based on quantity discounts and current promotions
                  </p>
                </div>
              </div>
            </CardBody>
            <CardFooter>
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setSelectedItems([])}
                >
                  Clear All
                </Button>
                <Button
                  type="submit"
                  loading={isSubmitting}
                  leftIcon={<Send className="h-4 w-4" />}
                >
                  {isSubmitting ? 'Submitting...' : 'Request Quote'}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      )}

      {selectedItems.length === 0 && (
        <Card>
          <CardBody>
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No items selected</h3>
              <p className="text-gray-500">
                Select products from the catalog above to request a custom quote
              </p>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}