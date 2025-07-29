import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { algoliasearch } from "algoliasearch";

import { PrismaService } from "../prisma.service";

@Injectable()
export class SearchService implements OnModuleInit {
  private client: any;
  private isAlgoliaConfigured = false;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    // Initialize Algolia client
    const appId = this.configService.get<string>("ALGOLIA_APP_ID");
    const apiKey = this.configService.get<string>("ALGOLIA_API_KEY");

    if (
      !appId ||
      !apiKey ||
      appId === "test_app_id" ||
      apiKey === "test_api_key"
    ) {
      console.warn(
        "Algolia credentials not found or using test values. Search functionality will be limited.",
      );
      this.isAlgoliaConfigured = false;
      return;
    }

    try {
      this.client = algoliasearch(appId, apiKey);
      this.isAlgoliaConfigured = true;
      console.log("Algolia client initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Algolia client:", error);
      this.isAlgoliaConfigured = false;
    }
  }

  async onModuleInit() {
    // Configure indices settings
    await this.configureIndices();
  }

  private async configureIndices() {
    if (!this.isAlgoliaConfigured) return;

    try {
      // Configure products index
      await this.client.setSettings({
        indexName: "products",
        indexSettings: {
          searchableAttributes: [
            "name",
            "description",
            "category.name",
            "variants.name",
          ],
          attributesForFaceting: [
            "filterOnly(categoryId)",
            "searchable(category.name)",
            "price",
            "isActive",
          ],
          customRanking: ["desc(popularity)", "desc(createdAt)"],
        },
      });

      // Configure categories index
      await this.client.setSettings({
        indexName: "categories",
        indexSettings: {
          searchableAttributes: ["name", "description"],
          attributesForFaceting: ["parentId", "isActive"],
          customRanking: ["asc(sortOrder)"],
        },
      });

      console.log("Algolia indices configured successfully");
    } catch (error) {
      console.error("Error configuring Algolia indices:", error);
    }
  }

  async indexProduct(product: any) {
    if (!this.isAlgoliaConfigured) return;

    try {
      // Transform product for indexing
      const indexedProduct = {
        objectID: product.id,
        ...product,
      };

      await this.client.saveObject({
        indexName: "products",
        body: indexedProduct,
      });
    } catch (error) {
      console.error("Error indexing product:", error);
    }
  }

  async indexProducts(products: any[]) {
    if (!this.isAlgoliaConfigured) return;

    try {
      // Transform products for indexing
      const indexedProducts = products.map((product) => ({
        objectID: product.id,
        ...product,
      }));

      await this.client.saveObjects({
        indexName: "products",
        objects: indexedProducts,
      });
    } catch (error) {
      console.error("Error indexing products:", error);
    }
  }

  async indexCategory(category: any) {
    if (!this.isAlgoliaConfigured) return;

    try {
      // Transform category for indexing
      const indexedCategory = {
        objectID: category.id,
        ...category,
      };

      await this.client.saveObject({
        indexName: "categories",
        body: indexedCategory,
      });
    } catch (error) {
      console.error("Error indexing category:", error);
    }
  }

  async indexCategories(categories: any[]) {
    if (!this.isAlgoliaConfigured) return;

    try {
      // Transform categories for indexing
      const indexedCategories = categories.map((category) => ({
        objectID: category.id,
        ...category,
      }));

      await this.client.saveObjects({
        indexName: "categories",
        objects: indexedCategories,
      });
    } catch (error) {
      console.error("Error indexing categories:", error);
    }
  }

  async removeProductFromIndex(productId: string) {
    if (!this.isAlgoliaConfigured) return;

    try {
      await this.client.deleteObject({
        indexName: "products",
        objectID: productId,
      });
    } catch (error) {
      console.error("Error removing product from index:", error);
    }
  }

  async removeCategoryFromIndex(categoryId: string) {
    if (!this.isAlgoliaConfigured) return;

    try {
      await this.client.deleteObject({
        indexName: "categories",
        objectID: categoryId,
      });
    } catch (error) {
      console.error("Error removing category from index:", error);
    }
  }

  async search(query: string, options: any = {}) {
    if (!this.isAlgoliaConfigured) {
      // Fallback to database search if Algolia is not configured
      return this.searchInDatabase(query, options);
    }

    try {
      const { filters, page = 0, hitsPerPage = 20 } = options;

      const searchOptions: any = {
        page,
        hitsPerPage,
      };

      if (filters) {
        searchOptions.filters = filters;
      }

      const result = await this.client.search({
        requests: [
          {
            indexName: "products",
            query,
            params: searchOptions,
          },
        ],
      });

      return result.results[0];
    } catch (error) {
      console.error("Error searching in Algolia:", error);
      // Fallback to database search
      return this.searchInDatabase(query, options);
    }
  }

  async searchCategories(query: string, options: any = {}) {
    if (!this.isAlgoliaConfigured) {
      // Fallback to database search if Algolia is not configured
      return this.searchCategoriesInDatabase(query, options);
    }

    try {
      const { filters, page = 0, hitsPerPage = 20 } = options;

      const searchOptions: any = {
        page,
        hitsPerPage,
      };

      if (filters) {
        searchOptions.filters = filters;
      }

      const result = await this.client.search({
        requests: [
          {
            indexName: "categories",
            query,
            params: searchOptions,
          },
        ],
      });

      return result.results[0];
    } catch (error) {
      console.error("Error searching categories in Algolia:", error);
      // Fallback to database search
      return this.searchCategoriesInDatabase(query, options);
    }
  }

  private async searchInDatabase(query: string, options: any = {}) {
    const { categoryId, page = 0, hitsPerPage = 20 } = options;

    const where: any = {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
      isActive: true,
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const [hits, nbHits] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          images: {
            take: 1,
          },
          category: true,
        },
        skip: page * hitsPerPage,
        take: hitsPerPage,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      hits,
      nbHits,
      page,
      nbPages: Math.ceil(nbHits / hitsPerPage),
      hitsPerPage,
    };
  }

  private async searchCategoriesInDatabase(query: string, options: any = {}) {
    const { parentId, page = 0, hitsPerPage = 20 } = options;

    const where: any = {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
      isActive: true,
    };

    if (parentId !== undefined) {
      where.parentId = parentId;
    }

    const [hits, nbHits] = await Promise.all([
      this.prisma.category.findMany({
        where,
        include: {
          parent: true,
          _count: {
            select: {
              products: true,
              children: true,
            },
          },
        },
        skip: page * hitsPerPage,
        take: hitsPerPage,
      }),
      this.prisma.category.count({ where }),
    ]);

    return {
      hits,
      nbHits,
      page,
      nbPages: Math.ceil(nbHits / hitsPerPage),
      hitsPerPage,
    };
  }

  async reindexAll() {
    try {
      // Reindex all products
      const products = await this.prisma.product.findMany({
        include: {
          images: true,
          category: true,
          variants: true,
        },
      });
      await this.indexProducts(products);

      // Reindex all categories
      const categories = await this.prisma.category.findMany({
        include: {
          parent: true,
        },
      });
      await this.indexCategories(categories);

      return { message: "Reindexing completed successfully" };
    } catch (error) {
      console.error("Error reindexing data:", error);
      throw new Error("Failed to reindex data");
    }
  }
}
