"use client";

import { useState } from "react";
import {
  Download,
  Calendar,
  Filter,
  RefreshCw,
  FileText,
  Clock,
  BarChart3,
  PieChart,
  LineChart,
  Users,
  ShoppingBag,
  DollarSign,
  CheckCircle,
  X,
  ChevronDown,
  Plus,
  Settings,
  Mail,
  AlertTriangle,
  Eye,
  Search,
} from "lucide-react";
import RoleGuard from "@/lib/auth/role-guard";

// Mock report templates
const mockReportTemplates = [
  {
    id: "sales-summary",
    name: "Sales Summary",
    description:
      "Overview of sales performance with revenue, orders, and top products",
    category: "sales",
    lastGenerated: "2024-07-15T14:30:00",
    format: "pdf",
    scheduled: false,
  },
  {
    id: "user-growth",
    name: "User Growth Report",
    description: "Analysis of user acquisition, retention, and demographics",
    category: "users",
    lastGenerated: "2024-07-14T09:15:00",
    format: "excel",
    scheduled: true,
    schedule: {
      frequency: "weekly",
      day: "Monday",
      time: "08:00",
      recipients: ["marketing@tejonails.com", "admin@tejonails.com"],
    },
  },
  {
    id: "inventory-status",
    name: "Inventory Status",
    description:
      "Current inventory levels, low stock alerts, and restock recommendations",
    category: "products",
    lastGenerated: "2024-07-17T11:45:00",
    format: "csv",
    scheduled: true,
    schedule: {
      frequency: "daily",
      time: "07:30",
      recipients: ["inventory@tejonails.com"],
    },
  },
  {
    id: "marketing-performance",
    name: "Marketing Performance",
    description: "Analysis of marketing campaigns, conversion rates, and ROI",
    category: "marketing",
    lastGenerated: "2024-07-10T16:20:00",
    format: "pdf",
    scheduled: false,
  },
  {
    id: "professional-commissions",
    name: "Professional Commissions",
    description: "Summary of professional commissions, tiers, and payouts",
    category: "professionals",
    lastGenerated: "2024-07-01T10:00:00",
    format: "excel",
    scheduled: true,
    schedule: {
      frequency: "monthly",
      day: "1",
      time: "09:00",
      recipients: ["finance@tejonails.com"],
    },
  },
];

// Mock report history
const mockReportHistory = [
  {
    id: "rep-001",
    name: "Sales Summary - July 2024",
    template: "Sales Summary",
    generatedAt: "2024-07-15T14:30:00",
    generatedBy: "Admin User",
    format: "pdf",
    size: "1.2 MB",
    status: "completed",
  },
  {
    id: "rep-002",
    name: "User Growth Report - Q2 2024",
    template: "User Growth Report",
    generatedAt: "2024-07-14T09:15:00",
    generatedBy: "System (Scheduled)",
    format: "excel",
    size: "3.5 MB",
    status: "completed",
  },
  {
    id: "rep-003",
    name: "Inventory Status - July 17, 2024",
    template: "Inventory Status",
    generatedAt: "2024-07-17T11:45:00",
    generatedBy: "System (Scheduled)",
    format: "csv",
    size: "856 KB",
    status: "completed",
  },
  {
    id: "rep-004",
    name: "Marketing Performance - Q2 2024",
    template: "Marketing Performance",
    generatedAt: "2024-07-10T16:20:00",
    generatedBy: "Marketing Manager",
    format: "pdf",
    size: "2.1 MB",
    status: "completed",
  },
  {
    id: "rep-005",
    name: "Professional Commissions - June 2024",
    template: "Professional Commissions",
    generatedAt: "2024-07-01T10:00:00",
    generatedBy: "System (Scheduled)",
    format: "excel",
    size: "1.8 MB",
    status: "completed",
  },
];

