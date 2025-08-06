import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';

export const createTestingModule = async (providers: any[] = []) => {
  const module = await Test.createTestingModule({
    providers: [
      PrismaService,
      ...providers,
    ],
  }).compile();

  return module;
};

export const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  product: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  order: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  quote: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};