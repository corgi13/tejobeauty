"use client";

import { useState, useEffect } from "react";
import {
  RefreshCw,
  Server,
  Cpu,
  HardDrive,
  Database,
  AlertTriangle,
  CheckCircle,
  X,
  Clock,
  Activity,
  BarChart3,
  LineChart,
  Download,
  Calendar,
  Filter,
  AlertCircle,
  Zap,
  Wifi,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  ChevronRight,
  Bell,
} from "lucide-react";
import RoleGuard from "@/lib/auth/role-guard";
import {
  getSystemHealth,
  acknowledgeAlert,
  clearAcknowledgedAlerts,
  getHistoricalMetrics,
  getHistoricalErrors,
  getHistoricalPerformance,
  SystemHealthStatus,
  SystemMetrics,
  ErrorMetrics,
  PerformanceMetrics,
  ServiceStatus,
  SystemAlert,
} from "@/lib/services/system-health.service";

// Fallback mock data for system health monitoring
const mockSystemMetrics = {
  cpu: {
    usage: 65.2, // percentage
    cores: 8,
    temperature: 62.5, // celsius
  },
  memory: {
    total: 16 * 1024 * 1024 * 1024, // 16GB
    used: 10.5 * 1024 * 1024 * 1024, // 10.5GB
    free: 5.5 * 1024 * 1024 * 1024, // 5.5GB
    usage: 65.6, // percentage
  },
  disk: {
    total: 500 * 1024 * 1024 * 1024, // 500GB
    used: 350 * 1024 * 1024 * 1024, // 350GB
    free: 150 * 1024 * 1024 * 1024, // 150GB
    usage: 70.0, // percentage
  },
  network: {
    bytesIn: 2.5 * 1024 * 1024, // 2.5MB/s
    bytesOut: 1.2 * 1024 * 1024, // 1.2MB/s
    connections: 342,
  },
  uptime: 15 * 24 * 60 * 60, // 15 days
  timestamp: new Date(),
};

const mockErrorMetrics = {
  total: 256,
  byStatusCode: {
    "500": 45,
    "404": 156,
    "403": 23,
    "400": 32,
  },
  byEndpoint: {
    "/api/products": 32,
    "/api/orders": 28,
    "/api/auth": 15,
    "/api/search": 42,
  },
  byBrowser: {
    Chrome: 120,
    Firefox: 65,
    Safari: 45,
    Edge: 26,
  },
  byOs: {
    Windows: 110,
    macOS: 85,
    iOS: 25,
    Android: 30,
    Linux: 6,
  },
  recentErrors: [
    {
      timestamp: new Date(Date.now() - 5 * 60000),
      statusCode: 500,
      endpoint: "/api/products",
      message: "Internal server error",
      stack:
        "Error: Internal server error\n    at processRequest (/app/src/controllers/productController.ts:45:7)",
    },
    {
      timestamp: new Date(Date.now() - 12 * 60000),
      statusCode: 404,
      endpoint: "/api/products/nonexistent",
      message: "Product not found",
      stack:
        "Error: Product not found\n    at getProduct (/app/src/controllers/productController.ts:23:7)",
    },
    {
      timestamp: new Date(Date.now() - 25 * 60000),
      statusCode: 403,
      endpoint: "/api/admin/settings",
      message: "Forbidden",
      stack:
        "Error: Forbidden\n    at checkPermissions (/app/src/middleware/auth.ts:67:9)",
    },
  ],
  errorRate: 2.3, // errors per minute
};

const mockPerformanceMetrics = {
  responseTime: {
    average: 187, // milliseconds
    p50: 150, // milliseconds
    p90: 280, // milliseconds
    p95: 374, // milliseconds
    p99: 561, // milliseconds
    byEndpoint: {
      "/api/products": 120,
      "/api/orders": 210,
      "/api/auth": 95,
      "/api/search": 225,
    },
  },
  throughput: {
    requestsPerMinute: 850,
    byEndpoint: {
      "/api/products": 320,
      "/api/orders": 150,
      "/api/auth": 80,
      "/api/search": 300,
    },
  },
  databasePerformance: {
    queryTime: {
      average: 35, // milliseconds
      p95: 85, // milliseconds
    },
    connectionPoolSize: 20,
    activeConnections: 12,
    queryCount: 3450,
  },
};

