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
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";

import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductsService } from "./products.service";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";

@ApiTags("products")
@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MANAGER")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new product" })
  @ApiResponse({ status: 201, description: "Product created successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({
    status: 409,
    description: "Conflict - Product already exists",
  })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all products" })
  @ApiQuery({ name: "skip", required: false, type: Number })
  @ApiQuery({ name: "take", required: false, type: Number })
  @ApiQuery({ name: "categoryId", required: false, type: String })
  @ApiQuery({ name: "isActive", required: false, type: Boolean })
  @ApiResponse({ status: 200, description: "Products retrieved successfully" })
  findAll(
    @Query("skip") skip?: number,
    @Query("take") take?: number,
    @Query("categoryId") categoryId?: string,
    @Query("isActive") isActive?: boolean,
  ) {
    return this.productsService.findAll({
      skip: skip ? +skip : undefined,
      take: take ? +take : undefined,
      categoryId,
      isActive: isActive !== undefined ? isActive === true : undefined,
    });
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a product by ID" })
  @ApiResponse({ status: 200, description: "Product retrieved successfully" })
  @ApiResponse({ status: 404, description: "Product not found" })
  findOne(@Param("id") id: string) {
    return this.productsService.findOne(id);
  }

  @Get("slug/:slug")
  @ApiOperation({ summary: "Get a product by slug" })
  @ApiResponse({ status: 200, description: "Product retrieved successfully" })
  @ApiResponse({ status: 404, description: "Product not found" })
  findBySlug(@Param("slug") slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MANAGER")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a product" })
  @ApiResponse({ status: 200, description: "Product updated successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "Product not found" })
  @ApiResponse({
    status: 409,
    description: "Conflict - Product with same slug/SKU exists",
  })
  update(@Param("id") id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a product" })
  @ApiResponse({ status: 200, description: "Product deleted successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "Product not found" })
  remove(@Param("id") id: string) {
    return this.productsService.remove(id);
  }

  @Patch(":id/inventory")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MANAGER")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update product inventory" })
  @ApiResponse({ status: 200, description: "Inventory updated successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "Product not found" })
  updateInventory(@Param("id") id: string, @Body("quantity") quantity: number) {
    return this.productsService.updateInventory(id, quantity);
  }
}
