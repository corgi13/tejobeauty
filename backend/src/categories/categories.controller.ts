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

import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";

@ApiTags("categories")
@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MANAGER")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new category" })
  @ApiResponse({ status: 201, description: "Category created successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({
    status: 409,
    description: "Conflict - Category already exists",
  })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all categories" })
  @ApiQuery({ name: "includeInactive", required: false, type: Boolean })
  @ApiQuery({ name: "parentId", required: false, type: String })
  @ApiResponse({
    status: 200,
    description: "Categories retrieved successfully",
  })
  findAll(
    @Query("includeInactive") includeInactive?: boolean,
    @Query("parentId") parentId?: string,
  ) {
    return this.categoriesService.findAll({
      includeInactive: includeInactive === true,
      parentId: parentId === "null" ? null : parentId,
    });
  }

  @Get("tree")
  @ApiOperation({ summary: "Get category tree" })
  @ApiResponse({
    status: 200,
    description: "Category tree retrieved successfully",
  })
  getCategoryTree() {
    return this.categoriesService.getCategoryTree();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a category by ID" })
  @ApiResponse({ status: 200, description: "Category retrieved successfully" })
  @ApiResponse({ status: 404, description: "Category not found" })
  findOne(@Param("id") id: string) {
    return this.categoriesService.findOne(id);
  }

  @Get("slug/:slug")
  @ApiOperation({ summary: "Get a category by slug" })
  @ApiResponse({ status: 200, description: "Category retrieved successfully" })
  @ApiResponse({ status: 404, description: "Category not found" })
  findBySlug(@Param("slug") slug: string) {
    return this.categoriesService.findBySlug(slug);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MANAGER")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a category" })
  @ApiResponse({ status: 200, description: "Category updated successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "Category not found" })
  @ApiResponse({
    status: 409,
    description: "Conflict - Category with same slug exists",
  })
  update(
    @Param("id") id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a category" })
  @ApiResponse({ status: 200, description: "Category deleted successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "Category not found" })
  @ApiResponse({
    status: 409,
    description: "Conflict - Category has subcategories or products",
  })
  remove(@Param("id") id: string) {
    return this.categoriesService.remove(id);
  }
}
