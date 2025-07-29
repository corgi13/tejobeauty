"use client";

import { useState } from "react";
import {
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  Globe,
  Upload,
  Download,
  Trash2,
  Edit,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  FileText,
  Camera,
} from "lucide-react";

// Mock professional profile data
const mockProfile = {
  personalInfo: {
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@elegantails.com",
    phone: "+1 (555) 123-4567",
    profileImage: null,
  },
  businessInfo: {
    businessName: "Elegant Nails Salon",
    businessType: "salon",
    yearsInBusiness: "3-5",
    businessAddress: "123 Beauty Street, New York, NY 10001",
    businessPhone: "+1 (555) 987-6543",
    website: "https://www.elegantnails.com",
    socialMedia: "@elegantnails_nyc",
    taxId: "12-3456789",
    licenseNumber: "NY-NAIL-2021-001234",
    description:
      "Premium nail salon offering professional manicures, pedicures, and nail art services in the heart of Manhattan.",
  },
  verificationStatus: {
    status: "verified",
    verifiedDate: "2024-01-15",
    commissionTier: "Gold",
    commissionRate: 15,
  },
  documents: [
    {
      id: "1",
      name: "Business License",
      type: "business_license",
      fileName: "business_license_2024.pdf",
      uploadDate: "2024-01-10",
      status: "approved",
      size: "2.3 MB",
    },
    {
      id: "2",
      name: "Professional Certification",
      type: "certification",
      fileName: "nail_tech_certification.pdf",
      uploadDate: "2024-01-10",
      status: "approved",
      size: "1.8 MB",
    },
    {
      id: "3",
      name: "Tax ID Document",
      type: "tax_document",
      fileName: "tax_id_verification.pdf",
      uploadDate: "2024-01-10",
      status: "approved",
      size: "1.2 MB",
    },
  ],
};

