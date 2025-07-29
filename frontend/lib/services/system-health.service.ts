/**
 * System Health Service
 * Provides methods to interact with the system health monitoring API
 */

// Types for system health data
export interface SystemMetrics {
  cpu: {
    usage: number; // percentage
    cores: number;
    temperature?: number; // celsius
  };
  memory: {
    total: number; // bytes
    used: number; // bytes
    free: number; // bytes
    usage: number; // percentage
  };
  disk: {
    total: number; // bytes
    used: number; // bytes
    free: number; // bytes
    usage: number; // percentage
  };
  network: {
    bytesIn: number; // bytes per second
    bytesOut: number; // bytes per second
    connections: number;
  };
  uptime: number; // seconds
  timestamp: Date;
}

export interface ErrorMetrics {
  total: number;
  byStatusCode: Record<string, number>; // e.g. { "500": 120, "404": 45 }
  byEndpoint: Record<string, number>; // e.g. { "/api/products": 25, "/api/orders": 15 }
  byBrowser: Record<string, number>; // e.g. { "Chrome": 80, "Firefox": 30 }
  byOs: Record<string, number>; // e.g. { "Windows": 70, "macOS": 40 }
  recentErrors: Array<{
    timestamp: Date;
    statusCode: number;
    endpoint: string;
    message: string;
    stack?: string;
  }>;
  errorRate: number; // errors per minute
}

export interface PerformanceMetrics {
  responseTime: {
    average: number; // milliseconds
    p50: number; // milliseconds
    p90: number; // milliseconds
    p95: number; // milliseconds
    p99: number; // milliseconds
    byEndpoint: Record<string, number>; // e.g. { "/api/products": 120, "/api/orders": 85 }
  };
  throughput: {
    requestsPerMinute: number;
    byEndpoint: Record<string, number>; // e.g. { "/api/products": 350, "/api/orders": 120 }
  };
  databasePerformance: {
    queryTime: {
      average: number; // milliseconds
      p95: number; // milliseconds
    };
    connectionPoolSize: number;
    activeConnections: number;
    queryCount: number;
  };
}

export interface ServiceStatus {
  name: string;
  status: "healthy" | "degraded" | "down";
  lastChecked: Date;
  responseTime?: number; // milliseconds
  message?: string;
}

export interface SystemAlert {
  id: string;
  severity: "info" | "warning" | "critical";
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

export interface SystemHealthStatus {
  overall: "healthy" | "degraded" | "critical";
  services: ServiceStatus[];
  metrics: SystemMetrics;
  errors: ErrorMetrics;
  performance: PerformanceMetrics;
  alerts: SystemAlert[];
}

// API base URL
const API_BASE_URL = "/api/system-health";

/**
 * Get current system health status
 */
export async function getSystemHealth(): Promise<SystemHealthStatus> {
  try {
    const response = await fetch(API_BASE_URL);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch system health: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();

    // Convert date strings to Date objects
    data.metrics.timestamp = new Date(data.metrics.timestamp);
    data.alerts.forEach((alert: any) => {
      alert.timestamp = new Date(alert.timestamp);
    });
    data.services.forEach((service: any) => {
      service.lastChecked = new Date(service.lastChecked);
    });
    data.errors.recentErrors.forEach((error: any) => {
      error.timestamp = new Date(error.timestamp);
    });

    return data;
  } catch (error) {
    console.error("Error fetching system health:", error);
    throw error;
  }
}

/**
 * Get historical system metrics
 */
export async function getHistoricalMetrics(
  hours: number = 24,
): Promise<SystemMetrics[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/metrics?hours=${hours}`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch historical metrics: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();

    // Convert date strings to Date objects
    data.forEach((metric: any) => {
      metric.timestamp = new Date(metric.timestamp);
    });

    return data;
  } catch (error) {
    console.error("Error fetching historical metrics:", error);
    throw error;
  }
}

/**
 * Get historical error metrics
 */
export async function getHistoricalErrors(
  hours: number = 24,
): Promise<ErrorMetrics[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/errors?hours=${hours}`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch historical errors: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();

    // Convert date strings to Date objects
    data.forEach((errorMetric: any) => {
      errorMetric.recentErrors.forEach((error: any) => {
        error.timestamp = new Date(error.timestamp);
      });
    });

    return data;
  } catch (error) {
    console.error("Error fetching historical errors:", error);
    throw error;
  }
}

/**
 * Get historical performance metrics
 */
export async function getHistoricalPerformance(
  hours: number = 24,
): Promise<PerformanceMetrics[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/performance?hours=${hours}`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch historical performance: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching historical performance:", error);
    throw error;
  }
}

/**
 * Acknowledge an alert
 */
export async function acknowledgeAlert(alertId: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/alerts/${alertId}/acknowledge`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to acknowledge alert: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Error acknowledging alert:", error);
    throw error;
  }
}

/**
 * Clear all acknowledged alerts
 */
export async function clearAcknowledgedAlerts(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/alerts/clear-acknowledged`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to clear acknowledged alerts: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Error clearing acknowledged alerts:", error);
    throw error;
  }
}
