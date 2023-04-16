import { Controller, Get, Inject, Post, Put } from '@nestjs/common';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import {
  FoodCreatedEvent,
  FoodDeletedEvent,
  FoodUpdatedEvent,
} from 'redifood-module/src/events/foods-event';
import { EGroupId, ETopics } from 'redifood-module/src/interfaces';
import { OrderService } from './order.service';

@Controller('api/order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    @Inject(EGroupId.FOOD) private readonly foodClient: ClientProxy,
  ) {}

  @EventPattern(ETopics.FOOD_CREATED)
  async createFood(data: FoodCreatedEvent) {
    console.log('Event food created', data);
  }
  @EventPattern(ETopics.FOOD_UPDATED)
  async updateFood(data: FoodUpdatedEvent) {
    console.log('Event food updated', data);
  }
  @EventPattern(ETopics.FOOD_DELETED)
  async deleteFood(data: FoodDeletedEvent) {
    console.log('Eevnt food deleted', data);
  }

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
    // this.foodClient.emit(ETopics.ORDER_CREATED)
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
