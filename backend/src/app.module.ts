import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { UsersModule } from './users/users.module';
import { B2BModule } from './modules/b2b.module';

@Module({
  imports: [
    AuthModule,
    ProductsModule,
    OrdersModule,
    UsersModule,
    B2BModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}