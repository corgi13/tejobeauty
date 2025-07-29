"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Package,
  Tag,
  Eye,
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";
import RoleGuard from "@/lib/auth/role-guard";

// Mock product data
const mockProducts = [
  {
    id: "P-1001",
    name: "Premium Nail Polish - Ruby Red",
    sku: "NP-RR-001",
    price: 12.99,
    compareAtPrice: 14.99,
    category: "Nail Polish",
    inventory: 45,
    status: "active",
    createdAt: "2024-06-15T10:24:32",
    updatedAt: "2024-07-10T14:35:22",
    image: "/api/placeholder/150/150",
  },
  {
    id: "P-1002",
    name: "Premium Nail Polish - Sapphire Blue",
    sku: "NP-SB-002",
    price: 12.99,
    compareAtPrice: 14.99,
    category: "Nail Polish",
    inventory: 38,
    status: "active",
    createdAt: "2024-06-15T10:26:12",
    updatedAt: "2024-07-10T14:35:22",
    image: "/api/placeholder/150/150",
  },
  {
    id: "P-1042",
    name: "Cuticle Oil Treatment",
    sku: "CO-TR-042",
    price: 24.99,
    compareAtPrice: null,
    category: "Nail Care",
    inventory: 8,
    status: "active",
    createdAt: "2024-06-22T09:14:32",
    updatedAt: "2024-07-12T11:22:45",
    image: "/api/placeholder/150/150",
  },
  {
    id: "P-2031",
    name: "Professional Nail File Set",
    sku: "NF-PR-031",
    price: 18.99,
    compareAtPrice: 22.99,
    category: "Tools",
    inventory: 12,
    status: "active",
    createdAt: "2024-05-18T14:24:32",
    updatedAt: "2024-07-05T16:42:18",
    image: "/api/placeholder/150/150",
  },
  {
    id: "P-2089",
    name: "Professional LED Nail Lamp",
    sku: "NL-LED-089",
    price: 79.99,
    compareAtPrice: 99.99,
    category: "Equipment",
    inventory: 25,
    status: "active",
    createdAt: "2024-04-12T11:34:22",
    updatedAt: "2024-07-01T10:15:42",
    image: "/api/placeholder/150/150",
  },
  {
    id: "P-1567",
    name: "Premium Nail Polish Collection",
    sku: "NP-COL-567",
    price: 35.99,
    compareAtPrice: 45.99,
    category: "Nail Polish",
    inventory: 18,
    status: "active",
    createdAt: "2024-06-05T15:44:32",
    updatedAt: "2024-07-08T09:35:12",
    image: "/api/placeholder/150/150",
  },
  {
    id: "P-3045",
    name: "Cuticle Care Essential Kit",
    sku: "CC-KIT-045",
    price: 29.99,
    compareAtPrice: 34.99,
    category: "Nail Care",
    inventory: 22,
    status: "active",
    createdAt: "2024-05-28T13:24:32",
    updatedAt: "2024-07-14T11:35:22",
    image: "/api/placeholder/150/150",
  },
  {
    id: "P-2256",
    name: "Professional Nail File Bundle",
    sku: "NF-BUN-256",
    price: 14.99,
    compareAtPrice: null,
    category: "Tools",
    inventory: 32,
    status: "active",
    createdAt: "2024-06-18T10:24:32",
    updatedAt: "2024-07-10T14:35:22",
    image: "/api/placeholder/150/150",
  },
  {
    id: "P-4001",
    name: "Nail Art Brush Set - Deluxe",
    sku: "NA-BR-001",
    price: 24.99,
    compareAtPrice: 29.99,
    category: "Tools",
    inventory: 0,
    status: "out_of_stock",
    createdAt: "2024-06-10T10:24:32",
    updatedAt: "2024-07-15T14:35:22",
    image: "/api/placeholder/150/150",
  },
  {
    id: "P-5001",
    name: "Nail Polish Remover - Acetone Free",
    sku: "NPR-AF-001",
    price: 8.99,
    compareAtPrice: null,
    category: "Nail Care",
    inventory: 42,
    status: "active",
    createdAt: "2024-06-20T10:24:32",
    updatedAt: "2024-07-12T14:35:22",
    image: "/api/placeholder/150/150",
  },
];

// Mock categories
const mockCategories = [
  { id: "cat-1", name: "Nail Polish" },
  { id: "cat-2", name: "Nail Care" },
  { id: "cat-3", name: "Tools" },
  { id: "cat-4", name: "Equipment" },
  { id: "cat-5", name: "Kits & Bundles" },
];

