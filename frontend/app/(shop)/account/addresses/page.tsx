"use client";

import { useState, useEffect } from "react";
import { MapPin, Plus, Edit, Trash2, Star, Home, Building } from "lucide-react";

// Types
interface Address {
  id: string;
  type: "home" | "work" | "other";
  firstName: string;
  lastName: string;
  company?: string;
  street: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

// Mock data - in a real app, this would come from API
const mockAddresses: Address[] = [
  {
    id: "1",
    type: "home",
    firstName: "John",
    lastName: "Doe",
    street: "123 Main Street",
    street2: "Apt 4B",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "USA",
    phone: "+1 (555) 123-4567",
    isDefault: true,
  },
  {
    id: "2",
    type: "work",
    firstName: "John",
    lastName: "Doe",
    company: "Tech Corp",
    street: "456 Business Ave",
    city: "New York",
    state: "NY",
    zipCode: "10002",
    country: "USA",
    phone: "+1 (555) 987-6543",
    isDefault: false,
  },
];

const initialFormData: Omit<Address, "id"> = {
  type: "home",
  firstName: "",
  lastName: "",
  company: "",
  street: "",
  street2: "",
  city: "",
  state: "",
  zipCode: "",
  country: "USA",
  phone: "",
  isDefault: false,
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] =
    useState<Omit<Address, "id">>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // TODO: Fetch addresses from API
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const openModal = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
      setFormData({
        type: address.type,
        firstName: address.firstName,
        lastName: address.lastName,
        company: address.company || "",
        street: address.street,
        street2: address.street2 || "",
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
        phone: address.phone || "",
        isDefault: address.isDefault,
      });
    } else {
      setEditingAddress(null);
      setFormData(initialFormData);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
    setFormData(initialFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingAddress) {
        // Update existing address
        setAddresses((prev) =>
          prev.map((addr) =>
            addr.id === editingAddress.id
              ? { ...formData, id: editingAddress.id }
              : formData.isDefault
                ? { ...addr, isDefault: false }
                : addr,
          ),
        );
      } else {
        // Add new address
        const newAddress: Address = {
          ...formData,
          id: Date.now().toString(),
        };

        setAddresses((prev) => {
          if (formData.isDefault) {
            return [
              ...prev.map((addr) => ({ ...addr, isDefault: false })),
              newAddress,
            ];
          }
          return [...prev, newAddress];
        });
      }

      closeModal();
      // TODO: API call to save address
    } catch (error) {
      console.error("Error saving address:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (addressId: string) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        setAddresses((prev) => prev.filter((addr) => addr.id !== addressId));
        // TODO: API call to delete address
      } catch (error) {
        console.error("Error deleting address:", error);
      }
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          isDefault: addr.id === addressId,
        })),
      );
      // TODO: API call to set default address
    } catch (error) {
      console.error("Error setting default address:", error);
    }
  };

  const getAddressTypeIcon = (type: string) => {
    switch (type) {
      case "home":
        return <Home className="h-5 w-5 text-gray-400" />;
      case "work":
        return <Building className="h-5 w-5 text-gray-400" />;
      default:
        return <MapPin className="h-5 w-5 text-gray-400" />;
    }
  };

  const formatAddress = (address: Address) => {
    const parts = [
      address.street,
      address.street2,
      `${address.city}, ${address.state} ${address.zipCode}`,
      address.country,
    ].filter(Boolean);
    return parts.join(", ");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Addresses</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your shipping and billing addresses
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Address
        </button>
      </div>

      {/* Addresses List */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`relative bg-white overflow-hidden shadow rounded-lg border-2 ${
              address.isDefault ? "border-indigo-500" : "border-gray-200"
            }`}
          >
            {address.isDefault && (
              <div className="absolute top-0 right-0 -mt-1 -mr-1">
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  <Star className="h-3 w-3 mr-1" />
                  Default
                </div>
              </div>
            )}

            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  {getAddressTypeIcon(address.type)}
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900 capitalize">
                      {address.type} Address
                    </h3>
                    <p className="text-sm text-gray-500">
                      {address.firstName} {address.lastName}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                {address.company && (
                  <p className="text-sm text-gray-600">{address.company}</p>
                )}
                <p className="text-sm text-gray-600">
                  {formatAddress(address)}
                </p>
                {address.phone && (
                  <p className="text-sm text-gray-600 mt-1">{address.phone}</p>
                )}
              </div>

              <div className="mt-6 flex justify-between">
                <div className="flex space-x-2">
                  <button
                    onClick={() => openModal(address)}
                    className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </button>
                </div>
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Set as Default
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {addresses.length === 0 && (
          <div className="col-span-full">
            <div className="text-center py-12">
              <MapPin className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No addresses
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding your first address.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => openModal()}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Address
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={closeModal}
            />

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        {editingAddress ? "Edit Address" : "Add New Address"}
                      </h3>

                      <div className="space-y-4">
                        {/* Address Type */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Address Type
                          </label>
                          <select
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <option value="home">Home</option>
                            <option value="work">Work</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              First Name *
                            </label>
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              required
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Last Name *
                            </label>
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              required
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>
                        </div>

                        {/* Company */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Company
                          </label>
                          <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>

                        {/* Street Address */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Street Address *
                          </label>
                          <input
                            type="text"
                            name="street"
                            value={formData.street}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>

                        {/* Street Address 2 */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Apartment, suite, etc.
                          </label>
                          <input
                            type="text"
                            name="street2"
                            value={formData.street2}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>

                        {/* City, State, ZIP */}
                        <div className="grid grid-cols-3 gap-4">
                          <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                              City *
                            </label>
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              required
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              State *
                            </label>
                            <input
                              type="text"
                              name="state"
                              value={formData.state}
                              onChange={handleInputChange}
                              required
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              ZIP Code *
                            </label>
                            <input
                              type="text"
                              name="zipCode"
                              value={formData.zipCode}
                              onChange={handleInputChange}
                              required
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Country *
                            </label>
                            <select
                              name="country"
                              value={formData.country}
                              onChange={handleInputChange}
                              required
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            >
                              <option value="USA">United States</option>
                              <option value="CAN">Canada</option>
                              <option value="HRV">Croatia</option>
                            </select>
                          </div>
                        </div>

                        {/* Phone */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>

                        {/* Default Address */}
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="isDefault"
                            checked={formData.isDefault}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label className="ml-2 block text-sm text-gray-900">
                            Set as default address
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {isSubmitting
                      ? "Saving..."
                      : editingAddress
                        ? "Update Address"
                        : "Add Address"}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
