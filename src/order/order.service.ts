import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { OrderDTO } from './dto/order.dto';
import { returnProductObject } from 'src/product/return-product.object';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: number) {
    return await this.prisma.order.findMany({
      where: {
        userId
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        items: {
          include: {
            product: {
              select: returnProductObject
            }
          }
        }
      }
    });
  }
  
  async placeOrder(dto: OrderDTO, userId: number) {
    const total = dto.items.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0)

    const order = await this.prisma.order.create({
      data: {
        status: dto.status,
        items: {
          create: dto.items
        },
        total,
        user: {
          connect: {
            id: userId
          }
        }
      }
    })

    return order;
  }
}
