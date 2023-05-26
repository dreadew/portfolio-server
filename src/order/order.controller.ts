import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, HttpCode } from '@nestjs/common';
import { OrderService } from './order.service';
import { CurrentUser } from 'src/users/decorators/user.decorator';
import { Auth } from 'src/users/decorators/auth.decorator';
import { OrderDTO } from './dto/order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @Auth()
  findAll(@CurrentUser('id') userId: number) {
    return this.orderService.findAll(userId);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  @Auth()
  placeOrder(@Body() dto: OrderDTO, @CurrentUser('id') userId: number) {
    return this.orderService.placeOrder(dto, userId);
  }

}
