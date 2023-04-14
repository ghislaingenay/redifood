import { Controller, Get, Post, Put } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('api/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @EventPattern('food-created')
  @EventPattern('food-updated')
  @EventPattern('food-deleted')
  @Get('paid')
  getPaidOrder(): string {
    return '';
  }

  @Get(':id')
  getOneOrder() {}

  @Post()
  createOrder() {}

  @Put(':id')
  editOrder() {}

  @Put(':id/await')
  setAwaitPayment() {}
  // should emit an event to payment service by settings the order there and foods

  @Put('id/delete')
  cancelOrder() {}
  // should emit an event
}
