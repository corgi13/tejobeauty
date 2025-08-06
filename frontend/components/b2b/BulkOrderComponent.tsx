'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Minus, ShoppingCart, Calculator } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  sku: string;
  image?: string;
  inventory: number;
}

interface CartItem extends Product {
  quantity: number;
  bulkPrice?: number;
}

interface BulkPricing {
  minQuantity: number;
  maxQuantity: number;
  price: number;
}

export default function BulkOrderComponent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [customerTier, setCustomerTier] = useState<any>(null);

  useEffect(() => {
    fetchProducts();
    fetchCustomerTier();
  }, []);

  const fetchProducts = async () => {
    try {
      // Mock data for now - replace with actual API call
      setProducts([
        {
          id: '1',
          name: 'Professional Nail Polish Set',
          price: 45.99,
          sku: 'TNP001',
          inventory: 150
        },
        {
          id: '2',
          name: 'UV Gel Base Coat',
          price: 28.50,
          sku: 'TNP002',
          inventory: 200
        },
        {
          id: '3',
          name: 'Cuticle Oil Premium',
          price: 15.75,
          sku: 'TNP003',
          inventory: 300
        }
      ]);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCustomerTier = async () => {
    try {
      // Mock data for now
      setCustomerTier({
        name: 'Gold Partner',
        discountPercentage: 15,
        minSpend: 500
      });
    } catch (error) {
      console.error('Error fetching customer tier:', error);
    }
  };

  const calculateBulkPrice = async (productId: string, quantity: number): Promise<number> => {
    try {
      // Mock bulk pricing calculation
      const product = products.find(p => p.id === productId);
      if (!product) return 0;

      let bulkPrice = product.price;
      
      // Apply bulk discounts
      if (quantity >= 50) {
        bulkPrice = product.price * 0.85; // 15% off for 50+
      } else if (quantity >= 20) {
        bulkPrice = product.price * 0.90; // 10% off for 20+
      } else if (quantity >= 10) {
        bulkPrice = product.price * 0.95; // 5% off for 10+
      }

      // Apply tier discount
      if (customerTier) {
        bulkPrice = bulkPrice * (1 - customerTier.discountPercentage / 100);
      }

      return bulkPrice;
    } catch (error) {
      console.error('Error calculating bulk price:', error);
      const product = products.find(p => p.id === productId);
      return product?.price || 0;
    }
  };

  const addToCart = async (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      await updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      const bulkPrice = await calculateBulkPrice(product.id, 1);
      setCart([...cart, { ...product, quantity: 1, bulkPrice }]);
    }
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const bulkPrice = await calculateBulkPrice(productId, newQuantity);
    
    setCart(cart.map(item => 
      item.id === productId 
        ? { ...item, quantity: newQuantity, bulkPrice }
        : item
    ));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = item.bulkPrice || item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalSavings = () => {
    const originalTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const discountedTotal = getTotalPrice();
    return originalTotal - discountedTotal;
  };

  const requestQuote = async () => {
    setLoading(true);
    try {
      const quoteData = {
        userId: 'current-user-id', // Replace with actual user ID
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      };

      // API call to create quote
      console.log('Requesting quote for:', quoteData);
      
      // Reset cart after successful quote request
      setCart([]);
      alert('Quote requested successfully! You will receive it shortly.');
    } catch (error) {
      console.error('Error requesting quote:', error);
      alert('Error requesting quote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bulk Order Portal</h1>
        <p className="text-gray-600">Add products to your bulk order and get volume discounts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Products Section */}
        <div className="lg:col-span-2">
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search products by name or SKU..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <span className="text-sm text-gray-500">{product.sku}</span>
                </div>
                
                <div className="mb-3">
                  <span className="text-lg font-bold text-blue-600">€{product.price.toFixed(2)}</span>
                  <span className="text-sm text-gray-500 ml-2">each</span>
                </div>

                <div className="mb-3">
                  <span className="text-xs text-gray-500">In stock: {product.inventory}</span>
                </div>

                <button
                  onClick={() => addToCart(product)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add to Order
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Section */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Your Order ({getTotalItems()} items)
            </h2>

            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Your cart is empty</p>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg p-4 border">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="text-right">
                          {item.bulkPrice && item.bulkPrice < item.price && (
                            <div className="text-xs text-gray-500 line-through">
                              €{(item.price * item.quantity).toFixed(2)}
                            </div>
                          )}
                          <div className="font-bold text-blue-600">
                            €{((item.bulkPrice || item.price) * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>

                      {item.bulkPrice && item.bulkPrice < item.price && (
                        <div className="mt-2 text-xs text-green-600">
                          Bulk discount applied!
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Tier Info */}
                {customerTier && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <div className="text-sm font-medium text-blue-900">{customerTier.name}</div>
                    <div className="text-xs text-blue-700">{customerTier.discountPercentage}% tier discount applied</div>
                  </div>
                )}

                {/* Totals */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>€{getTotalPrice().toFixed(2)}</span>
                  </div>
                  
                  {getTotalSavings() > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>You save:</span>
                      <span>€{getTotalSavings().toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>€{getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-2">
                  <button
                    onClick={requestQuote}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Calculator className="h-4 w-4" />
                    {loading ? 'Requesting...' : 'Request Quote'}
                  </button>
                  
                  <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors">
                    Place Order Now
                  </button>
                </div>

                {customerTier && getTotalPrice() < customerTier.minSpend && (
                  <div className="mt-4 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded p-2">
                    Add €{(customerTier.minSpend - getTotalPrice()).toFixed(2)} more to meet minimum order requirement.
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
