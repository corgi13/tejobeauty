import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, estypes } from '@elastic/elasticsearch';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SearchService implements OnModuleInit {
  private client: Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.client = new Client({
      node: this.configService.get('ELASTICSEARCH_NODE'),
    });
  }

  async onModuleInit() {
    await this.createIndices();
  }

  async createIndices() {
    const indices = ['products', 'categories'];
    for (const index of indices) {
      const indexExists = await this.client.indices.exists({ index });
      if (!indexExists) {
        await this.client.indices.create({ index });
      }
    }
  }

  async indexProduct(product: any) {
    await this.client.index({
      index: 'products',
      id: product.id,
      document: product,
    });
  }

  async indexProducts(products: any[]) {
    const operations = products.flatMap((doc) => [{ index: { _index: 'products', _id: doc.id } }, doc]);
    await this.client.bulk({ refresh: true, operations });
  }

  async indexCategory(category: any) {
    await this.client.index({
      index: 'categories',
      id: category.id,
      document: category,
    });
  }

  async indexCategories(categories: any[]) {
    const operations = categories.flatMap((doc) => [{ index: { _index: 'categories', _id: doc.id } }, doc]);
    await this.client.bulk({ refresh: true, operations });
  }

  async removeProductFromIndex(productId: string) {
    await this.client.delete({ index: 'products', id: productId });
  }

  async removeCategoryFromIndex(categoryId: string) {
    await this.client.delete({ index: 'categories', id: categoryId });
  }

  async search(query: string, options: any = {}) {
    const { categoryId, page = 0, hitsPerPage = 20 } = options;
    const from = page * hitsPerPage;

    const searchConfig: estypes.SearchRequest = {
      index: 'products',
      from,
      size: hitsPerPage,
      query: {
        bool: {
          must: [
            {
              multi_match: {
                query,
                fields: ['name', 'description'],
              },
            },
          ],
          filter: [],
        },
      },
    };

    if (categoryId) {
      (searchConfig.query.bool.filter as estypes.QueryDslQueryContainer[]).push({
        term: {
          categoryId,
        },
      });
    }

    const response = await this.client.search(searchConfig);
    const total = typeof response.hits.total === 'number' ? response.hits.total : response.hits.total?.value ?? 0;

    return {
      hits: response.hits.hits.map((hit: any) => hit._source),
      nbHits: total,
      page,
      nbPages: Math.ceil(total / hitsPerPage),
      hitsPerPage,
    };
  }

  async searchCategories(query: string, options: any = {}) {
    const { parentId, page = 0, hitsPerPage = 20 } = options;
    const from = page * hitsPerPage;

    const searchConfig: estypes.SearchRequest = {
      index: 'categories',
      from,
      size: hitsPerPage,
      query: {
        bool: {
          must: [
            {
              multi_match: {
                query,
                fields: ['name', 'description'],
              },
            },
          ],
          filter: [],
        },
      },
    };

    if (parentId && searchConfig.query && searchConfig.query.bool) {
      (searchConfig.query.bool.filter as estypes.QueryDslQueryContainer[]).push({
        term: {
          parentId,
        },
      });
    }

    const response = await this.client.search(searchConfig);
    const total = typeof response.hits.total === 'number' ? response.hits.total : response.hits.total?.value ?? 0;

    return {
      hits: response.hits.hits.map((hit: any) => hit._source),
      nbHits: total,
      page,
      nbPages: Math.ceil(total / hitsPerPage),
      hitsPerPage,
    };
  }

  async reindexAll() {
    const products = await this.prisma.product.findMany();
    await this.indexProducts(products);

    const categories = await this.prisma.category.findMany();
    await this.indexCategories(categories);
  }
}
