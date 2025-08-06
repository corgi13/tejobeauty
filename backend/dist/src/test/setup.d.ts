export declare const createTestingModule: (providers?: any[]) => Promise<import("@nestjs/testing").TestingModule>;
export declare const mockPrismaService: {
    user: {
        findUnique: jest.Mock<any, any, any>;
        findMany: jest.Mock<any, any, any>;
        create: jest.Mock<any, any, any>;
        update: jest.Mock<any, any, any>;
        delete: jest.Mock<any, any, any>;
    };
    product: {
        findMany: jest.Mock<any, any, any>;
        findUnique: jest.Mock<any, any, any>;
        create: jest.Mock<any, any, any>;
        update: jest.Mock<any, any, any>;
    };
    order: {
        findMany: jest.Mock<any, any, any>;
        create: jest.Mock<any, any, any>;
        update: jest.Mock<any, any, any>;
    };
    quote: {
        findMany: jest.Mock<any, any, any>;
        findUnique: jest.Mock<any, any, any>;
        create: jest.Mock<any, any, any>;
        update: jest.Mock<any, any, any>;
    };
};
