"use client";

import { useState } from "react";
import {
  Star,
  Users,
  TrendingUp,
  Award,
  ArrowRight,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

// Mock professional status - in real app this would come from API/auth
const mockProfessionalStatus = {
  isRegistered: false,
  verificationStatus: "pending", // 'pending', 'approved', 'rejected', 'not_submitted'
  applicationDate: "2024-01-15",
  businessName: "Elegant Nails Salon",
};

export default function ProfessionalPage() {
  const [professionalStatus, setProfessionalStatus] = useState(
    mockProfessionalStatus,
  );
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    businessEmail: "",
    businessName: "",
    businessType: "",
    yearsInBusiness: "",
    businessAddress: "",
    businessPhone: "",
    taxId: "",
    licenseNumber: "",
    website: "",
    socialMedia: "",
    documents: [] as File[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        documents: [...prev.documents, ...Array.from(e.target.files!)],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Submit to API
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call

      setProfessionalStatus((prev) => ({
        ...prev,
        verificationStatus: "pending",
        applicationDate: new Date().toISOString().split("T")[0],
      }));

      setShowForm(false);
    } catch (error) {
      console.error("Error submitting application:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getVerificationStatusDisplay = () => {
    switch (professionalStatus.verificationStatus) {
      case "pending":
        return {
          icon: Clock,
          color: "text-yellow-600 bg-yellow-100",
          title: "Application Under Review",
          message:
            "We are currently reviewing your professional application. You will receive an email notification once the review is complete.",
        };
      case "approved":
        return {
          icon: CheckCircle,
          color: "text-green-600 bg-green-100",
          title: "Application Approved",
          message:
            "Congratulations! Your professional account has been approved. You now have access to professional pricing and features.",
        };
      case "rejected":
        return {
          icon: AlertCircle,
          color: "text-red-600 bg-red-100",
          title: "Application Needs Review",
          message:
            "We need additional information to complete your application. Please check your email for details or contact support.",
        };
      default:
        return null;
    }
  };

  const benefits = [
    {
      icon: TrendingUp,
      title: "Bulk Discounts",
      description: "Save up to 30% on bulk orders for your salon or business",
    },
    {
      icon: Star,
      title: "Priority Support",
      description: "Get dedicated customer support and faster response times",
    },
    {
      icon: Award,
      title: "Exclusive Products",
      description:
        "Access to professional-only products and new releases first",
    },
    {
      icon: Users,
      title: "Community Access",
      description: "Join our professional community and share tips with peers",
    },
  ];

  const stats = [
    { number: "5,000+", label: "Professional Members" },
    { number: "98%", label: "Satisfaction Rate" },
    { number: "24/7", label: "Support Available" },
    { number: "30%", label: "Average Savings" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Professional Nail Care Solutions
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              Join thousands of nail professionals who trust Tejo Nails for
              their business needs. Get exclusive access to professional
              products, bulk pricing, and dedicated support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Join Professional Program
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Professional Program?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We understand the unique needs of nail professionals and have
              designed our program to help your business thrive.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-lg mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Registration/Status Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Verification Status Display */}
            {professionalStatus.verificationStatus !== "not_submitted" && (
              <div className="mb-8">
                {(() => {
                  const statusDisplay = getVerificationStatusDisplay();
                  if (!statusDisplay) return null;

                  const Icon = statusDisplay.icon;
                  return (
                    <div
                      className={`p-6 rounded-lg border-2 ${statusDisplay.color.includes("yellow") ? "border-yellow-200" : statusDisplay.color.includes("green") ? "border-green-200" : "border-red-200"}`}
                    >
                      <div className="flex items-start">
                        <div
                          className={`flex-shrink-0 p-2 rounded-lg ${statusDisplay.color}`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {statusDisplay.title}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            {statusDisplay.message}
                          </p>
                          <div className="text-sm text-gray-500">
                            Application submitted:{" "}
                            {new Date(
                              professionalStatus.applicationDate,
                            ).toLocaleDateString()}
                          </div>
                          {professionalStatus.verificationStatus ===
                            "rejected" && (
                            <button
                              onClick={() => setShowForm(true)}
                              className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                            >
                              Update Application
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Registration Form */}
            {(professionalStatus.verificationStatus === "not_submitted" ||
              showForm) && (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {showForm ? "Update Application" : "Ready to Get Started?"}
                  </h2>
                  <p className="text-gray-600">
                    Fill out the form below to apply for our professional
                    program. We'll review your application and get back to you
                    within 24 hours.
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="bg-gray-50 p-8 rounded-lg"
                >
                  {/* Personal Information */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Personal Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Email *
                      </label>
                      <input
                        type="email"
                        name="businessEmail"
                        value={formData.businessEmail}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Business Information */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Business Information
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Business Name *
                        </label>
                        <input
                          type="text"
                          name="businessName"
                          value={formData.businessName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Business Type *
                          </label>
                          <select
                            name="businessType"
                            value={formData.businessType}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          >
                            <option value="">Select business type</option>
                            <option value="salon">Nail Salon</option>
                            <option value="spa">Spa</option>
                            <option value="freelance">
                              Freelance Nail Artist
                            </option>
                            <option value="distributor">Distributor</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Years in Business
                          </label>
                          <select
                            name="yearsInBusiness"
                            value={formData.yearsInBusiness}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          >
                            <option value="">Select years</option>
                            <option value="0-1">Less than 1 year</option>
                            <option value="1-3">1-3 years</option>
                            <option value="3-5">3-5 years</option>
                            <option value="5+">5+ years</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Business Address *
                        </label>
                        <input
                          type="text"
                          name="businessAddress"
                          value={formData.businessAddress}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Street address, city, state, zip code"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Business Phone *
                          </label>
                          <input
                            type="tel"
                            name="businessPhone"
                            value={formData.businessPhone}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tax ID / EIN
                          </label>
                          <input
                            type="text"
                            name="taxId"
                            value={formData.taxId}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Professional License Number
                          </label>
                          <input
                            type="text"
                            name="licenseNumber"
                            value={formData.licenseNumber}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Website
                          </label>
                          <input
                            type="url"
                            name="website"
                            value={formData.website}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="https://"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Social Media (Instagram, Facebook, etc.)
                        </label>
                        <input
                          type="text"
                          name="socialMedia"
                          value={formData.socialMedia}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="@username or profile URL"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Document Upload */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Supporting Documents
                    </h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <div className="text-sm text-gray-600 mb-4">
                          <label htmlFor="documents" className="cursor-pointer">
                            <span className="text-primary-600 hover:text-primary-500">
                              Upload documents
                            </span>
                            <span> or drag and drop</span>
                          </label>
                          <input
                            id="documents"
                            type="file"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          Business license, professional certifications, tax
                          documents (PDF, JPG, PNG up to 10MB each)
                        </p>
                      </div>
                      {formData.documents.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">
                            Uploaded Files:
                          </h4>
                          <ul className="text-sm text-gray-600">
                            {formData.documents.map((file, index) => (
                              <li
                                key={index}
                                className="flex items-center justify-between py-1"
                              >
                                <span>{file.name}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      documents: prev.documents.filter(
                                        (_, i) => i !== index,
                                      ),
                                    }))
                                  }
                                  className="text-red-600 hover:text-red-800"
                                >
                                  Remove
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Terms and Submit */}
                  <div className="mb-6">
                    <label className="flex items-start">
                      <input type="checkbox" className="mt-1 mr-3" required />
                      <span className="text-sm text-gray-600">
                        I agree to the{" "}
                        <a
                          href="#"
                          className="text-primary-600 hover:underline"
                        >
                          Terms of Service
                        </a>{" "}
                        and
                        <a
                          href="#"
                          className="text-primary-600 hover:underline"
                        >
                          {" "}
                          Privacy Policy
                        </a>
                        . I certify that all information provided is accurate
                        and complete.
                      </span>
                    </label>
                  </div>

                  <div className="flex gap-4">
                    {showForm && (
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          {showForm
                            ? "Update Application"
                            : "Submit Application"}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Already Approved State */}
            {professionalStatus.verificationStatus === "approved" && (
              <div className="text-center">
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-8 rounded-lg">
                  <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Welcome to the Professional Program!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    You now have access to exclusive professional features and
                    pricing.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                      Browse Professional Products
                    </button>
                    <button className="border border-primary-600 text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
                      View Dashboard
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
