import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return [
      {
        id: '1',
        name: 'Professional Nail Polish Set',
        sku: 'TNP001',
        price: 45.99,
        category: 'Polish',
        description: 'High-quality nail polish set with 12 vibrant colors',
        inStock: true,
        minOrderQuantity: 5,
      },
      {
        id: '2',
        name: 'UV Gel Base Coat',
        sku: 'TNP002',
        price: 28.50,
        category: 'Gel',
        description: 'Professional UV gel base coat for long-lasting manicures',
        inStock: true,
        minOrderQuantity: 10,
      },
      {
        id: '3',
        name: 'Cuticle Oil Premium',
        sku: 'TNP003',
        price: 15.99,
        category: 'Care',
        description: 'Nourishing cuticle oil with vitamin E',
        inStock: true,
        minOrderQuantity: 12,
      },
    ];
  }

  async findOne(id: string) {
    const products = await this.findAll();
    return products.find(p => p.id === id);
  }
}