// Mock report parameters for customization
const mockReportParameters = {
  "sales-summary": [
    {
      id: "dateRange",
      name: "Date Range",
      type: "daterange",
      value: { start: "2024-06-01", end: "2024-06-30" },
    },
    {
      id: "includeCharts",
      name: "Include Charts",
      type: "boolean",
      value: true,
    },
    {
      id: "productLimit",
      name: "Top Products Limit",
      type: "number",
      value: 10,
    },
    {
      id: "compareWithPrevious",
      name: "Compare with Previous Period",
      type: "boolean",
      value: true,
    },
    {
      id: "categories",
      name: "Categories",
      type: "multiselect",
      value: [
        "Nail Polish",
        "Nail Care",
        "Tools",
        "Equipment",
        "Kits & Bundles",
      ],
    },
  ],
  "user-growth": [
    {
      id: "dateRange",
      name: "Date Range",
      type: "daterange",
      value: { start: "2024-04-01", end: "2024-06-30" },
    },
    {
      id: "includeCharts",
      name: "Include Charts",
      type: "boolean",
      value: true,
    },
    {
      id: "segmentBySource",
      name: "Segment by Source",
      type: "boolean",
      value: true,
    },
    {
      id: "includeDemographics",
      name: "Include Demographics",
      type: "boolean",
      value: true,
    },
    {
      id: "userTypes",
      name: "User Types",
      type: "multiselect",
      value: ["Customers", "Professionals"],
    },
  ],
  "inventory-status": [
    {
      id: "lowStockThreshold",
      name: "Low Stock Threshold",
      type: "number",
      value: 10,
    },
    {
      id: "includeZeroStock",
      name: "Include Out of Stock Items",
      type: "boolean",
      value: true,
    },
    {
      id: "categories",
      name: "Categories",
      type: "multiselect",
      value: [
        "Nail Polish",
        "Nail Care",
        "Tools",
        "Equipment",
        "Kits & Bundles",
      ],
    },
    {
      id: "sortBy",
      name: "Sort By",
      type: "select",
      value: "stock_level",
      options: ["stock_level", "name", "sku", "category"],
    },
    {
      id: "includeReorderSuggestions",
      name: "Include Reorder Suggestions",
      type: "boolean",
      value: true,
    },
  ],
};

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("templates");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);

  // Filter templates based on search and category
  const filteredTemplates = mockReportTemplates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Filter history based on search
  const filteredHistory = mockReportHistory.filter((report) => {
    return (
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.template.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleGenerateReport = (templateId: string) => {
    setSelectedTemplate(templateId);
    setShowCustomizeModal(true);
  };

  const handleScheduleReport = (templateId: string) => {
    setSelectedTemplate(templateId);
    setShowScheduleModal(true);
  };

  const handleCustomizeReport = () => {
    setShowCustomizeModal(false);
    setIsGenerating(true);

    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      setSuccessMessage(
        "Report generated successfully. You can download it from the history tab.",
      );

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    }, 2000);
  };

  const handleScheduleSave = () => {
    setShowScheduleModal(false);
    setSuccessMessage("Report scheduled successfully.");

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "sales":
        return <DollarSign className="h-5 w-5 text-green-500" />;
      case "users":
        return <Users className="h-5 w-5 text-blue-500" />;
      case "products":
        return <ShoppingBag className="h-5 w-5 text-purple-500" />;
      case "marketing":
        return <BarChart3 className="h-5 w-5 text-yellow-500" />;
      case "professionals":
        return <Users className="h-5 w-5 text-indigo-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />;
      case "excel":
        return <FileText className="h-5 w-5 text-green-500" />;
      case "csv":
        return <FileText className="h-5 w-5 text-blue-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };
  const renderTemplatesTab = () => (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                {getCategoryIcon(template.category)}
                <h3 className="text-lg font-medium text-gray-900 ml-2">
                  {template.name}
                </h3>
              </div>
              {template.scheduled && (
                <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Scheduled</span>
                </div>
              )}
            </div>

            <p className="text-sm text-gray-600 mb-4">{template.description}</p>

            <div className="flex items-center text-xs text-gray-500 mb-6">
              <Clock className="h-3 w-3 mr-1" />
              <span>Last generated: {formatDate(template.lastGenerated)}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {getFormatIcon(template.format)}
                <span className="text-xs text-gray-500 ml-1">
                  {template.format.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleScheduleReport(template.id)}
                  className="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
                >
                  <Clock className="h-3 w-3 mr-1" />
                  Schedule
                </button>
                <button
                  onClick={() => handleGenerateReport(template.id)}
                  className="px-3 py-1 text-xs bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center"
                >
                  <FileText className="h-3 w-3 mr-1" />
                  Generate
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No report templates found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );

  const renderHistoryTab = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Report Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Template
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Generated
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Format
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredHistory.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {report.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    By: {report.generatedBy}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{report.template}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatDate(report.generatedAt)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getFormatIcon(report.format)}
                    <span className="text-sm text-gray-900 ml-2">
                      {report.format.toUpperCase()}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{report.size}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-3">
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      title="View report"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      className="text-primary-600 hover:text-primary-900"
                      title="Download report"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      title="Regenerate report"
                    >
                      <RefreshCw className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredHistory.length === 0 && (
        <div className="p-8 text-center">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No report history found
          </h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );

  const renderScheduledTab = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="space-y-6">
        {mockReportTemplates
          .filter((t) => t.scheduled)
          .map((template) => (
            <div
              key={template.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center mb-2">
                    {getCategoryIcon(template.category)}
                    <h3 className="text-lg font-medium text-gray-900 ml-2">
                      {template.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    {template.description}
                  </p>
                </div>
                <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Scheduled</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-md p-4 mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Schedule Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500">Frequency</div>
                    <div className="text-sm font-medium text-gray-900 capitalize">
                      {template.schedule?.frequency}
                    </div>
                  </div>
                  {template.schedule?.day && (
                    <div>
                      <div className="text-xs text-gray-500">Day</div>
                      <div className="text-sm font-medium text-gray-900">
                        {template.schedule.day}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-xs text-gray-500">Time</div>
                    <div className="text-sm font-medium text-gray-900">
                      {template.schedule?.time}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Format</div>
                    <div className="text-sm font-medium text-gray-900 uppercase">
                      {template.format}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Recipients
                </h4>
                <div className="flex flex-wrap gap-2">
                  {template.schedule?.recipients.map((email, index) => (
                    <div
                      key={index}
                      className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full flex items-center"
                    >
                      <Mail className="h-3 w-3 mr-1" />
                      <span>{email}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button className="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-50">
                  Edit Schedule
                </button>
                <button className="px-3 py-1 text-xs border border-red-300 text-red-600 rounded-md hover:bg-red-50">
                  Disable
                </button>
              </div>
            </div>
          ))}

        {mockReportTemplates.filter((t) => t.scheduled).length === 0 && (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No scheduled reports
            </h3>
            <p className="text-gray-500 mb-4">
              Schedule reports to be automatically generated and sent
            </p>
            <button
              onClick={() => setActiveTab("templates")}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Schedule a Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
  const renderCustomizeModal = () => {
    if (!selectedTemplate || !showCustomizeModal) return null;

    const template = mockReportTemplates.find((t) => t.id === selectedTemplate);
    const parameters =
      mockReportParameters[
        selectedTemplate as keyof typeof mockReportParameters
      ] || [];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Customize Report
            </h2>
            <button
              onClick={() => setShowCustomizeModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {template?.name}
            </h3>
            <p className="text-sm text-gray-600">{template?.description}</p>
          </div>

          <div className="space-y-6 mb-6">
            <h4 className="text-sm font-medium text-gray-700">
              Report Parameters
            </h4>

            {parameters.map((param) => (
              <div key={param.id} className="space-y-2">
                <label
                  htmlFor={param.id}
                  className="block text-sm font-medium text-gray-700"
                >
                  {param.name}
                </label>

                {param.type === "daterange" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor={`${param.id}-start`}
                        className="block text-xs text-gray-500"
                      >
                        Start Date
                      </label>
                      <input
                        type="date"
                        id={`${param.id}-start`}
                        value={(param.value as any)?.start || ""}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`${param.id}-end`}
                        className="block text-xs text-gray-500"
                      >
                        End Date
                      </label>
                      <input
                        type="date"
                        id={`${param.id}-end`}
                        value={(param.value as any)?.end || ""}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                )}

                {param.type === "boolean" && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={param.id}
                      checked={Boolean(param.value)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={param.id}
                      className="ml-2 block text-sm text-gray-900"
                    >
                      {param.name}
                    </label>
                  </div>
                )}

                {param.type === "number" && (
                  <input
                    type="number"
                    id={param.id}
                    value={String(param.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                )}

                {param.type === "multiselect" && (
                  <div className="space-y-2">
                    {(param.value as string[])?.map(
                      (value: string, index: number) => (
                        <div key={index} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`${param.id}-${index}`}
                            checked={true}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`${param.id}-${index}`}
                            className="ml-2 block text-sm text-gray-900"
                          >
                            {value}
                          </label>
                        </div>
                      ),
                    )}
                  </div>
                )}

                {param.type === "select" && (
                  <select
                    id={param.id}
                    value={String(param.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    {(param as any).options?.map((option: string) => (
                      <option key={option} value={option}>
                        {option.replace("_", " ").charAt(0).toUpperCase() +
                          option.replace("_", " ").slice(1)}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-4 mb-6">
            <h4 className="text-sm font-medium text-gray-700">Output Format</h4>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="format-pdf"
                  name="format"
                  value="pdf"
                  checked={template?.format === "pdf"}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <label
                  htmlFor="format-pdf"
                  className="ml-2 block text-sm text-gray-900"
                >
                  PDF
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="format-excel"
                  name="format"
                  value="excel"
                  checked={template?.format === "excel"}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <label
                  htmlFor="format-excel"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Excel
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="format-csv"
                  name="format"
                  value="csv"
                  checked={template?.format === "csv"}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <label
                  htmlFor="format-csv"
                  className="ml-2 block text-sm text-gray-900"
                >
                  CSV
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setShowCustomizeModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleCustomizeReport}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Generate Report
            </button>
          </div>
        </div>
      </div>
    );
  };
  const renderScheduleModal = () => {
    if (!selectedTemplate || !showScheduleModal) return null;

    const template = mockReportTemplates.find((t) => t.id === selectedTemplate);
    const isScheduled = template?.scheduled || false;
    const schedule = template?.schedule || {
      frequency: "weekly",
      day: "Monday",
      time: "08:00",
      recipients: [],
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Schedule Report
            </h2>
            <button
              onClick={() => setShowScheduleModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {template?.name}
            </h3>
          </div>

          <div className="space-y-6 mb-6">
            <div>
              <label
                htmlFor="frequency"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Frequency
              </label>
              <select
                id="frequency"
                defaultValue={schedule.frequency}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="day"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Day
              </label>
              <select
                id="day"
                defaultValue={schedule.day}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="time"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Time
              </label>
              <input
                type="time"
                id="time"
                defaultValue={schedule.time}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label
                htmlFor="recipients"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Recipients (comma separated)
              </label>
              <input
                type="text"
                id="recipients"
                defaultValue={schedule.recipients.join(", ")}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label
                htmlFor="format"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Format
              </label>
              <select
                id="format"
                defaultValue={template?.format}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="csv">CSV</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setShowScheduleModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleScheduleSave}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Save Schedule
            </button>
          </div>
        </div>
      </div>
    );
  };
  return (
    <RoleGuard allowedRoles={["ADMIN", "MANAGER"]}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
                <p className="text-sm text-gray-600">
                  Generate, customize, and schedule reports
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                  <Plus className="h-4 w-4 mr-2 text-gray-600" />
                  <span>New Template</span>
                </button>
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  <span>Export All</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-md flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                {successMessage}
              </div>
              <button onClick={() => setSuccessMessage("")}>
                <X className="h-5 w-5 text-green-800" />
              </button>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-md flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                {errorMessage}
              </div>
              <button onClick={() => setErrorMessage("")}>
                <X className="h-5 w-5 text-red-800" />
              </button>
            </div>
          )}

          {/* Loading Indicator */}
          {isGenerating && (
            <div className="mb-6 p-4 bg-blue-100 text-blue-800 rounded-md flex items-center justify-between">
              <div className="flex items-center">
                <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                Generating report... This may take a few moments.
              </div>
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
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full sm:w-64"
                  />
                </div>
                {activeTab === "templates" && (
                  <div className="flex items-center space-x-4">
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="all">All Categories</option>
                      <option value="sales">Sales</option>
                      <option value="users">Users</option>
                      <option value="products">Products</option>
                      <option value="marketing">Marketing</option>
                      <option value="professionals">Professionals</option>
                    </select>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                  <Filter className="h-4 w-4 mr-2 text-gray-600" />
                  <span>Filters</span>
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-600" />
                  <span>Date Range</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab("templates")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "templates"
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Report Templates
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "history"
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Report History
                </button>
                <button
                  onClick={() => setActiveTab("scheduled")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "scheduled"
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Scheduled Reports
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mb-8">
            {activeTab === "templates" && renderTemplatesTab()}
            {activeTab === "history" && renderHistoryTab()}
            {activeTab === "scheduled" && renderScheduledTab()}
          </div>
        </div>
      </div>

      {/* Modals */}
      {renderCustomizeModal()}
      {renderScheduleModal()}
    </RoleGuard>
  );
}
