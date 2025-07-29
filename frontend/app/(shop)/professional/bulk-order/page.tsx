"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Minus,
  Trash2,
  Search,
  Filter,
  ShoppingCart,
  Package,
  TrendingDown,
  Clock,
  Star,
} from "lucide-react";

// Mock data for professional products with bulk pricing
const mockProducts = [
  {
    id: "1",
    name: "Professional Nail Polish Set - 24 Colors",
    sku: "NP-PRO-24",
    category: "Nail Polish",
    image: "/api/placeholder/150/150",
    regularPrice: 12.99,
    bulkPricing: [
      { minQty: 1, price: 12.99, discount: 0 },
      { minQty: 5, price: 11.69, discount: 10 },
      { minQty: 10, price: 10.39, discount: 20 },
      { minQty: 25, price: 9.09, discount: 30 },
    ],
    inStock: 150,
    description: "Professional grade nail polish with long-lasting formula",
  },
  {
    id: "2",
    name: "Premium Cuticle Oil - 50ml",
    sku: "CO-PREM-50",
    category: "Nail Care",
    image: "/api/placeholder/150/150",
    regularPrice: 24.99,
    bulkPricing: [
      { minQty: 1, price: 24.99, discount: 0 },
      { minQty: 3, price: 22.49, discount: 10 },
      { minQty: 6, price: 19.99, discount: 20 },
      { minQty: 12, price: 17.49, discount: 30 },
    ],
    inStock: 89,
    description: "Nourishing cuticle oil with vitamin E and jojoba oil",
  },
  {
    id: "3",
    name: "Professional Nail File Set - 10 Pack",
    sku: "NF-PRO-10",
    category: "Tools",
    image: "/api/placeholder/150/150",
    regularPrice: 18.99,
    bulkPricing: [
      { minQty: 1, price: 18.99, discount: 0 },
      { minQty: 5, price: 17.09, discount: 10 },
      { minQty: 10, price: 15.19, discount: 20 },
      { minQty: 20, price: 13.29, discount: 30 },
    ],
    inStock: 200,
    description: "Professional grade nail files with multiple grits",
  },
];

// Mock recent orders for quick reorder
const mockRecentOrders = [
  {
    id: "BO-001",
    date: "2024-01-10",
    total: 245.67,
    items: [
      {
        productId: "1",
        name: "Professional Nail Polish Set - 24 Colors",
        quantity: 5,
        price: 11.69,
      },
      {
        productId: "2",
        name: "Premium Cuticle Oil - 50ml",
        quantity: 3,
        price: 22.49,
      },
    ],
  },
  {
    id: "BO-002",
    date: "2024-01-05",
    total: 189.45,
    items: [
      {
        productId: "3",
        name: "Professional Nail File Set - 10 Pack",
        quantity: 10,
        price: 15.19,
      },
    ],
  },
];

interface CartItem {
  productId: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  regularPrice: number;
  discount: number;
  image: string;
}

