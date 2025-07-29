import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private prisma: ReturnType<typeof this.createPrismaClient>;

  constructor() {
    super();
    this.prisma = this.createPrismaClient();
  }

  private createPrismaClient() {
    return new PrismaClient().$extends(withAccelerate());
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Expose the extended Prisma client
  get client() {
    return this.prisma;
  }
}
