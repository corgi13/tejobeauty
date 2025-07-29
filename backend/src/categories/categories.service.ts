import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";

import { PrismaService } from "../prisma.service";
import { SearchService } from "../search/search.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly searchService: SearchService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { name, slug, parentId } = createCategoryDto;

    // Check if category with the same slug already exists
    const existingCategory = await this.prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      throw new ConflictException(
        `Category with slug '${slug}' already exists`,
      );
    }

    // If parentId is provided, check if parent category exists
    if (parentId) {
      const parentCategory = await this.prisma.category.findUnique({
        where: { id: parentId },
      });

      if (!parentCategory) {
        throw new NotFoundException(
          `Parent category with ID '${parentId}' not found`,
        );
      }
    }

    const createdCategory = await this.prisma.category.create({
      data: createCategoryDto,
      include: {
        parent: true,
      },
    });

    // Index the category in Algolia
    await this.searchService.indexCategory(createdCategory);

    return createdCategory;
  }

  async findAll(params: {
    includeInactive?: boolean;
    parentId?: string | null;
  }) {
    const { includeInactive = false, parentId } = params;

    return this.prisma.category.findMany({
      where: {
        isActive: includeInactive ? undefined : true,
        parentId: parentId === null ? null : parentId,
      },
      include: {
        parent: true,
        _count: {
          select: {
            products: true,
            children: true,
          },
        },
      },
      orderBy: {
        sortOrder: "asc",
      },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: {
          where: {
            isActive: true,
          },
          orderBy: {
            sortOrder: "asc",
          },
        },
        products: {
          where: {
            isActive: true,
          },
          take: 10,
          include: {
            images: {
              take: 1,
            },
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID '${id}' not found`);
    }

    return category;
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        parent: true,
        children: {
          where: {
            isActive: true,
          },
          orderBy: {
            sortOrder: "asc",
          },
        },
        products: {
          where: {
            isActive: true,
          },
          take: 10,
          include: {
            images: {
              take: 1,
            },
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with slug '${slug}' not found`);
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const { slug, parentId } = updateCategoryDto;

    // Check if category exists
    const existingCategory = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundException(`Category with ID '${id}' not found`);
    }

    // If slug is being changed, check if it conflicts with another category
    if (slug && slug !== existingCategory.slug) {
      const slugExists = await this.prisma.category.findFirst({
        where: {
          slug,
          id: { not: id },
        },
      });

      if (slugExists) {
        throw new ConflictException(
          `Category with slug '${slug}' already exists`,
        );
      }
    }

    // If parentId is provided, check if parent category exists and prevent circular references
    if (parentId) {
      // Cannot set parent to self
      if (parentId === id) {
        throw new ConflictException("Category cannot be its own parent");
      }

      const parentCategory = await this.prisma.category.findUnique({
        where: { id: parentId },
      });

      if (!parentCategory) {
        throw new NotFoundException(
          `Parent category with ID '${parentId}' not found`,
        );
      }

      // Check for circular references
      let currentParent = parentCategory;
      while (currentParent.parentId) {
        if (currentParent.parentId === id) {
          throw new ConflictException(
            "Circular reference detected in category hierarchy",
          );
        }
        const parent = await this.prisma.category.findUnique({
          where: { id: currentParent.parentId },
        });
        if (!parent) break;
        currentParent = parent;
      }
    }

    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
      include: {
        parent: true,
        children: true,
      },
    });

    // Update the category in Algolia
    await this.searchService.indexCategory(updatedCategory);

    return updatedCategory;
  }

  async remove(id: string) {
    // Check if category exists
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            children: true,
            products: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID '${id}' not found`);
    }

    // Check if category has children or products
    if (category._count.children > 0) {
      throw new ConflictException("Cannot delete category with subcategories");
    }

    if (category._count.products > 0) {
      throw new ConflictException("Cannot delete category with products");
    }

    const deletedCategory = await this.prisma.category.delete({
      where: { id },
    });

    // Remove the category from Algolia index
    await this.searchService.removeCategoryFromIndex(id);

    return deletedCategory;
  }

  async getCategoryTree() {
    // Get all root categories (those without a parent)
    const rootCategories = await this.prisma.category.findMany({
      where: {
        parentId: null,
        isActive: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
    });

    // For each root category, recursively get its children
    const categoryTree = await Promise.all(
      rootCategories.map(async (rootCategory) => {
        const children = await this.getChildCategories(rootCategory.id);
        return {
          ...rootCategory,
          children,
        };
      }),
    );

    return categoryTree;
  }

  private async getChildCategories(parentId: string): Promise<any[]> {
    const children = await this.prisma.category.findMany({
      where: {
        parentId,
        isActive: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
    });

    if (children.length === 0) {
      return [];
    }

    return Promise.all(
      children.map(async (child): Promise<any> => {
        const grandchildren: any[] = await this.getChildCategories(child.id);
        return {
          ...child,
          children: grandchildren,
        };
      }),
    );
  }
}
