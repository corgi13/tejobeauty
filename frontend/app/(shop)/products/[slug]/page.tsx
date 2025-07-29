"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/layout/breadcrumb";
import { useCart } from "@/components/cart/cart-provider";

interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
}

interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number | null;
  inventory: number;
  attributes: Record<string, any>;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  sku: string;
  barcode: string | null;
  weight: number | null;
  inventory: number;
  isActive: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // In a real app, we would fetch the product from the API
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/slug/${slug}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        const data = await response.json();
        setProduct(data);

        // Set the first variant as selected if variants exist
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const { addItem, openCart } = useCart();

  const handleAddToCart = () => {
    if (!isInStock || !product) return;

    const selectedVariantData = currentVariant
      ? {
          productId: product.id,
          variantId: currentVariant.id,
          name: `${product.name} - ${currentVariant.name}`,
          price: currentVariant.price || product.price,
          quantity,
          image:
            product.images && product.images.length > 0
              ? product.images[0].url
              : undefined,
          attributes: currentVariant.attributes,
        }
      : {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity,
          image:
            product.images && product.images.length > 0
              ? product.images[0].url
              : undefined,
        };

    addItem(selectedVariantData);
    openCart();
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error || "Product not found"}</p>
          <Link
            href="/products"
            className="text-primary-600 hover:text-primary-500 mt-2 inline-block"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  // Get the current variant or use the main product
  const currentVariant = selectedVariant
    ? product.variants.find((v) => v.id === selectedVariant)
    : null;

  const currentPrice = currentVariant?.price || product.price;
  const currentInventory = currentVariant?.inventory || product.inventory;
  const isInStock = currentInventory > 0;

  // Create breadcrumb items
  const breadcrumbItems = [
    { label: "Home", href: "/", isCurrent: false },
    { label: "Products", href: "/products", isCurrent: false },
    {
      label: product.category.name,
      href: `/products?category=${product.category.slug}`,
      isCurrent: false,
    },
    { label: product.name, href: `/products/${product.slug}`, isCurrent: true },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden mb-4">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[selectedImage].url}
                alt={product.images[selectedImage].altText || product.name}
                fill
                style={{ objectFit: "contain" }}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No image</span>
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={image.id}
                  className={`relative h-20 bg-gray-100 rounded-md overflow-hidden ${
                    selectedImage === index ? "ring-2 ring-primary-500" : ""
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    src={image.url}
                    alt={
                      image.altText || `${product.name} - Image ${index + 1}`
                    }
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {product.name}
          </h1>

          <Link
            href={`/categories/${product.category.slug}`}
            className="text-sm text-primary-600 hover:text-primary-500 mb-4 inline-block"
          >
            {product.category.name}
          </Link>

          <div className="mb-4">
            {product.compareAtPrice ? (
              <div className="flex items-center">
                <span className="text-2xl font-bold text-primary-600">
                  ${currentPrice.toFixed(2)}
                </span>
                <span className="ml-2 text-lg text-gray-500 line-through">
                  ${product.compareAtPrice.toFixed(2)}
                </span>
                <span className="ml-2 text-sm bg-red-100 text-red-800 px-2 py-1 rounded-full">
                  {Math.round(
                    (1 - currentPrice / product.compareAtPrice) * 100,
                  )}
                  % OFF
                </span>
              </div>
            ) : (
              <span className="text-2xl font-bold text-primary-600">
                ${currentPrice.toFixed(2)}
              </span>
            )}
          </div>

          <div className="mb-6">
            <p className="text-gray-700">{product.description}</p>
          </div>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Variants
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    className={`border rounded-md py-2 px-3 text-sm ${
                      selectedVariant === variant.id
                        ? "border-primary-500 bg-primary-50 text-primary-700"
                        : "border-gray-300 text-gray-700"
                    } ${variant.inventory === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => setSelectedVariant(variant.id)}
                    disabled={variant.inventory === 0}
                  >
                    {variant.name}
                    {variant.inventory === 0 && (
                      <span className="block text-xs text-red-500">
                        Out of stock
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Quantity</h3>
            <div className="flex items-center">
              <button
                className="border border-gray-300 rounded-l-md p-2 text-gray-600 hover:bg-gray-100"
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                disabled={!isInStock}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-16 border-t border-b border-gray-300 text-center py-2"
                disabled={!isInStock}
              />
              <button
                className="border border-gray-300 rounded-r-md p-2 text-gray-600 hover:bg-gray-100"
                onClick={() => setQuantity(quantity + 1)}
                disabled={!isInStock || quantity >= currentInventory}
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="mb-6">
            <button
              className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                isInStock
                  ? "bg-primary-600 hover:bg-primary-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              onClick={handleAddToCart}
              disabled={!isInStock}
            >
              {isInStock ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>

          {/* Product Details */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Product Details
            </h3>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-gray-500">SKU</dt>
                <dd className="text-sm text-gray-900">
                  {currentVariant?.sku || product.sku}
                </dd>
              </div>
              {product.barcode && (
                <div>
                  <dt className="text-sm text-gray-500">Barcode</dt>
                  <dd className="text-sm text-gray-900">{product.barcode}</dd>
                </div>
              )}
              {product.weight && (
                <div>
                  <dt className="text-sm text-gray-500">Weight</dt>
                  <dd className="text-sm text-gray-900">{product.weight} g</dd>
                </div>
              )}
              <div>
                <dt className="text-sm text-gray-500">Availability</dt>
                <dd className="text-sm text-gray-900">
                  {isInStock
                    ? `In stock (${currentInventory})`
                    : "Out of stock"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