export default function ProductsPage() {
  const [products, setProducts] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [bulkAction, setBulkAction] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Filter products based on search, category, and status
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || product.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortBy === "price") {
      return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
    } else if (sortBy === "inventory") {
      return sortOrder === "asc"
        ? a.inventory - b.inventory
        : b.inventory - a.inventory;
    } else if (sortBy === "createdAt") {
      return sortOrder === "asc"
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProducts(currentItems.map((product) => product.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      setProducts(products.filter((product) => product.id !== productToDelete));
      setSuccessMessage("Product deleted successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleBulkAction = () => {
    if (!bulkAction || selectedProducts.length === 0) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (bulkAction === "delete") {
        setProducts(
          products.filter((product) => !selectedProducts.includes(product.id)),
        );
        setSuccessMessage(
          `${selectedProducts.length} products deleted successfully`,
        );
      } else if (bulkAction === "activate") {
        setProducts(
          products.map((product) =>
            selectedProducts.includes(product.id)
              ? { ...product, status: "active" }
              : product,
          ),
        );
        setSuccessMessage(
          `${selectedProducts.length} products activated successfully`,
        );
      } else if (bulkAction === "deactivate") {
        setProducts(
          products.map((product) =>
            selectedProducts.includes(product.id)
              ? { ...product, status: "inactive" }
              : product,
          ),
        );
        setSuccessMessage(
          `${selectedProducts.length} products deactivated successfully`,
        );
      }

      setSelectedProducts([]);
      setBulkAction("");
      setIsLoading(false);

      setTimeout(() => setSuccessMessage(""), 3000);
    }, 1000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <RoleGuard allowedRoles={["ADMIN", "MANAGER"]}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Product Management
                </h1>
                <p className="text-sm text-gray-600">
                  Manage your product catalog, inventory, and categories
                </p>
              </div>
              <div>
                <a
                  href="/admin/products/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-md flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                {successMessage}
              </div>
              <button onClick={() => setSuccessMessage("")}>
                <X className="h-5 w-5 text-green-800" />
              </button>
            </div>
          )}

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search products or SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full sm:w-64"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    {mockCategories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                  <Filter className="h-4 w-4 mr-2 text-gray-600" />
                  <span>More Filters</span>
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                  <Download className="h-4 w-4 mr-2 text-gray-600" />
                  <span>Export</span>
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                  <Upload className="h-4 w-4 mr-2 text-gray-600" />
                  <span>Import</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedProducts.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-blue-700 font-medium">
                  {selectedProducts.length} products selected
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Bulk Actions</option>
                  <option value="delete">Delete</option>
                  <option value="activate">Activate</option>
                  <option value="deactivate">Deactivate</option>
                </select>
                <button
                  onClick={handleBulkAction}
                  disabled={!bulkAction || isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isLoading ? "Processing..." : "Apply"}
                </button>
              </div>
            </div>
          )}

          {/* Products Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={
                            selectedProducts.length === currentItems.length &&
                            currentItems.length > 0
                          }
                          onChange={handleSelectAll}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("price")}
                    >
                      <div className="flex items-center">
                        Price
                        {sortBy === "price" &&
                          (sortOrder === "asc" ? (
                            <ChevronRight className="h-4 w-4 ml-1 transform rotate-90" />
                          ) : (
                            <ChevronRight className="h-4 w-4 ml-1 transform -rotate-90" />
                          ))}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("inventory")}
                    >
                      <div className="flex items-center">
                        Inventory
                        {sortBy === "inventory" &&
                          (sortOrder === "asc" ? (
                            <ChevronRight className="h-4 w-4 ml-1 transform rotate-90" />
                          ) : (
                            <ChevronRight className="h-4 w-4 ml-1 transform -rotate-90" />
                          ))}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("createdAt")}
                    >
                      <div className="flex items-center">
                        Created
                        {sortBy === "createdAt" &&
                          (sortOrder === "asc" ? (
                            <ChevronRight className="h-4 w-4 ml-1 transform rotate-90" />
                          ) : (
                            <ChevronRight className="h-4 w-4 ml-1 transform -rotate-90" />
                          ))}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleSelectProduct(product.id)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 mr-4">
                            <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              SKU: {product.sku}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatCurrency(product.price)}
                        </div>
                        {product.compareAtPrice && (
                          <div className="text-xs text-gray-500 line-through">
                            {formatCurrency(product.compareAtPrice)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`text-sm ${product.inventory <= 10 ? "text-red-600 font-medium" : "text-gray-900"}`}
                        >
                          {product.inventory} in stock
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.status === "active"
                              ? "bg-green-100 text-green-800"
                              : product.status === "out_of_stock"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {product.status === "active"
                            ? "Active"
                            : product.status === "out_of_stock"
                              ? "Out of Stock"
                              : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(product.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-3">
                          <a
                            href={`/products/${product.id}`}
                            target="_blank"
                            className="text-gray-400 hover:text-gray-600"
                            title="View product"
                          >
                            <Eye className="h-5 w-5" />
                          </a>
                          <a
                            href={`/admin/products/${product.id}/edit`}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit product"
                          >
                            <Edit className="h-5 w-5" />
                          </a>
                          <button
                            onClick={() => handleDeleteClick(product.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete product"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">{indexOfFirstItem + 1}</span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(indexOfLastItem, sortedProducts.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">{sortedProducts.length}</span>{" "}
                    products
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() =>
                        handlePageChange(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === pageNum
                              ? "z-10 bg-primary-50 border-primary-500 text-primary-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() =>
                        handlePageChange(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-center mb-4 text-red-600">
              <AlertCircle className="h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
              Delete Product
            </h3>
            <p className="text-gray-500 text-center mb-6">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </RoleGuard>
  );
}
