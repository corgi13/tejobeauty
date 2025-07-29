"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  User,
  Edit,
  Trash2,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  Shield,
  CheckCircle,
  AlertCircle,
  X,
  Lock,
  Unlock,
  UserCheck,
  UserX,
} from "lucide-react";
import RoleGuard from "@/lib/auth/role-guard";

// Mock user data
const mockUsers = [
  {
    id: "USR-001",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@example.com",
    phone: "+1 (555) 123-4567",
    role: "CUSTOMER",
    status: "active",
    emailVerified: true,
    mfaEnabled: false,
    createdAt: "2024-01-15T10:24:32",
    lastLogin: "2024-07-16T14:35:22",
    orders: 12,
    totalSpent: 567.89,
  },
  {
    id: "USR-002",
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.chen@example.com",
    phone: "+1 (555) 987-6543",
    role: "CUSTOMER",
    status: "active",
    emailVerified: true,
    mfaEnabled: true,
    createdAt: "2024-02-22T09:14:32",
    lastLogin: "2024-07-17T08:12:15",
    orders: 8,
    totalSpent: 432.5,
  },
  {
    id: "USR-003",
    firstName: "Emma",
    lastName: "Rodriguez",
    email: "emma.rodriguez@example.com",
    phone: "+1 (555) 234-5678",
    role: "PROFESSIONAL",
    status: "active",
    emailVerified: true,
    mfaEnabled: false,
    createdAt: "2024-03-18T14:24:32",
    lastLogin: "2024-07-16T19:45:22",
    orders: 15,
    totalSpent: 1245.75,
    professionalInfo: {
      businessName: "Emma's Nail Studio",
      verified: true,
      commissionTier: "Gold",
    },
  },
  {
    id: "USR-004",
    firstName: "David",
    lastName: "Kim",
    email: "david.kim@example.com",
    phone: "+1 (555) 876-5432",
    role: "MANAGER",
    status: "active",
    emailVerified: true,
    mfaEnabled: true,
    createdAt: "2023-11-12T11:34:22",
    lastLogin: "2024-07-16T16:30:45",
    orders: 0,
    totalSpent: 0,
  },
  {
    id: "USR-005",
    firstName: "Lisa",
    lastName: "Patel",
    email: "lisa.patel@example.com",
    phone: "+1 (555) 345-6789",
    role: "CUSTOMER",
    status: "inactive",
    emailVerified: true,
    mfaEnabled: false,
    createdAt: "2024-04-05T15:44:32",
    lastLogin: "2024-06-16T14:22:18",
    orders: 3,
    totalSpent: 89.97,
  },
  {
    id: "USR-006",
    firstName: "James",
    lastName: "Wilson",
    email: "james.wilson@example.com",
    phone: "+1 (555) 456-7890",
    role: "PROFESSIONAL",
    status: "active",
    emailVerified: true,
    mfaEnabled: true,
    createdAt: "2024-01-28T13:24:32",
    lastLogin: "2024-07-15T11:34:56",
    orders: 22,
    totalSpent: 2345.67,
    professionalInfo: {
      businessName: "Wilson Nail Spa",
      verified: true,
      commissionTier: "Silver",
    },
  },
  {
    id: "USR-007",
    firstName: "Sophia",
    lastName: "Garcia",
    email: "sophia.garcia@example.com",
    phone: "+1 (555) 567-8901",
    role: "CUSTOMER",
    status: "active",
    emailVerified: false,
    mfaEnabled: false,
    createdAt: "2024-06-10T10:24:32",
    lastLogin: "2024-07-15T09:12:34",
    orders: 1,
    totalSpent: 45.99,
  },
  {
    id: "USR-008",
    firstName: "Robert",
    lastName: "Taylor",
    email: "robert.taylor@example.com",
    phone: "+1 (555) 678-9012",
    role: "ADMIN",
    status: "active",
    emailVerified: true,
    mfaEnabled: true,
    createdAt: "2023-10-15T08:30:00",
    lastLogin: "2024-07-17T07:45:12",
    orders: 0,
    totalSpent: 0,
  },
  {
    id: "USR-009",
    firstName: "Jennifer",
    lastName: "Brown",
    email: "jennifer.brown@example.com",
    phone: "+1 (555) 789-0123",
    role: "PROFESSIONAL",
    status: "pending",
    emailVerified: true,
    mfaEnabled: false,
    createdAt: "2024-07-01T14:22:45",
    lastLogin: "2024-07-01T14:30:22",
    orders: 0,
    totalSpent: 0,
    professionalInfo: {
      businessName: "Jennifer's Beauty Salon",
      verified: false,
      commissionTier: "Bronze",
    },
  },
  {
    id: "USR-010",
    firstName: "Daniel",
    lastName: "Martinez",
    email: "daniel.martinez@example.com",
    phone: "+1 (555) 890-1234",
    role: "CUSTOMER",
    status: "active",
    emailVerified: true,
    mfaEnabled: false,
    createdAt: "2024-05-20T09:15:30",
    lastLogin: "2024-07-14T16:42:18",
    orders: 5,
    totalSpent: 178.45,
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [bulkAction, setBulkAction] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // Filter users based on search, role, and status
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    const matchesStatus =
      selectedStatus === "all" || user.status === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === "name") {
      const nameA = `${a.firstName} ${a.lastName}`;
      const nameB = `${b.firstName} ${b.lastName}`;
      return sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    } else if (sortBy === "email") {
      return sortOrder === "asc"
        ? a.email.localeCompare(b.email)
        : b.email.localeCompare(a.email);
    } else if (sortBy === "createdAt") {
      return sortOrder === "asc"
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === "lastLogin") {
      return sortOrder === "asc"
        ? new Date(a.lastLogin).getTime() - new Date(b.lastLogin).getTime()
        : new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime();
    } else if (sortBy === "orders") {
      return sortOrder === "asc" ? a.orders - b.orders : b.orders - a.orders;
    }
    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUsers(currentItems.map((user) => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      setUsers(users.filter((user) => user.id !== userToDelete));
      setSuccessMessage("User deleted successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleBulkAction = () => {
    if (!bulkAction || selectedUsers.length === 0) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (bulkAction === "delete") {
        setUsers(users.filter((user) => !selectedUsers.includes(user.id)));
        setSuccessMessage(`${selectedUsers.length} users deleted successfully`);
      } else if (bulkAction === "activate") {
        setUsers(
          users.map((user) =>
            selectedUsers.includes(user.id)
              ? { ...user, status: "active" }
              : user,
          ),
        );
        setSuccessMessage(
          `${selectedUsers.length} users activated successfully`,
        );
      } else if (bulkAction === "deactivate") {
        setUsers(
          users.map((user) =>
            selectedUsers.includes(user.id)
              ? { ...user, status: "inactive" }
              : user,
          ),
        );
        setSuccessMessage(
          `${selectedUsers.length} users deactivated successfully`,
        );
      }

      setSelectedUsers([]);
      setBulkAction("");
      setIsLoading(false);

      setTimeout(() => setSuccessMessage(""), 3000);
    }, 1000);
  };

  const handleUserAction = (userId: string, action: string) => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (action === "activate") {
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, status: "active" } : user,
          ),
        );
        setSuccessMessage("User activated successfully");
      } else if (action === "deactivate") {
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, status: "inactive" } : user,
          ),
        );
        setSuccessMessage("User deactivated successfully");
      } else if (action === "verify") {
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, emailVerified: true } : user,
          ),
        );
        setSuccessMessage("User email verified successfully");
      } else if (action === "reset-password") {
        // In a real app, this would trigger a password reset email
        setSuccessMessage("Password reset email sent successfully");
      }

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

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "MANAGER":
        return "bg-purple-100 text-purple-800";
      case "PROFESSIONAL":
        return "bg-blue-100 text-blue-800";
      case "CUSTOMER":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
                  User Management
                </h1>
                <p className="text-sm text-gray-600">
                  Manage users, roles, and permissions
                </p>
              </div>
              <div>
                <a
                  href="/admin/users/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
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
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full sm:w-64"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">All Roles</option>
                    <option value="ADMIN">Admin</option>
                    <option value="MANAGER">Manager</option>
                    <option value="PROFESSIONAL">Professional</option>
                    <option value="CUSTOMER">Customer</option>
                  </select>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
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
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-blue-700 font-medium">
                  {selectedUsers.length} users selected
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Users List */}
            <div className="lg:col-span-2">
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
                                selectedUsers.length === currentItems.length &&
                                currentItems.length > 0
                              }
                              onChange={handleSelectAll}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                          </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div
                            className="flex items-center cursor-pointer"
                            onClick={() => handleSort("name")}
                          >
                            User
                            {sortBy === "name" &&
                              (sortOrder === "asc" ? (
                                <ChevronUp className="h-4 w-4 ml-1" />
                              ) : (
                                <ChevronDown className="h-4 w-4 ml-1" />
                              ))}
                          </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div
                            className="flex items-center cursor-pointer"
                            onClick={() => handleSort("email")}
                          >
                            Email
                            {sortBy === "email" &&
                              (sortOrder === "asc" ? (
                                <ChevronUp className="h-4 w-4 ml-1" />
                              ) : (
                                <ChevronDown className="h-4 w-4 ml-1" />
                              ))}
                          </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div
                            className="flex items-center cursor-pointer"
                            onClick={() => handleSort("createdAt")}
                          >
                            Joined
                            {sortBy === "createdAt" &&
                              (sortOrder === "asc" ? (
                                <ChevronUp className="h-4 w-4 ml-1" />
                              ) : (
                                <ChevronDown className="h-4 w-4 ml-1" />
                              ))}
                          </div>
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentItems.map((user) => (
                        <tr
                          key={user.id}
                          className={`hover:bg-gray-50 ${selectedUser === user.id ? "bg-blue-50" : ""}`}
                          onClick={() => setSelectedUser(user.id)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(user.id)}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleSelectUser(user.id);
                              }}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0 mr-4">
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <User className="h-6 w-6 text-gray-400" />
                                </div>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {user.firstName} {user.lastName}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {user.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {user.email}
                            </div>
                            <div className="text-xs text-gray-500">
                              {user.emailVerified ? (
                                <span className="inline-flex items-center text-green-600">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Verified
                                </span>
                              ) : (
                                <span className="inline-flex items-center text-yellow-600">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  Not verified
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}
                            >
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(user.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Navigate to user detail page
                                }}
                                className="text-blue-600 hover:text-blue-900"
                                title="Edit user"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteClick(user.id);
                                }}
                                className="text-red-600 hover:text-red-900"
                                title="Delete user"
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
                      onClick={() =>
                        handlePageChange(Math.max(1, currentPage - 1))
                      }
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
                        <span className="font-medium">
                          {indexOfFirstItem + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium">
                          {Math.min(indexOfLastItem, sortedUsers.length)}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium">
                          {sortedUsers.length}
                        </span>{" "}
                        users
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

                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
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
                          },
                        )}

                        <button
                          onClick={() =>
                            handlePageChange(
                              Math.min(totalPages, currentPage + 1),
                            )
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

            {/* User Details */}
            <div className="lg:col-span-1">
              {selectedUser ? (
                (() => {
                  const user = users.find((u) => u.id === selectedUser);
                  if (!user) return null;

                  return (
                    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">
                          User Details
                        </h2>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}
                        >
                          {user.role}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                          <User className="h-8 w-8 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </h3>
                          <p className="text-sm text-gray-500">{user.id}</p>
                        </div>
                      </div>

                      <div className="border-t pt-4 space-y-3">
                        <div className="flex items-start">
                          <Mail className="h-5 w-5 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm text-gray-900">
                              {user.email}
                            </div>
                            <div className="text-xs text-gray-500">
                              {user.emailVerified ? "Verified" : "Not verified"}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {user.phone}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm text-gray-900">
                              Joined {formatDate(user.createdAt)}
                            </div>
                            <div className="text-xs text-gray-500">
                              Last login: {formatDate(user.lastLogin)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Shield className="h-5 w-5 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm text-gray-900">
                              MFA: {user.mfaEnabled ? "Enabled" : "Disabled"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {user.role === "PROFESSIONAL" &&
                        user.professionalInfo && (
                          <div className="border-t pt-4">
                            <h3 className="text-sm font-medium text-gray-900 mb-2">
                              Professional Details
                            </h3>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-500">
                                  Business Name
                                </span>
                                <span className="text-sm text-gray-900">
                                  {user.professionalInfo.businessName}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-500">
                                  Verification
                                </span>
                                <span className="text-sm text-gray-900">
                                  {user.professionalInfo.verified
                                    ? "Verified"
                                    : "Pending"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-500">
                                  Commission Tier
                                </span>
                                <span className="text-sm text-gray-900">
                                  {user.professionalInfo.commissionTier}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                      {user.role === "CUSTOMER" && (
                        <div className="border-t pt-4">
                          <h3 className="text-sm font-medium text-gray-900 mb-2">
                            Customer Details
                          </h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500">
                                Orders
                              </span>
                              <span className="text-sm text-gray-900">
                                {user.orders}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500">
                                Total Spent
                              </span>
                              <span className="text-sm text-gray-900">
                                {formatCurrency(user.totalSpent)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* User Actions */}
                      <div className="border-t pt-4">
                        <h3 className="text-sm font-medium text-gray-900 mb-3">
                          User Actions
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {user.status === "active" ? (
                            <button
                              onClick={() =>
                                handleUserAction(user.id, "deactivate")
                              }
                              disabled={isLoading}
                              className="px-3 py-2 bg-gray-100 text-gray-800 rounded-md text-sm font-medium hover:bg-gray-200 flex items-center justify-center"
                            >
                              <UserX className="h-4 w-4 mr-1" />
                              Deactivate
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleUserAction(user.id, "activate")
                              }
                              disabled={isLoading}
                              className="px-3 py-2 bg-green-100 text-green-800 rounded-md text-sm font-medium hover:bg-green-200 flex items-center justify-center"
                            >
                              <UserCheck className="h-4 w-4 mr-1" />
                              Activate
                            </button>
                          )}

                          {!user.emailVerified && (
                            <button
                              onClick={() =>
                                handleUserAction(user.id, "verify")
                              }
                              disabled={isLoading}
                              className="px-3 py-2 bg-blue-100 text-blue-800 rounded-md text-sm font-medium hover:bg-blue-200 flex items-center justify-center"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Verify Email
                            </button>
                          )}

                          <button
                            onClick={() =>
                              handleUserAction(user.id, "reset-password")
                            }
                            disabled={isLoading}
                            className="px-3 py-2 bg-yellow-100 text-yellow-800 rounded-md text-sm font-medium hover:bg-yellow-200 flex items-center justify-center"
                          >
                            <Lock className="h-4 w-4 mr-1" />
                            Reset Password
                          </button>

                          <button
                            onClick={() => handleDeleteClick(user.id)}
                            disabled={isLoading}
                            className="px-3 py-2 bg-red-100 text-red-800 rounded-md text-sm font-medium hover:bg-red-200 flex items-center justify-center"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>

                      {/* Edit Button */}
                      <div className="pt-2">
                        <a
                          href={`/admin/users/${user.id}/edit`}
                          className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit User
                        </a>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No User Selected
                  </h3>
                  <p className="text-gray-500">Select a user to view details</p>
                </div>
              )}
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
              Delete User
            </h3>
            <p className="text-gray-500 text-center mb-6">
              Are you sure you want to delete this user? This action cannot be
              undone.
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
