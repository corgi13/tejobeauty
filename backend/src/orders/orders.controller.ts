import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { Role, OrderStatus } from "@prisma/client";

import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { OrdersService } from "./orders.service";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";

@ApiTags("orders")
@Controller("orders")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: "Create a new order" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Order created successfully",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid order data",
  })
  async create(@Request() req: any, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(req.user.id, createOrderDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: "Get all orders (Admin only)" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Orders retrieved successfully",
  })
  async findAll(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("status") status?: OrderStatus,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.ordersService.findAll(pageNum, limitNum, status);
  }

  @Get("my-orders")
  @ApiOperation({ summary: "Get current user orders" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User orders retrieved successfully",
  })
  async findMyOrders(
    @Request() req: any,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.ordersService.findByUser(req.user.id, pageNum, limitNum);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get order by ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Order retrieved successfully",
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Order not found" })
  async findOne(@Param("id") id: string, @Request() req: any) {
    // Regular users can only see their own orders
    const userId = req.user.role === Role.CUSTOMER ? req.user.id : undefined;
    return this.ordersService.findOne(id, userId);
  }

  @Patch(":id")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: "Update order (Admin only)" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Order updated successfully",
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Order not found" })
  async update(
    @Param("id") id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(":id/cancel")
  @ApiOperation({ summary: "Cancel order" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Order cancelled successfully",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Order cannot be cancelled",
  })
  async cancel(@Param("id") id: string, @Request() req: any) {
    // Regular users can only cancel their own orders
    const userId = req.user.role === Role.CUSTOMER ? req.user.id : undefined;
    return this.ordersService.cancel(id, userId);
  }
}