const mockServiceStatuses = [
  {
    name: "api-gateway",
    status: "healthy",
    lastChecked: new Date(),
    responseTime: 85,
    message: "Service is operating normally",
  },
  {
    name: "auth-service",
    status: "healthy",
    lastChecked: new Date(),
    responseTime: 120,
    message: "Service is operating normally",
  },
  {
    name: "product-service",
    status: "degraded",
    lastChecked: new Date(),
    responseTime: 350,
    message: "Service is experiencing high latency",
  },
  {
    name: "order-service",
    status: "healthy",
    lastChecked: new Date(),
    responseTime: 95,
    message: "Service is operating normally",
  },
  {
    name: "payment-service",
    status: "healthy",
    lastChecked: new Date(),
    responseTime: 210,
    message: "Service is operating normally",
  },
  {
    name: "search-service",
    status: "healthy",
    lastChecked: new Date(),
    responseTime: 180,
    message: "Service is operating normally",
  },
  {
    name: "email-service",
    status: "down",
    lastChecked: new Date(),
    responseTime: 0,
    message: "Service is not responding",
  },
  {
    name: "database",
    status: "healthy",
    lastChecked: new Date(),
    responseTime: 45,
    message: "Service is operating normally",
  },
];
const mockAlerts = [
  {
    id: "alert-1",
    severity: "critical",
    message: "Email service is down",
    timestamp: new Date(Date.now() - 15 * 60000),
    acknowledged: false,
  },
  {
    id: "alert-2",
    severity: "warning",
    message: "Product service is experiencing high latency",
    timestamp: new Date(Date.now() - 45 * 60000),
    acknowledged: false,
  },
  {
    id: "alert-3",
    severity: "warning",
    message: "Elevated error rate: 2.3 errors/minute",
    timestamp: new Date(Date.now() - 120 * 60000),
    acknowledged: true,
  },
  {
    id: "alert-4",
    severity: "info",
    message: "System backup completed successfully",
    timestamp: new Date(Date.now() - 240 * 60000),
    acknowledged: true,
  },
];

// Mock historical data for charts
const mockHistoricalCpuUsage = Array.from({ length: 24 }, (_, i) => {
  return {
    timestamp: new Date(Date.now() - (24 - i) * 60 * 60 * 1000),
    value: Math.random() * 30 + 50, // 50-80%
  };
});

const mockHistoricalMemoryUsage = Array.from({ length: 24 }, (_, i) => {
  return {
    timestamp: new Date(Date.now() - (24 - i) * 60 * 60 * 1000),
    value: Math.random() * 20 + 60, // 60-80%
  };
});

const mockHistoricalResponseTime = Array.from({ length: 24 }, (_, i) => {
  return {
    timestamp: new Date(Date.now() - (24 - i) * 60 * 60 * 1000),
    value: Math.random() * 100 + 150, // 150-250ms
  };
});

const mockHistoricalErrorRate = Array.from({ length: 24 }, (_, i) => {
  return {
    timestamp: new Date(Date.now() - (24 - i) * 60 * 60 * 1000),
    value: Math.random() * 5, // 0-5 errors/minute
  };
});

