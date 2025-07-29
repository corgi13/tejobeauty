import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";

import { CacheService } from "../cache/cache.service";
import { PrismaService } from "../prisma.service";
import { SearchService } from "../search/search.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly searchService: SearchService,
    private readonly cacheService: CacheService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { images, variants, ...productData } = createProductDto;

    // Check if product with the same slug or SKU already exists
    const existingProduct = await this.prisma.product.findFirst({
      where: {
        OR: [{ slug: productData.slug }, { sku: productData.sku }],
      },
    });

    if (existingProduct) {
      throw new ConflictException(
        `Product with slug '${productData.slug}' or SKU '${productData.sku}' already exists`,
      );
    }

    // Create product with nested relations
    const createdProduct = await this.prisma.product.create({
      data: {
        ...productData,
        images: images
          ? {
              create: images,
            }
          : undefined,
        variants: variants
          ? {
              create: variants,
            }
          : undefined,
      },
      include: {
        images: true,
        variants: true,
        category: true,
      },
    });

    // Index the product in Algolia
    await this.searchService.indexProduct(createdProduct);

    // Invalidate product list caches
    await this.invalidateProductCaches();

    return createdProduct;
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    categoryId?: string;
    isActive?: boolean;
  }) {
    const { skip, take, categoryId, isActive } = params;

    const cacheKey = this.cacheService.generateKey(
      "products",
      "list",
      skip || 0,
      take || 10,
      categoryId || "all",
      isActive !== undefined ? isActive.toString() : "all",
    );

    return this.cacheService.getOrSet(
      cacheKey,
      async () => {
        return this.prisma.product.findMany({
          skip,
          take,
          where: {
            categoryId: categoryId ? categoryId : undefined,
            isActive: isActive !== undefined ? isActive : undefined,
          },
          include: {
            images: {
              orderBy: {
                sortOrder: "asc",
              },
            },
            category: true,
            _count: {
              select: {
                variants: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });
      },
      180, // Cache for 3 minutes
    );
  }

  async findOne(id: string) {
    const cacheKey = this.cacheService.generateKey("product", id);

    return this.cacheService.getOrSet(
      cacheKey,
      async () => {
        const product = await this.prisma.product.findUnique({
          where: { id },
          include: {
            images: {
              orderBy: {
                sortOrder: "asc",
              },
            },
            variants: true,
            category: true,
          },
        });

        if (!product) {
          throw new NotFoundException(`Product with ID '${id}' not found`);
        }

        return product;
      },
      300, // Cache for 5 minutes
    );
  }

  async findBySlug(slug: string) {
    const cacheKey = this.cacheService.generateKey("product", "slug", slug);

    return this.cacheService.getOrSet(
      cacheKey,
      async () => {
        const product = await this.prisma.product.findUnique({
          where: { slug },
          include: {
            images: {
              orderBy: {
                sortOrder: "asc",
              },
            },
            variants: true,
            category: true,
          },
        });

        if (!product) {
          throw new NotFoundException(`Product with slug '${slug}' not found`);
        }

        return product;
      },
      300, // Cache for 5 minutes
    );
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images, variants, ...productData } = updateProductDto;

    // Check if product exists
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundException(`Product with ID '${id}' not found`);
    }

    // Check if slug or SKU is being changed and if it conflicts with another product
    if (productData.slug || productData.sku) {
      const conflictingProduct = await this.prisma.product.findFirst({
        where: {
          OR: [
            productData.slug
              ? {
                  slug: productData.slug,
                  id: { not: id },
                }
              : {},
            productData.sku
              ? {
                  sku: productData.sku,
                  id: { not: id },
                }
              : {},
          ],
        },
      });

      if (conflictingProduct) {
        throw new ConflictException(
          "Another product with the same slug or SKU already exists",
        );
      }
    }

    // Update product
    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: {
        ...productData,
        // Handle images if provided
        ...(images && {
          images: {
            deleteMany: {},
            create: images,
          },
        }),
        // Handle variants if provided
        ...(variants && {
          variants: {
            deleteMany: {},
            create: variants,
          },
        }),
      },
      include: {
        images: true,
        variants: true,
        category: true,
      },
    });

    // Update the product in Algolia
    await this.searchService.indexProduct(updatedProduct);

    // Invalidate caches for this product
    await this.invalidateProductCaches(id);

    return updatedProduct;
  }

  async remove(id: string) {
    // Check if product exists
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundException(`Product with ID '${id}' not found`);
    }

    // Delete product (cascade delete will handle related entities)
    const deletedProduct = await this.prisma.product.delete({
      where: { id },
    });

    // Remove the product from Algolia index
    await this.searchService.removeProductFromIndex(id);

    // Invalidate caches for this product
    await this.invalidateProductCaches(id);

    return deletedProduct;
  }

  async updateInventory(id: string, quantity: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID '${id}' not found`);
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: {
        inventory: quantity,
      },
    });

    // Invalidate caches for this product
    await this.invalidateProductCaches(id);

    return updatedProduct;
  }

  private async invalidateProductCaches(productId?: string) {
    try {
      if (productId) {
        // Invalidate specific product caches
        await this.cacheService.del(
          this.cacheService.generateKey("product", productId),
        );

        // Also need to invalidate slug-based cache, but we'd need the slug
        // For now, we'll use a tag-based approach in the future
      }

      // Invalidate all product list caches (this is a simple approach)
      // In a production system, you might want to use more sophisticated cache tagging
      const cacheKeys = [
        "products:list:*", // This would need pattern-based deletion in Redis
      ];

      // For now, we'll clear specific common cache keys
      // In a real implementation, you'd want to track cache keys or use Redis patterns
      await this.cacheService.del("products:list:0:10:all:all");
      await this.cacheService.del("products:list:0:20:all:all");
      await this.cacheService.del("products:list:0:10:all:true");
    } catch (error) {
      console.error("Error invalidating product caches:", error);
    }
  }
}
