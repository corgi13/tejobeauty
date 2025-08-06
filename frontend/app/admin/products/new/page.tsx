"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Save,
  X,
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Tag,
  Package,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import RoleGuard from "@/lib/auth/role-guard";

// Mock categories
const mockCategories = [
  { id: "cat-1", name: "Nail Polish" },
  { id: "cat-2", name: "Nail Care" },
  { id: "cat-3", name: "Tools" },
  { id: "cat-4", name: "Equipment" },
  { id: "cat-5", name: "Kits & Bundles" },
];

interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isDefault: boolean;
}

interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  compareAtPrice: number | null;
  inventory: number;
}

export default function NewProductPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState("basic");

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    sku: "",
    barcode: "",
    price: "",
    compareAtPrice: "",
    cost: "",
    inventory: "0",
    weight: "",
    categoryId: "",
    status: "draft",
    tags: [] as string[],
    images: [] as ProductImage[],
    variants: [] as ProductVariant[],
    seo: {
      title: "",
      description: "",
      keywords: "",
    },
  });

  const [currentTag, setCurrentTag] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setProductData({
        ...productData,
        [parent]: {
          ...(productData[parent as keyof typeof productData] as any),
          [child]: value,
        },
      });
    } else {
      setProductData({
        ...productData,
        [name]: value,
      });
    }
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !productData.tags.includes(currentTag.trim())) {
      setProductData({
        ...productData,
        tags: [...productData.tags, currentTag.trim()],
      });
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setProductData({
      ...productData,
      tags: productData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // In a real app, you would upload these files to your server or cloud storage
    // Here we're just creating local URLs for demonstration
    const newImages: ProductImage[] = Array.from(files).map((file, index) => ({
      id: `img-${Date.now()}-${index}`,
      url: URL.createObjectURL(file),
      alt: file.name,
      isDefault: productData.images.length === 0 && index === 0,
    }));

    setProductData({
      ...productData,
      images: [...productData.images, ...newImages],
    });
  };

  const handleRemoveImage = (imageId: string) => {
    const updatedImages = productData.images.filter(
      (img) => img.id !== imageId,
    );

    // If we removed the default image, set a new default if possible
    let hasDefault = updatedImages.some((img) => img.isDefault);
    if (!hasDefault && updatedImages.length > 0) {
      updatedImages[0].isDefault = true;
    }

    setProductData({
      ...productData,
      images: updatedImages,
    });
  };

  const handleSetDefaultImage = (imageId: string) => {
    setProductData({
      ...productData,
      images: productData.images.map((img) => ({
        ...img,
        isDefault: img.id === imageId,
      })),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // Validate required fields
      if (
        !productData.name ||
        !productData.sku ||
        !productData.price ||
        !productData.categoryId
      ) {
        throw new Error("Please fill in all required fields");
      }

      // In a real app, you would send this data to your API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccessMessage("Product created successfully!");

      // In a real app, you might redirect to the product list or the new product's edit page
      setTimeout(() => {
        window.location.href = "/admin/products";
      }, 2000);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "An error occurred while creating the product",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RoleGuard allowedRoles={["ADMIN", "MANAGER"]}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <a
                  href="/admin/products"
                  className="mr-4 text-gray-400 hover:text-gray-600"
                >
                  <ArrowLeft className="h-5 w-5" />
                </a>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Add New Product
                  </h1>
                  <p className="text-sm text-gray-600">
                    Create a new product in your catalog
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => (window.location.href = "/admin/products")}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Product
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Success/Error Messages */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-md flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-md">
                  <div className="border-b">
                    <nav className="flex -mb-px">
                      <button
                        type="button"
                        onClick={() => setActiveTab("basic")}
                        className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                          activeTab === "basic"
                            ? "border-primary-500 text-primary-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        Basic Information
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("images")}
                        className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                          activeTab === "images"
                            ? "border-primary-500 text-primary-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        Images
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("inventory")}
                        className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                          activeTab === "inventory"
                            ? "border-primary-500 text-primary-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        Inventory
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("seo")}
                        className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                          activeTab === "seo"
                            ? "border-primary-500 text-primary-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        SEO
                      </button>
                    </nav>
                  </div>

                  <div className="p-6">
                    {/* Basic Information Tab */}
                    {activeTab === "basic" && (
                      <div className="space-y-6">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Product Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={productData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Enter product name"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Description
                          </label>
                          <textarea
                            id="description"
                            name="description"
                            value={productData.description}
                            onChange={handleInputChange}
                            rows={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Enter product description"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label
                              htmlFor="categoryId"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Category <span className="text-red-500">*</span>
                            </label>
                            <select
                              id="categoryId"
                              name="categoryId"
                              value={productData.categoryId}
                              onChange={handleInputChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                            >
                              <option value="">Select a category</option>
                              {mockCategories.map((category) => (
                                <option key={category.id} value={category.id}>
                                  {category.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label
                              htmlFor="status"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Status
                            </label>
                            <select
                              id="status"
                              name="status"
                              value={productData.status}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                            >
                              <option value="draft">Draft</option>
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tags
                          </label>
                          <div className="flex items-center">
                            <input
                              type="text"
                              value={currentTag}
                              onChange={(e) => setCurrentTag(e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                              placeholder="Add a tag"
                              onKeyPress={(e) =>
                                e.key === "Enter" &&
                                (e.preventDefault(), handleAddTag())
                              }
                            />
                            <button
                              type="button"
                              onClick={handleAddTag}
                              className="px-4 py-2 bg-gray-100 border border-gray-300 border-l-0 rounded-r-md hover:bg-gray-200"
                            >
                              <Plus className="h-5 w-5 text-gray-600" />
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {productData.tags.map((tag) => (
                              <div
                                key={tag}
                                className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1"
                              >
                                <Tag className="h-3 w-3 text-gray-500 mr-1" />
                                <span className="text-sm text-gray-700">
                                  {tag}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTag(tag)}
                                  className="ml-1 text-gray-500 hover:text-gray-700"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Images Tab */}
                    {activeTab === "images" && (
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product Images
                          </label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                            <div className="text-center">
                              <Upload className="mx-auto h-12 w-12 text-gray-400" />
                              <div className="mt-2">
                                <label
                                  htmlFor="image-upload"
                                  className="cursor-pointer"
                                >
                                  <span className="mt-2 block text-sm font-medium text-primary-600 hover:text-primary-500">
                                    Upload images
                                  </span>
                                  <input
                                    id="image-upload"
                                    name="images"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="sr-only"
                                  />
                                </label>
                                <p className="mt-1 text-xs text-gray-500">
                                  PNG, JPG, GIF up to 5MB
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {productData.images.length > 0 && (
                          <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-2">
                              Uploaded Images
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                              {productData.images.map((image) => (
                                <div
                                  key={image.id}
                                  className="relative border rounded-lg overflow-hidden group"
                                >
                                  <Image
                                    src={image.url}
                                    alt={image.alt}
                                    layout="fill"
                                    objectFit="cover"
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleSetDefaultImage(image.id)
                                      }
                                      className={`p-1 rounded-full ${image.isDefault ? "bg-green-500" : "bg-gray-200 hover:bg-white"}`}
                                      title={
                                        image.isDefault
                                          ? "Default image"
                                          : "Set as default"
                                      }
                                    >
                                      <CheckCircle
                                        className={`h-5 w-5 ${image.isDefault ? "text-white" : "text-gray-600"}`}
                                      />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleRemoveImage(image.id)
                                      }
                                      className="p-1 rounded-full bg-red-500 hover:bg-red-600"
                                      title="Remove image"
                                    >
                                      <Trash2 className="h-5 w-5 text-white" />
                                    </button>
                                  </div>
                                  {image.isDefault && (
                                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                      Default
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Inventory Tab */}
                    {activeTab === "inventory" && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label
                              htmlFor="sku"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              SKU <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              id="sku"
                              name="sku"
                              value={productData.sku}
                              onChange={handleInputChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                              placeholder="Enter SKU"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="barcode"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Barcode (ISBN, UPC, GTIN, etc.)
                            </label>
                            <input
                              type="text"
                              id="barcode"
                              name="barcode"
                              value={productData.barcode}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                              placeholder="Enter barcode"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <label
                              htmlFor="inventory"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Inventory
                            </label>
                            <input
                              type="number"
                              id="inventory"
                              name="inventory"
                              value={productData.inventory}
                              onChange={handleInputChange}
                              min="0"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="weight"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Weight (kg)
                            </label>
                            <input
                              type="number"
                              id="weight"
                              name="weight"
                              value={productData.weight}
                              onChange={handleInputChange}
                              step="0.01"
                              min="0"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SEO Tab */}
                    {activeTab === "seo" && (
                      <div className="space-y-6">
                        <div>
                          <label
                            htmlFor="seo.title"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            SEO Title
                          </label>
                          <input
                            type="text"
                            id="seo.title"
                            name="seo.title"
                            value={productData.seo.title}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Enter SEO title"
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            Leave blank to use product name
                          </p>
                        </div>

                        <div>
                          <label
                            htmlFor="seo.description"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Meta Description
                          </label>
                          <textarea
                            id="seo.description"
                            name="seo.description"
                            value={productData.seo.description}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Enter meta description"
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            Recommended: 150-160 characters
                          </p>
                        </div>

                        <div>
                          <label
                            htmlFor="seo.keywords"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Meta Keywords
                          </label>
                          <input
                            type="text"
                            id="seo.keywords"
                            name="seo.keywords"
                            value={productData.seo.keywords}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Enter keywords separated by commas"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Pricing Card */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Pricing
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="price"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Price <span className="text-red-500">*</span>
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          id="price"
                          name="price"
                          value={productData.price}
                          onChange={handleInputChange}
                          required
                          step="0.01"
                          min="0"
                          className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="compareAtPrice"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Compare at Price
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          id="compareAtPrice"
                          name="compareAtPrice"
                          value={productData.compareAtPrice}
                          onChange={handleInputChange}
                          step="0.01"
                          min="0"
                          className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                          placeholder="0.00"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Original price for showing discounts
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="cost"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Cost per Item
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          id="cost"
                          name="cost"
                          value={productData.cost}
                          onChange={handleInputChange}
                          step="0.01"
                          min="0"
                          className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                          placeholder="0.00"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Used to calculate profit margins
                      </p>
                    </div>
                  </div>
                </div>

                {/* Organization Card */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Organization
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="categoryId"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Product Type
                      </label>
                      <select
                        id="productType"
                        name="productType"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Select a product type</option>
                        <option value="physical">Physical Product</option>
                        <option value="digital">Digital Product</option>
                        <option value="service">Service</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="vendor"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Vendor
                      </label>
                      <input
                        type="text"
                        id="vendor"
                        name="vendor"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter vendor name"
                      />
                    </div>
                  </div>
                </div>

                {/* Preview Card */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Product Preview
                  </h2>
                  <div className="flex items-center justify-center p-4 bg-gray-100 rounded-lg">
                    {productData.images.length > 0 ? (
                      <img
                        src={
                          productData.images.find((img) => img.isDefault)
                            ?.url || productData.images[0].url
                        }
                        alt="Product preview"
                        className="max-h-32 object-contain"
                      />
                    ) : (
                      <div className="w-full h-32 flex items-center justify-center bg-gray-200 rounded-md">
                        <Package className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <h3 className="font-medium text-gray-900">
                      {productData.name || "Product Name"}
                    </h3>
                    {productData.price && (
                      <div className="mt-1 flex items-center">
                        <span className="text-lg font-bold text-gray-900">
                          ${parseFloat(productData.price).toFixed(2)}
                        </span>
                        {productData.compareAtPrice &&
                          parseFloat(productData.compareAtPrice) > 0 && (
                            <span className="ml-2 text-sm text-gray-500 line-through">
                              $
                              {parseFloat(productData.compareAtPrice).toFixed(
                                2,
                              )}
                            </span>
                          )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </RoleGuard>
  );
}
