import { Controller, Get, Post, Put } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
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
  getOneOrder() {
    //empty
  }

  @Post()
  createOrder() {
    //empty
  }

  @Put(':id')
  editOrder() {
    //empty
  }

  @Put(':id/await')
  setAwaitPayment() {
    //empty
  }
  // should emit an event to payment service by settings the order there and foods

  @Put('id/delete')
  cancelOrder() {
    //empty
  }
  // should emit an event
}
