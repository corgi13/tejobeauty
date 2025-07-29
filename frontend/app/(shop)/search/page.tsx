"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

// Mock search results
const mockResults = [
  {
    id: "1",
    name: "Premium Nail Polish Set",
    price: 29.99,
    image: "/api/placeholder/200/200",
    category: "Nail Polish",
    description: "Professional quality nail polish in 12 beautiful colors",
  },
  {
    id: "2",
    name: "Cuticle Care Oil",
    price: 15.99,
    image: "/api/placeholder/200/200",
    category: "Nail Care",
    description: "Nourishing cuticle oil for healthy nail growth",
  },
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(query);
  const [results, setResults] = useState(mockResults);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      setSearchTerm(query);
      // Simulate search
      setLoading(true);
      setTimeout(() => {
        setResults(
          mockResults.filter(
            (item) =>
              item.name.toLowerCase().includes(query.toLowerCase()) ||
              item.description.toLowerCase().includes(query.toLowerCase()),
          ),
        );
        setLoading(false);
      }, 500);
    }
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.history.pushState(
        {},
        "",
        `/search?q=${encodeURIComponent(searchTerm)}`,
      );
      setLoading(true);
      setTimeout(() => {
        setResults(
          mockResults.filter(
            (item) =>
              item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.description.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
        );
        setLoading(false);
      }, 500);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Search Products
        </h1>

        <form onSubmit={handleSearch} className="max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for products..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Search Results */}
      {query && (
        <div className="mb-6">
          <p className="text-gray-600">
            {loading
              ? "Searching..."
              : `${results.length} results found for "${query}"`}
          </p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Searching products...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Product Image</span>
              </div>

              <div className="p-4">
                <div className="text-sm text-primary-600 font-medium mb-1">
                  {product.category}
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-primary-600">
                    ${product.price}
                  </span>
                  <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && results.length === 0 && query && (
        <div className="text-center py-12">
          <Search className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No results found
          </h3>
          <p className="text-gray-600 mb-6">
            We couldn't find any products matching "{query}". Try adjusting your
            search terms.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setResults(mockResults);
            }}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            View All Products
          </button>
        </div>
      )}
    </div>
  );
}
