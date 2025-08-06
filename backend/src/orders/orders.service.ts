import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return [];
  }

  async create(orderData: any) {
    return { id: '1', ...orderData, status: 'PENDING' };
  }
}