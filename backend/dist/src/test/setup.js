"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockPrismaService = exports.createTestingModule = void 0;
const testing_1 = require("@nestjs/testing");
const prisma_service_1 = require("../prisma/prisma.service");
const createTestingModule = async (providers = []) => {
    const module = await testing_1.Test.createTestingModule({
        providers: [
            prisma_service_1.PrismaService,
            ...providers,
        ],
    }).compile();
    return module;
};
exports.createTestingModule = createTestingModule;
exports.mockPrismaService = {
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
//# sourceMappingURL=setup.js.map