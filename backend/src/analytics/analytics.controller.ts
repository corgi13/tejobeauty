import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { Role } from "@prisma/client";

import { AnalyticsService } from "./analytics.service";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";

@ApiTags("analytics")
@Controller("analytics")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.MANAGER)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get("dashboard")
  @ApiOperation({ summary: "Get dashboard statistics" })
  @ApiResponse({
    status: 200,
    description: "Dashboard stats retrieved successfully",
  })
  async getDashboardStats() {
    return this.analyticsService.getDashboardStats();
  }

  @Get("sales")
  @ApiOperation({ summary: "Get sales data" })
  @ApiResponse({
    status: 200,
    description: "Sales data retrieved successfully",
  })
  async getSalesData(@Query("period") period?: "week" | "month" | "year") {
    return this.analyticsService.getSalesData(period);
  }

  @Get("products/top")
  @ApiOperation({ summary: "Get top selling products" })
  @ApiResponse({
    status: 200,
    description: "Top products retrieved successfully",
  })
  async getTopProducts(@Query("limit") limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.analyticsService.getTopProducts(limitNum);
  }

  @Get("categories/top")
  @ApiOperation({ summary: "Get top selling categories" })
  @ApiResponse({
    status: 200,
    description: "Top categories retrieved successfully",
  })
  async getTopCategories(@Query("limit") limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.analyticsService.getTopCategories(limitNum);
  }

  @Get("users/growth")
  @ApiOperation({ summary: "Get user growth data" })
  @ApiResponse({
    status: 200,
    description: "User growth data retrieved successfully",
  })
  async getUserGrowth(@Query("period") period?: "week" | "month" | "year") {
    return this.analyticsService.getUserGrowth(period);
  }

  @Get("orders/status")
  @ApiOperation({ summary: "Get order status distribution" })
  @ApiResponse({
    status: 200,
    description: "Order status distribution retrieved successfully",
  })
  async getOrderStatusDistribution() {
    return this.analyticsService.getOrderStatusDistribution();
  }

  @Get("revenue/monthly")
  @ApiOperation({ summary: "Get monthly revenue data" })
  @ApiResponse({
    status: 200,
    description: "Monthly revenue data retrieved successfully",
  })
  async getRevenueByMonth(@Query("year") year?: string) {
    const yearNum = year ? parseInt(year, 10) : undefined;
    return this.analyticsService.getRevenueByMonth(yearNum);
  }

  @Get("professional")
  @ApiOperation({ summary: "Get professional statistics" })
  @ApiResponse({
    status: 200,
    description: "Professional stats retrieved successfully",
  })
  async getProfessionalStats() {
    return this.analyticsService.getProfessionalStats();
  }
}