function SystemHealthPage(): JSX.Element {
  const [timeRange, setTimeRange] = useState("24h");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [systemMetrics, setSystemMetrics] = useState(mockSystemMetrics);
  const [errorMetrics, setErrorMetrics] = useState(mockErrorMetrics);
  const [performanceMetrics, setPerformanceMetrics] = useState(
    mockPerformanceMetrics,
  );
  const [serviceStatuses, setServiceStatuses] = useState(mockServiceStatuses);
  const [alerts, setAlerts] = useState<SystemAlert[]>(
    mockAlerts as SystemAlert[],
  );
  const [historicalCpuUsage, setHistoricalCpuUsage] = useState(
    mockHistoricalCpuUsage,
  );
  const [historicalMemoryUsage, setHistoricalMemoryUsage] = useState(
    mockHistoricalMemoryUsage,
  );
  const [historicalResponseTime, setHistoricalResponseTime] = useState(
    mockHistoricalResponseTime,
  );
  const [historicalErrorRate, setHistoricalErrorRate] = useState(
    mockHistoricalErrorRate,
  );

  // Fetch system health data on component mount
  useEffect(() => {
    fetchSystemHealth();
    fetchHistoricalData();

    // Set up polling for real-time updates
    const intervalId = setInterval(() => {
      fetchSystemHealth();
    }, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, []);

  // Fetch historical data when time range changes
  useEffect(() => {
    fetchHistoricalData();
  }, [timeRange]);

  const fetchSystemHealth = async () => {
    try {
      setIsLoading(true);
      const data = await getSystemHealth();

      setSystemMetrics(data.metrics as any);
      setErrorMetrics(data.errors as any);
      setPerformanceMetrics(data.performance as any);
      setServiceStatuses(data.services as any);
      setAlerts(data.alerts as any);

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching system health:", error);
      setErrorMessage("Failed to fetch system health data");
      setIsLoading(false);

      // Clear error message after 5 seconds
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }
  };

  const fetchHistoricalData = async () => {
    try {
      // Convert time range to hours
      const hours = timeRangeToHours(timeRange);

      // Fetch historical metrics
      const metricsData = await getHistoricalMetrics(hours);

      // Process CPU usage history
      const cpuHistory = metricsData.map((metric) => ({
        timestamp: metric.timestamp,
        value: metric.cpu.usage,
      }));
      setHistoricalCpuUsage(cpuHistory);

      // Process memory usage history
      const memoryHistory = metricsData.map((metric) => ({
        timestamp: metric.timestamp,
        value: metric.memory.usage,
      }));
      setHistoricalMemoryUsage(memoryHistory);

      // Fetch historical performance data
      const performanceData = await getHistoricalPerformance(hours);

      // Process response time history
      const responseTimeHistory = performanceData.map((perf, index) => ({
        timestamp:
          metricsData[index]?.timestamp ||
          new Date(Date.now() - (hours - index) * 60 * 60 * 1000),
        value: perf.responseTime.average,
      }));
      setHistoricalResponseTime(responseTimeHistory);

      // Fetch historical error data
      const errorData = await getHistoricalErrors(hours);

      // Process error rate history
      const errorRateHistory = errorData.map((err, index) => ({
        timestamp:
          metricsData[index]?.timestamp ||
          new Date(Date.now() - (hours - index) * 60 * 60 * 1000),
        value: err.errorRate,
      }));
      setHistoricalErrorRate(errorRateHistory);
    } catch (error) {
      console.error("Error fetching historical data:", error);
      setErrorMessage("Failed to fetch historical data");

      // Clear error message after 5 seconds
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }
  };

  // Convert time range string to hours
  const timeRangeToHours = (range: string): number => {
    switch (range) {
      case "1h":
        return 1;
      case "6h":
        return 6;
      case "24h":
        return 24;
      case "7d":
        return 7 * 24;
      case "30d":
        return 30 * 24;
      default:
        return 24;
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await fetchSystemHealth();
      await fetchHistoricalData();
      setSuccessMessage("System health data refreshed successfully");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      setErrorMessage("Failed to refresh system health data");

      // Clear error message after 5 seconds
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      const success = await acknowledgeAlert(alertId);

      if (success) {
        setAlerts(
          alerts.map((alert) =>
            alert.id === alertId ? { ...alert, acknowledged: true } : alert,
          ),
        );
      }
    } catch (error) {
      console.error("Error acknowledging alert:", error);
      setErrorMessage("Failed to acknowledge alert");

      // Clear error message after 5 seconds
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }
  };

  const handleClearAcknowledgedAlerts = async () => {
    try {
      const success = await clearAcknowledgedAlerts();

      if (success) {
        setAlerts(alerts.filter((alert) => !alert.acknowledged));
      }
    } catch (error) {
      console.error("Error clearing acknowledged alerts:", error);
      setErrorMessage("Failed to clear acknowledged alerts");

      // Clear error message after 5 seconds
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }
  };

  const formatBytes = (bytes: number, decimals: number = 2): string => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const formatPercentage = (percentage: number): string => {
    return `${percentage.toFixed(1)}%`;
  };

  const formatDuration = (seconds: number): string => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);

    return `${days}d ${hours}h ${minutes}m`;
  };

  const formatDateTime = (dateString: Date): string => {
    return dateString.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-100 text-green-800";
      case "degraded":
        return "bg-yellow-100 text-yellow-800";
      case "down":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "info":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAlertSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "info":
        return <Bell className="h-5 w-5 text-blue-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-8">
      {/* Success and Error Messages */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <p>{successMessage}</p>
          </div>
          <button
            onClick={() => setSuccessMessage("")}
            className="text-green-500 hover:text-green-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <p>{errorMessage}</p>
          </div>
          <button
            onClick={() => setErrorMessage("")}
            className="text-red-500 hover:text-red-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* System Status */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">System Status</h2>
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-500">
              Last updated: {formatDateTime(systemMetrics.timestamp)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* CPU Usage */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Cpu className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-sm font-medium text-gray-700">CPU Usage</h3>
              </div>
              <span
                className={`text-sm font-medium ${
                  systemMetrics.cpu.usage > 80
                    ? "text-red-600"
                    : systemMetrics.cpu.usage > 60
                      ? "text-yellow-600"
                      : "text-green-600"
                }`}
              >
                {formatPercentage(systemMetrics.cpu.usage)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${
                  systemMetrics.cpu.usage > 80
                    ? "bg-red-600"
                    : systemMetrics.cpu.usage > 60
                      ? "bg-yellow-500"
                      : "bg-green-500"
                }`}
                style={{ width: `${systemMetrics.cpu.usage}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>{systemMetrics.cpu.cores} Cores</span>
              <span>{systemMetrics.cpu.temperature}°C</span>
            </div>
          </div>

          {/* Memory Usage */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Server className="h-5 w-5 text-purple-600 mr-2" />
                <h3 className="text-sm font-medium text-gray-700">
                  Memory Usage
                </h3>
              </div>
              <span
                className={`text-sm font-medium ${
                  systemMetrics.memory.usage > 80
                    ? "text-red-600"
                    : systemMetrics.memory.usage > 60
                      ? "text-yellow-600"
                      : "text-green-600"
                }`}
              >
                {formatPercentage(systemMetrics.memory.usage)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${
                  systemMetrics.memory.usage > 80
                    ? "bg-red-600"
                    : systemMetrics.memory.usage > 60
                      ? "bg-yellow-500"
                      : "bg-green-500"
                }`}
                style={{ width: `${systemMetrics.memory.usage}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>Used: {formatBytes(systemMetrics.memory.used)}</span>
              <span>Total: {formatBytes(systemMetrics.memory.total)}</span>
            </div>
          </div>

          {/* Disk Usage */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <HardDrive className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="text-sm font-medium text-gray-700">
                  Disk Usage
                </h3>
              </div>
              <span
                className={`text-sm font-medium ${
                  systemMetrics.disk.usage > 80
                    ? "text-red-600"
                    : systemMetrics.disk.usage > 60
                      ? "text-yellow-600"
                      : "text-green-600"
                }`}
              >
                {formatPercentage(systemMetrics.disk.usage)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${
                  systemMetrics.disk.usage > 80
                    ? "bg-red-600"
                    : systemMetrics.disk.usage > 60
                      ? "bg-yellow-500"
                      : "bg-green-500"
                }`}
                style={{ width: `${systemMetrics.disk.usage}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>Used: {formatBytes(systemMetrics.disk.used)}</span>
              <span>Total: {formatBytes(systemMetrics.disk.total)}</span>
            </div>
          </div>

          {/* Network */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Wifi className="h-5 w-5 text-yellow-600 mr-2" />
                <h3 className="text-sm font-medium text-gray-700">Network</h3>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {systemMetrics.network.connections} conn.
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">In:</span>
                <span className="text-gray-700 font-medium">
                  {formatBytes(systemMetrics.network.bytesIn)}/s
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Out:</span>
                <span className="text-gray-700 font-medium">
                  {formatBytes(systemMetrics.network.bytesOut)}/s
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          <span>System uptime: {formatDuration(systemMetrics.uptime)}</span>
        </div>
      </div>

      {/* Service Status */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Service Status
          </h2>
          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-5 w-5 text-gray-600 ${isLoading ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {serviceStatuses.map((service, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-900">
                  {service.name}
                </h3>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}
                >
                  {service.status}
                </span>
              </div>
              <div className="text-xs text-gray-500 mb-2">
                Last checked: {formatDateTime(service.lastChecked)}
              </div>
              {service.responseTime > 0 && (
                <div className="flex items-center text-xs">
                  <Zap className="h-3 w-3 text-gray-400 mr-1" />
                  <span
                    className={`${
                      service.responseTime > 300
                        ? "text-red-600"
                        : service.responseTime > 200
                          ? "text-yellow-600"
                          : "text-gray-600"
                    }`}
                  >
                    {service.responseTime}ms
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Active Alerts</h2>
          <button
            onClick={handleClearAcknowledgedAlerts}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
          >
            Clear Acknowledged
          </button>
        </div>

        {alerts.filter((alert) => !alert.acknowledged).length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No active alerts
            </h3>
            <p className="text-gray-500">All systems are operating normally</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts
              .filter((alert) => !alert.acknowledged)
              .map((alert, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      {getAlertSeverityIcon(alert.severity)}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAlertSeverityColor(alert.severity)}`}
                          >
                            {alert.severity}
                          </span>
                          <span className="ml-2 text-sm text-gray-500">
                            {formatDateTime(alert.timestamp)}
                          </span>
                        </div>
                        <button
                          onClick={() => handleAcknowledgeAlert(alert.id)}
                          className="text-sm text-primary-600 hover:text-primary-800"
                        >
                          Acknowledge
                        </button>
                      </div>
                      <p className="mt-1 text-sm text-gray-900">
                        {alert.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Performance Overview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Performance Overview
          </h2>
          <div className="flex items-center space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="1h">Last Hour</option>
              <option value="6h">Last 6 Hours</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Response Time */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">
                Response Time
              </h3>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-900">
                  Avg: {performanceMetrics.responseTime.average}ms
                </span>
              </div>
            </div>
            <div className="h-48 w-full bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <LineChart className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Response Time Chart</p>
                <p className="text-xs text-gray-400">
                  (In a real implementation, this would be a line chart)
                </p>
              </div>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="text-gray-500">p50</div>
                <div className="font-medium text-gray-900">
                  {performanceMetrics.responseTime.p50}ms
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-500">p95</div>
                <div className="font-medium text-gray-900">
                  {performanceMetrics.responseTime.p95}ms
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-500">p99</div>
                <div className="font-medium text-gray-900">
                  {performanceMetrics.responseTime.p99}ms
                </div>
              </div>
            </div>
          </div>

          {/* Error Rate */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">Error Rate</h3>
              <div className="flex items-center">
                <span
                  className={`text-sm font-medium ${
                    errorMetrics.errorRate > 5
                      ? "text-red-600"
                      : errorMetrics.errorRate > 2
                        ? "text-yellow-600"
                        : "text-green-600"
                  }`}
                >
                  {errorMetrics.errorRate.toFixed(1)} errors/min
                </span>
              </div>
            </div>
            <div className="h-48 w-full bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Error Rate Chart</p>
                <p className="text-xs text-gray-400">
                  (In a real implementation, this would be a bar chart)
                </p>
              </div>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="text-gray-500">Total Errors</div>
                <div className="font-medium text-gray-900">
                  {formatNumber(errorMetrics.total)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-500">500 Errors</div>
                <div className="font-medium text-gray-900">
                  {formatNumber(errorMetrics.byStatusCode["500"] || 0)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-500">404 Errors</div>
                <div className="font-medium text-gray-900">
                  {formatNumber(errorMetrics.byStatusCode["404"] || 0)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">System Health</h1>
          <p className="text-gray-600">
            Monitor system performance and health metrics
          </p>
        </div>

        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "overview"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("performance")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "performance"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Performance
              </button>
              <button
                onClick={() => setActiveTab("errors")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "errors"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Errors
              </button>
            </nav>
          </div>
        </div>

        {activeTab === "overview" && renderOverviewTab()}
        {activeTab === "performance" && <div>Performance tab content</div>}
        {activeTab === "errors" && <div>Errors tab content</div>}
      </div>
    </div>
  );
}

export default function SystemHealthPageWithAuth() {
  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <SystemHealthPage />
    </RoleGuard>
  );
}