export default function BulkOrderPage() {
  const [products] = useState(mockProducts);
  const [recentOrders] = useState(mockRecentOrders);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showQuickReorder, setShowQuickReorder] = useState(false);

  const categories = ["All", "Nail Polish", "Nail Care", "Tools", "Equipment"];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getBulkPrice = (
    product: (typeof mockProducts)[0],
    quantity: number,
  ) => {
    const pricing = [...product.bulkPricing]
      .reverse()
      .find((tier) => quantity >= tier.minQty);
    return pricing || product.bulkPricing[0];
  };

  const addToCart = (product: (typeof mockProducts)[0], quantity: number) => {
    const pricing = getBulkPrice(product, quantity);
    const existingItem = cart.find((item) => item.productId === product.id);

    if (existingItem) {
      updateCartQuantity(product.id, existingItem.quantity + quantity);
    } else {
      const newItem: CartItem = {
        productId: product.id,
        name: product.name,
        sku: product.sku,
        quantity,
        price: pricing.price,
        regularPrice: product.regularPrice,
        discount: pricing.discount,
        image: product.image,
      };
      setCart((prev) => [...prev, newItem]);
    }
  };

  const updateCartQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart((prev) => prev.filter((item) => item.productId !== productId));
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.productId === productId) {
          const product = products.find((p) => p.id === productId);
          if (product) {
            const pricing = getBulkPrice(product, newQuantity);
            return {
              ...item,
              quantity: newQuantity,
              price: pricing.price,
              discount: pricing.discount,
            };
          }
        }
        return item;
      }),
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const reorderItems = (orderItems: (typeof mockRecentOrders)[0]["items"]) => {
    orderItems.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        addToCart(product, item.quantity);
      }
    });
    setShowQuickReorder(false);
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const totalSavings = cart.reduce(
    (sum, item) => sum + (item.regularPrice - item.price) * item.quantity,
    0,
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Professional Bulk Ordering
        </h1>
        <p className="text-gray-600">
          Save up to 30% with bulk pricing. Minimum order quantities apply for
          discounted rates.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Quick Reorder Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary-600" />
                Quick Reorder
              </h2>
              <button
                onClick={() => setShowQuickReorder(!showQuickReorder)}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                {showQuickReorder ? "Hide" : "Show"} Recent Orders
              </button>
            </div>

            {showQuickReorder && (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-medium">Order #{order.id}</span>
                        <span className="text-gray-500 ml-2">
                          {new Date(order.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          ${order.total.toFixed(2)}
                        </div>
                        <button
                          onClick={() => reorderItems(order.items)}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          Reorder All
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {order.items.map((item, index) => (
                        <span key={index}>
                          {item.name} (x{item.quantity})
                          {index < order.items.length - 1 && ", "}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search products or SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="md:w-48">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="space-y-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        </div>

        {/* Cart Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Bulk Order Cart ({cart.length})
            </h2>

            {cart.length === 0 ? (
              <div className="text-center py-8">
                <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">Your bulk order cart is empty</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {cart.map((item) => (
                    <div
                      key={item.productId}
                      className="border border-gray-200 rounded-lg p-3"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-gray-900">
                            {item.name}
                          </h4>
                          <p className="text-xs text-gray-500">
                            SKU: {item.sku}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              updateCartQuantity(
                                item.productId,
                                item.quantity - 1,
                              )
                            }
                            className="p-1 rounded border border-gray-300 hover:bg-gray-50"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartQuantity(
                                item.productId,
                                item.quantity + 1,
                              )
                            }
                            className="p-1 rounded border border-gray-300 hover:bg-gray-50"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-sm">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                          {item.discount > 0 && (
                            <div className="text-xs text-green-600">
                              {item.discount}% off
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  {totalSavings > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Bulk Savings:</span>
                      <span>-${totalSavings.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors mt-4">
                  Proceed to Checkout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Product Card Component
function ProductCard({
  product,
  onAddToCart,
}: {
  product: (typeof mockProducts)[0];
  onAddToCart: (product: (typeof mockProducts)[0], quantity: number) => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const currentPricing =
    [...product.bulkPricing]
      .reverse()
      .find((tier) => quantity >= tier.minQty) || product.bulkPricing[0];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-48 flex-shrink-0">
          <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">Product Image</span>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500 mb-2">SKU: {product.sku}</p>
              <p className="text-gray-600">{product.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600">
                ${currentPricing.price.toFixed(2)}
              </div>
              {currentPricing.discount > 0 && (
                <div className="text-sm text-gray-500 line-through">
                  ${product.regularPrice.toFixed(2)}
                </div>
              )}
            </div>
          </div>

          {/* Bulk Pricing Tiers */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Bulk Pricing:
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {product.bulkPricing.map((tier, index) => (
                <div
                  key={index}
                  className={`text-center p-2 rounded border ${
                    quantity >= tier.minQty
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="text-xs text-gray-600">
                    {tier.minQty}+ units
                  </div>
                  <div className="font-semibold">${tier.price.toFixed(2)}</div>
                  {tier.discount > 0 && (
                    <div className="text-xs text-green-600">
                      {tier.discount}% off
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">
                  Quantity:
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-16 text-center border-0 focus:ring-0"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                In stock: {product.inStock}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {currentPricing.discount > 0 && (
                <div className="flex items-center text-green-600">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">
                    {currentPricing.discount}% off
                  </span>
                </div>
              )}
              <button
                onClick={() => onAddToCart(product, quantity)}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