export default function ProfessionalProfilePage() {
  const [profile, setProfile] = useState(mockProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [formData, setFormData] = useState(profile);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState(false);

  const handleInputChange = (section: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const handleSave = async (section: string) => {
    setIsSubmitting(true);
    try {
      // TODO: API call to update profile
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProfile(formData);
      setEditingSection(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = (section: string) => {
    setFormData(profile);
    setEditingSection(null);
    setIsEditing(false);
  };

  const handleDocumentUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadingDocument(true);
    try {
      // TODO: API call to upload document
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newDocument = {
        id: Date.now().toString(),
        name: "New Document",
        type: "other",
        fileName: files[0].name,
        uploadDate: new Date().toISOString().split("T")[0],
        status: "pending" as const,
        size: `${(files[0].size / (1024 * 1024)).toFixed(1)} MB`,
      };

      setProfile((prev) => ({
        ...prev,
        documents: [...prev.documents, newDocument],
      }));
    } catch (error) {
      console.error("Error uploading document:", error);
    } finally {
      setUploadingDocument(false);
    }
  };

  const handleDocumentDelete = async (documentId: string) => {
    if (!window.confirm("Are you sure you want to delete this document?"))
      return;

    try {
      // TODO: API call to delete document
      setProfile((prev) => ({
        ...prev,
        documents: prev.documents.filter((doc) => doc.id !== documentId),
      }));
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
      case "verified":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "pending":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case "rejected":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
      case "verified":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Professional Profile
        </h1>
        <p className="text-gray-600">
          Manage your professional information and verification documents
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Profile Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </h2>
              {editingSection !== "personalInfo" && (
                <button
                  onClick={() => {
                    setEditingSection("personalInfo");
                    setIsEditing(true);
                  }}
                  className="text-primary-600 hover:text-primary-700 flex items-center"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
              )}
            </div>

            {editingSection === "personalInfo" ? (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.personalInfo.firstName}
                      onChange={(e) =>
                        handleInputChange(
                          "personalInfo",
                          "firstName",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.personalInfo.lastName}
                      onChange={(e) =>
                        handleInputChange(
                          "personalInfo",
                          "lastName",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.personalInfo.email}
                    onChange={(e) =>
                      handleInputChange("personalInfo", "email", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.personalInfo.phone}
                    onChange={(e) =>
                      handleInputChange("personalInfo", "phone", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleSave("personalInfo")}
                    disabled={isSubmitting}
                    className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center disabled:opacity-50"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    {isSubmitting ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => handleCancel("personalInfo")}
                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 flex items-center"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                    <User className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {profile.personalInfo.firstName}{" "}
                      {profile.personalInfo.lastName}
                    </h3>
                    <p className="text-gray-600">
                      {profile.businessInfo.businessName}
                    </p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">
                      {profile.personalInfo.email}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">
                      {profile.personalInfo.phone}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Business Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Business Information
              </h2>
              {editingSection !== "businessInfo" && (
                <button
                  onClick={() => {
                    setEditingSection("businessInfo");
                    setIsEditing(true);
                  }}
                  className="text-primary-600 hover:text-primary-700 flex items-center"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
              )}
            </div>

            {editingSection === "businessInfo" ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={formData.businessInfo.businessName}
                    onChange={(e) =>
                      handleInputChange(
                        "businessInfo",
                        "businessName",
                        e.target.value,
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Type
                    </label>
                    <select
                      value={formData.businessInfo.businessType}
                      onChange={(e) =>
                        handleInputChange(
                          "businessInfo",
                          "businessType",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="salon">Nail Salon</option>
                      <option value="spa">Spa</option>
                      <option value="freelance">Freelance Nail Artist</option>
                      <option value="distributor">Distributor</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years in Business
                    </label>
                    <select
                      value={formData.businessInfo.yearsInBusiness}
                      onChange={(e) =>
                        handleInputChange(
                          "businessInfo",
                          "yearsInBusiness",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="0-1">Less than 1 year</option>
                      <option value="1-3">1-3 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="5+">5+ years</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Address
                  </label>
                  <input
                    type="text"
                    value={formData.businessInfo.businessAddress}
                    onChange={(e) =>
                      handleInputChange(
                        "businessInfo",
                        "businessAddress",
                        e.target.value,
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.businessInfo.businessPhone}
                      onChange={(e) =>
                        handleInputChange(
                          "businessInfo",
                          "businessPhone",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={formData.businessInfo.website}
                      onChange={(e) =>
                        handleInputChange(
                          "businessInfo",
                          "website",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Social Media
                  </label>
                  <input
                    type="text"
                    value={formData.businessInfo.socialMedia}
                    onChange={(e) =>
                      handleInputChange(
                        "businessInfo",
                        "socialMedia",
                        e.target.value,
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Description
                  </label>
                  <textarea
                    value={formData.businessInfo.description}
                    onChange={(e) =>
                      handleInputChange(
                        "businessInfo",
                        "description",
                        e.target.value,
                      )
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleSave("businessInfo")}
                    disabled={isSubmitting}
                    className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center disabled:opacity-50"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    {isSubmitting ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => handleCancel("businessInfo")}
                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 flex items-center"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {profile.businessInfo.businessName}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {profile.businessInfo.description}
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Building className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600 capitalize">
                      {profile.businessInfo.businessType}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">
                      {profile.businessInfo.businessAddress}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">
                      {profile.businessInfo.businessPhone}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 text-gray-400 mr-2" />
                    <a
                      href={profile.businessInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      {profile.businessInfo.website}
                    </a>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <span className="text-sm text-gray-500">Tax ID:</span>
                    <span className="ml-2 text-gray-900">
                      {profile.businessInfo.taxId}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">License:</span>
                    <span className="ml-2 text-gray-900">
                      {profile.businessInfo.licenseNumber}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Documents */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Verification Documents
              </h2>
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  id="document-upload"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleDocumentUpload}
                  className="hidden"
                />
                <label
                  htmlFor="document-upload"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center cursor-pointer"
                >
                  <Upload className="h-4 w-4 mr-1" />
                  {uploadingDocument ? "Uploading..." : "Upload Document"}
                </label>
              </div>
            </div>

            <div className="space-y-4">
              {profile.documents.map((document) => (
                <div
                  key={document.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getStatusIcon(document.status)}
                      <div className="ml-3">
                        <h4 className="font-medium text-gray-900">
                          {document.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {document.fileName} • {document.size} • Uploaded{" "}
                          {new Date(document.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}
                      >
                        {document.status}
                      </span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDocumentDelete(document.id)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Verification Status */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Verification Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center">
                {getStatusIcon(profile.verificationStatus.status)}
                <div className="ml-3">
                  <p className="font-medium text-gray-900">
                    Verified Professional
                  </p>
                  <p className="text-sm text-gray-500">
                    Verified on{" "}
                    {new Date(
                      profile.verificationStatus.verifiedDate,
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">
                    Commission Tier:
                  </span>
                  <span className="font-medium text-gray-900">
                    {profile.verificationStatus.commissionTier}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Commission Rate:
                  </span>
                  <span className="font-medium text-gray-900">
                    {profile.verificationStatus.commissionRate}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center">
                <FileText className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">
                    View Commission Report
                  </p>
                  <p className="text-sm text-gray-500">
                    Download monthly earnings
                  </p>
                </div>
              </button>
              <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center">
                <Building className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">
                    Update Business Hours
                  </p>
                  <p className="text-sm text-gray-500">Manage availability</p>
                </div>
              </button>
              <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center">
                <Camera className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">
                    Update Profile Photo
                  </p>
                  <p className="text-sm text-gray-500">
                    Change your profile image
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
