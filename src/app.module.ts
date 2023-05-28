import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { PaginationModule } from './pagination/pagination.module';
import { ReviewModule } from './review/review.module';
import { CategoryModule } from './category/category.module';
import { FilesModule } from './files/files.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [UsersModule, OrderModule, ProductModule,ConfigModule.forRoot(), PaginationModule, ReviewModule, CategoryModule, FilesModule, MulterModule.register({
    dest: './uploads',
  })],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
