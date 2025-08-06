'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Calculator, 
  Package, 
  Percent, 
  Euro, 
  Plus,
  Minus,
  ShoppingCart,
  Download,
  FileText,
  TrendingDown,
  Info
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  sku: string;
  basePrice: number;
  category: string;
  minOrderQuantity: number;
  imageUrl?: string;
}

interface PricingTier {
  minQuantity: number;
  maxQuantity: number;
  discountPercentage: number;
}

interface CalculatorItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  savings: number;
  discountApplied: number;
}

interface CustomerTier {
  name: string;
  discountPercentage: number;
}

export default function B2BPricingCalculator() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<CalculatorItem[]>([]);
  const [customerTier] = useState<CustomerTier>({ name: 'Silver', discountPercentage: 10 });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  const pricingTiers: PricingTier[] = [
    { minQuantity: 1, maxQuantity: 9, discountPercentage: 0 },
    { minQuantity: 10, maxQuantity: 49, discountPercentage: 5 },
    { minQuantity: 50, maxQuantity: 99, discountPercentage: 10 },
    { minQuantity: 100, maxQuantity: 249, discountPercentage: 15 },
    { minQuantity: 250, maxQuantity: 499, discountPercentage: 20 },
    { minQuantity: 500, maxQuantity: Infinity, discountPercentage: 25 }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Professional Nail Polish Set (12 colors)',
          sku: 'TNP001',
          basePrice: 45.99,
          category: 'Polish',
          minOrderQuantity: 5,
          imageUrl: '/images/products/nail-polish-set.jpg'
        },
        {
          id: '2',
          name: 'UV Gel Base Coat 15ml',
          sku: 'TNP002',
          basePrice: 28.50,
          category: 'Gel',
          minOrderQuantity: 10
        },
        {
          id: '3',
          name: 'Professional Nail Files (Pack of 50)',
          sku: 'TNP003',
          basePrice: 22.99,
          category: 'Tools',
          minOrderQuantity: 5
        },
        {
          id: '4',
          name: 'Cuticle Oil Premium 10ml',
          sku: 'TNP004',
          basePrice: 18.75,
          category: 'Care',
          minOrderQuantity: 12
        },
        {
          id: '5',
          name: 'LED Nail Lamp 36W',
          sku: 'TNP005',
          basePrice: 89.99,
          category: 'Equipment',
          minOrderQuantity: 2
        }
      ];
      
      setProducts(mockProducts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const calculatePricing = useCallback((product: Product, quantity: number): CalculatorItem => {
    // Find applicable volume discount tier
    const volumeTier = pricingTiers.find(tier => 
      quantity >= tier.minQuantity && quantity <= tier.maxQuantity
    ) || pricingTiers[0];

    // Calculate base discount from volume
    const volumeDiscount = volumeTier.discountPercentage;
    
    // Add customer tier discount
    const totalDiscount = volumeDiscount + customerTier.discountPercentage;
    
    // Calculate prices
    const discountMultiplier = (100 - totalDiscount) / 100;
    const unitPrice = product.basePrice * discountMultiplier;
    const totalPrice = unitPrice * quantity;
    const savings = (product.basePrice * quantity) - totalPrice;

    return {
      product,
      quantity,
      unitPrice,
      totalPrice,
      savings,
      discountApplied: totalDiscount
    };
  }, [customerTier.discountPercentage]);

  const addProduct = (product: Product) => {
    const existingItem = selectedProducts.find(item => item.product.id === product.id);
    
    if (existingItem) {
      updateQuantity(product.id, existingItem.quantity + product.minOrderQuantity);
    } else {
      const calculatedItem = calculatePricing(product, product.minOrderQuantity);
      setSelectedProducts([...selectedProducts, calculatedItem]);
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeProduct(productId);
      return;
    }

    setSelectedProducts(selectedProducts.map(item => {
      if (item.product.id === productId) {
        return calculatePricing(item.product, newQuantity);
      }
      return item;
    }));
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(item => item.product.id !== productId));
  };

  const getTotalSummary = () => {
    const subtotal = selectedProducts.reduce((sum, item) => sum + (item.product.basePrice * item.quantity), 0);
    const total = selectedProducts.reduce((sum, item) => sum + item.totalPrice, 0);
    const totalSavings = subtotal - total;
    const averageDiscount = subtotal > 0 ? (totalSavings / subtotal) * 100 : 0;

    return { subtotal, total, totalSavings, averageDiscount };
  };

  const generateQuote = () => {
    setShowQuoteModal(true);
  };

  const exportToPDF = () => {
    console.log('Exporting to PDF...');
    // Implement PDF export functionality
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const summary = getTotalSummary();

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">B2B Pricing Calculator</h1>
        <p className="text-gray-600">Calculate bulk pricing and volume discounts for your orders</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Selection */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Select Products</h2>
              
              {/* Customer Tier Info */}
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2 text-blue-800">
                  <Info className="h-5 w-5" />
                  <span className="font-medium">
                    {customerTier.name} Tier Customer - {customerTier.discountPercentage}% additional discount applied
                  </span>
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products, SKU, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="p-6">
              {/* Volume Discount Tiers */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Volume Discount Tiers</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {pricingTiers.map((tier, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded border text-center">
                      <div className="text-sm font-medium text-gray-900">
                        {tier.minQuantity === 1 ? '1-9' : 
                         tier.maxQuantity === Infinity ? `${tier.minQuantity}+` :
                         `${tier.minQuantity}-${tier.maxQuantity}`}
                      </div>
                      <div className="text-xs text-green-600 font-medium">
                        {tier.discountPercentage}% off
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product List */}
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{product.name}</h4>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                          <span>SKU: {product.sku}</span>
                          <span>•</span>
                          <span>{product.category}</span>
                          <span>•</span>
                          <span>Min order: {product.minOrderQuantity}</span>
                        </div>
                        <div className="mt-2">
                          <span className="text-lg font-bold text-gray-900">
                            €{product.basePrice.toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-500 ml-1">base price</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => addProduct(product)}
                        className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                      </button>
                    </div>
                  </div>
                ))}

                {filteredProducts.length === 0 && (
                  <div className="text-center py-8">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Try adjusting your search terms.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Calculator & Summary */}
        <div>
          <div className="bg-white rounded-lg shadow border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Calculator className="h-6 w-6 mr-2" />
                Order Calculator
              </h2>
            </div>

            <div className="p-6">
              {/* Selected Products */}
              {selectedProducts.length > 0 ? (
                <div className="space-y-4 mb-6">
                  {selectedProducts.map((item) => (
                    <div key={item.product.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeProduct(item.product.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Remove item"
                        >
                          ×
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-bold text-gray-900">
                            €{item.totalPrice.toFixed(2)}
                          </p>
                          {item.discountApplied > 0 && (
                            <p className="text-xs text-green-600">
                              {item.discountApplied}% off
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        €{item.unitPrice.toFixed(2)} per unit
                        {item.savings > 0 && (
                          <span className="text-green-600 ml-2">
                            Save €{item.savings.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 mb-6">
                  <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No items selected</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Add products to calculate pricing
                  </p>
                </div>
              )}

              {/* Order Summary */}
              {selectedProducts.length > 0 && (
                <>
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal (list price):</span>
                      <span className="text-gray-900">€{summary.subtotal.toFixed(2)}</span>
                    </div>
                    
                    {summary.totalSavings > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600 flex items-center">
                          <TrendingDown className="h-4 w-4 mr-1" />
                          Total Savings ({summary.averageDiscount.toFixed(1)}%):
                        </span>
                        <span className="text-green-600 font-medium">
                          -€{summary.totalSavings.toFixed(2)}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total:</span>
                      <span className="text-blue-600">€{summary.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <button
                      onClick={generateQuote}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <FileText className="h-5 w-5 mr-2" />
                      Request Quote
                    </button>
                    
                    <button
                      onClick={exportToPDF}
                      className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Export PDF
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quote Request Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Request Quote</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your company name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="contact@company.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Requirements
                  </label>
                  <textarea
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Any special requirements or notes..."
                  />
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => setShowQuoteModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log('Submitting quote request...');
                    setShowQuoteModal(false);
                    alert('Quote request submitted successfully!');
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
