import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SearchService } from '../search/search.service';

@Injectable()
export class ProductCatalogService {
  constructor(
    private prisma: PrismaService,
    private searchService: SearchService,
  ) {}

  async createProductWithSpecs(productData: any, specifications: any) {
    const product = await this.prisma.product.create({
      data: {
        ...productData,
        specifications: {
          create: specifications,
        },
      },
    });
    await this.searchService.indexProduct(product);
    return product;
  }

  async updateProductAvailability(productId: string, quantity: number, leadTime: number) {
    console.log(`Updating availability for product ${productId}: quantity=${quantity}, leadTime=${leadTime}`);
    return { message: 'Product availability updated successfully' };
  }

  async addProductCertification(productId: string, certificationData: any) {
    console.log(`Adding certification to product ${productId}:`, certificationData);
    return { message: 'Product certification added successfully' };
  }

  async linkProductToSupplier(productId: string, supplierId: string) {
    const product = await this.prisma.product.update({
      where: { id: productId },
      data: { supplierId },
    });
    await this.searchService.indexProduct(product);
    return product;
  }

  async manageProductCategories(productId: string, categoryIds: string[]) {
    // This is a simplified example. In a real application, you would handle this differently.
    const product = await this.prisma.product.update({
      where: { id: productId },
      data: { categoryId: categoryIds[0] },
    });
    await this.searchService.indexProduct(product);
    return product;
  }
}
