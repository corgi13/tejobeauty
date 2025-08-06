"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const search_service_1 = require("./search.service");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
let SearchController = class SearchController {
    constructor(searchService) {
        this.searchService = searchService;
    }
    async search(query, categoryId, page, hitsPerPage) {
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
    async searchCategories(query, parentId, page, hitsPerPage) {
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
    async reindexAll() {
        return this.searchService.reindexAll();
    }
};
exports.SearchController = SearchController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Search products" }),
    (0, swagger_1.ApiQuery)({ name: "query", required: true, type: String }),
    (0, swagger_1.ApiQuery)({ name: "categoryId", required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: "page", required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: "hitsPerPage", required: false, type: Number }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Search results retrieved successfully",
    }),
    __param(0, (0, common_1.Query)("query")),
    __param(1, (0, common_1.Query)("categoryId")),
    __param(2, (0, common_1.Query)("page")),
    __param(3, (0, common_1.Query)("hitsPerPage")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "search", null);
__decorate([
    (0, common_1.Get)("categories"),
    (0, swagger_1.ApiOperation)({ summary: "Search categories" }),
    (0, swagger_1.ApiQuery)({ name: "query", required: true, type: String }),
    (0, swagger_1.ApiQuery)({ name: "parentId", required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: "page", required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: "hitsPerPage", required: false, type: Number }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Category search results retrieved successfully",
    }),
    __param(0, (0, common_1.Query)("query")),
    __param(1, (0, common_1.Query)("parentId")),
    __param(2, (0, common_1.Query)("page")),
    __param(3, (0, common_1.Query)("hitsPerPage")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "searchCategories", null);
__decorate([
    (0, common_1.Post)("reindex"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Reindex all data (admin only)" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Reindexing completed successfully",
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Forbidden" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "reindexAll", null);
exports.SearchController = SearchController = __decorate([
    (0, swagger_1.ApiTags)("search"),
    (0, common_1.Controller)("search"),
    __metadata("design:paramtypes", [search_service_1.SearchService])
], SearchController);
//# sourceMappingURL=search.controller.js.map