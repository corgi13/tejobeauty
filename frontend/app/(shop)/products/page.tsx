"use client";

import { useState } from "react";

// Force dynamic rendering
export const dynamic = "force-dynamic";
import { Search, Filter, Grid, List } from "lucide-react";

// Mock product data
const mockProducts = [
  {
    id: "1",
    name: "Premium Nail Polish Set",
    price: 29.99,
    image: "/api/placeholder/300/300",
    category: "Nail Polish",
    description: "Professional quality nail polish in 12 beautiful colors",
    inStock: true,
  },
  {
    id: "2",
    name: "Cuticle Care Oil",
    price: 15.99,
    image: "/api/placeholder/300/300",
    category: "Nail Care",
    description: "Nourishing cuticle oil for healthy nail growth",
    inStock: true,
  },
  {
    id: "3",
    name: "Professional Nail File Kit",
    price: 24.99,
    image: "/api/placeholder/300/300",
    category: "Tools",
    description: "Complete nail filing kit with multiple grits",
    inStock: false,
  },
  {
    id: "4",
    name: "LED Nail Lamp",
    price: 89.99,
    image: "/api/placeholder/300/300",
    category: "Equipment",
    description: "Professional LED lamp for gel nail curing",
    inStock: true,
  },
];

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const categories = ["All", "Nail Polish", "Nail Care", "Tools", "Equipment"];

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Products</h1>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-primary-500 text-white" : "text-gray-500"}`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-primary-500 text-white" : "text-gray-500"}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
        }
      >
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${
              viewMode === "list" ? "flex" : ""
            }`}
          >
            <div
              className={`${viewMode === "list" ? "w-48 h-32" : "w-full h-48"} bg-gray-200 flex items-center justify-center`}
            >
              <span className="text-gray-500">Product Image</span>
            </div>

            <div className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                {product.name}
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                {product.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-primary-600">
                  ${product.price}
                </span>
                <span
                  className={`text-sm px-2 py-1 rounded ${
                    product.inStock
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              <button
                disabled={!product.inStock}
                className={`w-full mt-4 py-2 px-4 rounded-lg font-medium ${
                  product.inStock
                    ? "bg-primary-600 text-white hover:bg-primary-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No products found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
}
