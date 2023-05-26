import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { PaginationModule } from './pagination/pagination.module';

@Module({
  imports: [UsersModule, OrderModule, ProductModule,ConfigModule.forRoot(), PaginationModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
