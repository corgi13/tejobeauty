import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
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
import { Role, BulkOrderStatus } from "@prisma/client";

import { CreateBulkOrderDto } from "./dto/create-bulk-order.dto";
import { CreateProfessionalDto } from "./dto/create-professional.dto";
import { UpdateProfessionalDto } from "./dto/update-professional.dto";
import { ProfessionalService } from "./professional.service";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";

@ApiTags("professional")
@Controller("professional")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProfessionalController {
  constructor(private readonly professionalService: ProfessionalService) {}

  @Post("register")
  @ApiOperation({ summary: "Register as professional" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Professional profile created",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Profile already exists",
  })
  async register(
    @Request() req: any,
    @Body() createProfessionalDto: CreateProfessionalDto,
  ) {
    return this.professionalService.create(req.user.id, createProfessionalDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: "Get all professionals (Admin only)" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Professionals retrieved successfully",
  })
  async findAll(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("verified") verified?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const isVerified =
      verified === "true" ? true : verified === "false" ? false : undefined;
    return this.professionalService.findAll(pageNum, limitNum, isVerified);
  }

  @Get("profile")
  @ApiOperation({ summary: "Get current user professional profile" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Profile retrieved successfully",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Professional profile not found",
  })
  async getProfile(@Request() req: any) {
    return this.professionalService.findByUserId(req.user.id);
  }

  @Get("stats")
  @ApiOperation({ summary: "Get professional statistics" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Statistics retrieved successfully",
  })
  async getStats(@Request() req: any) {
    const profile = await this.professionalService.findByUserId(req.user.id);
    return this.professionalService.getStats(profile.id);
  }

  @Get(":id")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: "Get professional by ID (Admin only)" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Professional retrieved successfully",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Professional not found",
  })
  async findOne(@Param("id") id: string) {
    return this.professionalService.findOne(id);
  }

  @Patch("profile")
  @ApiOperation({ summary: "Update professional profile" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Profile updated successfully",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Professional profile not found",
  })
  async updateProfile(
    @Request() req: any,
    @Body() updateProfessionalDto: UpdateProfessionalDto,
  ) {
    const profile = await this.professionalService.findByUserId(req.user.id);
    return this.professionalService.update(profile.id, updateProfessionalDto);
  }

  @Patch(":id/verify")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: "Verify professional (Admin only)" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Professional verified successfully",
  })
  async verify(
    @Param("id") id: string,
    @Body("isVerified") isVerified: boolean,
  ) {
    return this.professionalService.verify(id, isVerified);
  }

  // Bulk Orders
  @Post("bulk-orders")
  @ApiOperation({ summary: "Create bulk order" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Bulk order created successfully",
  })
  async createBulkOrder(
    @Request() req: any,
    @Body() createBulkOrderDto: CreateBulkOrderDto,
  ) {
    const profile = await this.professionalService.findByUserId(req.user.id);
    return this.professionalService.createBulkOrder(
      profile.id,
      createBulkOrderDto,
    );
  }

  @Get("bulk-orders/my")
  @ApiOperation({ summary: "Get my bulk orders" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Bulk orders retrieved successfully",
  })
  async getMyBulkOrders(
    @Request() req: any,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    const profile = await this.professionalService.findByUserId(req.user.id);
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.professionalService.findBulkOrders(
      profile.id,
      pageNum,
      limitNum,
    );
  }

  @Patch("bulk-orders/:id/status")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: "Update bulk order status (Admin only)" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Bulk order status updated",
  })
  async updateBulkOrderStatus(
    @Param("id") id: string,
    @Body("status") status: BulkOrderStatus,
  ) {
    return this.professionalService.updateBulkOrderStatus(id, status);
  }

  // Commissions
  @Get("commissions/my")
  @ApiOperation({ summary: "Get my commissions" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Commissions retrieved successfully",
  })
  async getMyCommissions(
    @Request() req: any,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    const profile = await this.professionalService.findByUserId(req.user.id);
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.professionalService.findCommissions(
      profile.id,
      pageNum,
      limitNum,
    );
  }
}
