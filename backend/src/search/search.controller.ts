import { Controller, Get, Post, Query, UseGuards, Body } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";

import { SearchService } from "./search.service";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";

@ApiTags("search")
@Controller("search")
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: "Search products" })
  @ApiQuery({ name: "query", required: true, type: String })
  @ApiQuery({ name: "categoryId", required: false, type: String })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "hitsPerPage", required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: "Search results retrieved successfully",
  })
  async search(
    @Query("query") query: string,
    @Query("categoryId") categoryId?: string,
    @Query("page") page?: number,
    @Query("hitsPerPage") hitsPerPage?: number,
  ) {
    let filters = "";
    if (categoryId) {
      filters = `categoryId:${categoryId}`;
    }

    return this.searchService.search(query, {
      filters,
      page: page ? +page : 0,
      hitsPerPage: hitsPerPage ? +hitsPerPage : 20,
    });
  }

  @Get("categories")
  @ApiOperation({ summary: "Search categories" })
  @ApiQuery({ name: "query", required: true, type: String })
  @ApiQuery({ name: "parentId", required: false, type: String })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "hitsPerPage", required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: "Category search results retrieved successfully",
  })
  async searchCategories(
    @Query("query") query: string,
    @Query("parentId") parentId?: string,
    @Query("page") page?: number,
    @Query("hitsPerPage") hitsPerPage?: number,
  ) {
    let filters = "";
    if (parentId) {
      filters = `parentId:${parentId}`;
    }

    return this.searchService.searchCategories(query, {
      filters,
      page: page ? +page : 0,
      hitsPerPage: hitsPerPage ? +hitsPerPage : 20,
    });
  }

  @Post("reindex")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Reindex all data (admin only)" })
  @ApiResponse({
    status: 200,
    description: "Reindexing completed successfully",
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  async reindexAll() {
    return this.searchService.reindexAll();
  }
}
