import { Controller, Get, Post, Body, Param, Query } from "@nestjs/common";

import { SystemHealthService } from "./system-health.service";

@Controller("system-health")
export class SystemHealthController {
  constructor(private readonly systemHealthService: SystemHealthService) {}

  @Get()
  async getSystemHealth() {
    return this.systemHealthService.getSystemHealthStatus();
  }

  @Get("metrics")
  async getMetrics(@Query("hours") hours: number = 24) {
    return this.systemHealthService.getHistoricalMetrics(hours);
  }

  @Get("errors")
  async getErrors(@Query("hours") hours: number = 24) {
    return this.systemHealthService.getHistoricalErrors(hours);
  }

  @Get("performance")
  async getPerformance(@Query("hours") hours: number = 24) {
    return this.systemHealthService.getHistoricalPerformance(hours);
  }

  @Post("alerts/:alertId/acknowledge")
  async acknowledgeAlert(@Param("alertId") alertId: string) {
    const success = this.systemHealthService.acknowledgeAlert(alertId);
    return { success };
  }

  @Post("alerts/clear-acknowledged")
  async clearAcknowledgedAlerts() {
    this.systemHealthService.clearAcknowledgedAlerts();
    return { success: true };
  }
}
