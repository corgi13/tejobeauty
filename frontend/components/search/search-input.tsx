"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, X } from "lucide-react";

interface ProductSuggestion {
  id: string;
  name: string;
  slug: string;
  price: number;
  image?: {
    url: string;
    altText: string | null;
  };
  category: {
    name: string;
  };
}

interface CategorySuggestion {
  id: string;
  name: string;
  slug: string;
}

interface SearchInputProps {
  placeholder?: string;
  initialQuery?: string;
  className?: string;
  maxSuggestions?: number;
}

export default function SearchInput({
  placeholder = "Search products...",
  initialQuery = "",
  className = "",
  maxSuggestions = 5,
}: SearchInputProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [productSuggestions, setProductSuggestions] = useState<
    ProductSuggestion[]
  >([]);
  const [categorySuggestions, setCategorySuggestions] = useState<
    CategorySuggestion[]
  >([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Update query if initialQuery changes (e.g., from URL)
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    // Add event listener to close suggestions when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Fetch suggestions when query changes
    const fetchSuggestions = async () => {
      if (!query.trim() || query.trim().length < 2) {
        setProductSuggestions([]);
        setCategorySuggestions([]);
        return;
      }

      setLoading(true);
      try {
        // Fetch product suggestions
        const productResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/search?query=${encodeURIComponent(query)}&hitsPerPage=${maxSuggestions}`,
        );

        // Fetch category suggestions
        const categoryResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/search/categories?query=${encodeURIComponent(query)}&hitsPerPage=${maxSuggestions}`,
        );

        if (productResponse.ok && categoryResponse.ok) {
          const productData = await productResponse.json();
          const categoryData = await categoryResponse.json();

          setProductSuggestions(
            productData.hits.map((hit: any) => ({
              id: hit.id,
              name: hit.name,
              slug: hit.slug,
              price: hit.price,
              image:
                hit.images && hit.images.length > 0
                  ? {
                      url: hit.images[0].url,
                      altText: hit.images[0].altText,
                    }
                  : undefined,
              category: {
                name: hit.category.name,
              },
            })),
          );

          setCategorySuggestions(
            categoryData.hits.map((hit: any) => ({
              id: hit.id,
              name: hit.name,
              slug: hit.slug,
            })),
          );

          setShowSuggestions(true);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce the search to avoid too many requests
    const debounceTimer = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [query, maxSuggestions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleClearQuery = () => {
    setQuery("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim().length >= 2 && setShowSuggestions(true)}
            placeholder={placeholder}
            className="w-full py-2 pl-4 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {query ? (
            <button
              type="button"
              onClick={handleClearQuery}
              className="absolute inset-y-0 right-8 flex items-center px-2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          ) : null}
          <button
            type="submit"
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-primary-600"
          >
            <Search size={18} />
          </button>
        </div>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && query.trim().length >= 2 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-96 overflow-y-auto"
        >
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              Loading suggestions...
            </div>
          ) : (
            <>
              {/* Category suggestions */}
              {categorySuggestions.length > 0 && (
                <div className="p-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-1">
                    Categories
                  </h3>
                  <ul>
                    {categorySuggestions.map((category) => (
                      <li key={category.id}>
                        <Link
                          href={`/products?category=${category.slug}`}
                          className="flex items-center px-4 py-2 hover:bg-gray-100 rounded-md"
                          onClick={() => setShowSuggestions(false)}
                        >
                          <Search size={16} className="text-gray-400 mr-2" />
                          <span>{category.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Product suggestions */}
              {productSuggestions.length > 0 && (
                <div className="p-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-1">
                    Products
                  </h3>
                  <ul>
                    {productSuggestions.map((product) => (
                      <li key={product.id}>
                        <Link
                          href={`/products/${product.slug}`}
                          className="flex items-center px-4 py-2 hover:bg-gray-100 rounded-md"
                          onClick={() => setShowSuggestions(false)}
                        >
                          {product.image ? (
                            <div className="relative w-10 h-10 mr-3 bg-gray-100 rounded">
                              <Image
                                src={product.image.url}
                                alt={product.image.altText || product.name}
                                fill
                                style={{ objectFit: "cover" }}
                                className="rounded"
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 mr-3 bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-gray-400 text-xs">
                                No img
                              </span>
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-gray-500">
                              {product.category.name}
                            </div>
                          </div>
                          <div className="text-primary-600 font-medium">
                            ${product.price.toFixed(2)}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* No results */}
              {productSuggestions.length === 0 &&
                categorySuggestions.length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    No results found for "{query}"
                  </div>
                )}

              {/* View all results link */}
              {(productSuggestions.length > 0 ||
                categorySuggestions.length > 0) && (
                <div className="p-2 border-t border-gray-100">
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}`}
                    className="block px-4 py-2 text-center text-primary-600 hover:bg-gray-100 rounded-md"
                    onClick={() => setShowSuggestions(false)}
                  >
                    View all results
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
