import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import {
  FoodCreatedEvent,
  FoodDeletedEvent,
  FoodUpdatedEvent,
} from 'redifood-module/src/events/foods-event';
import { OrderStateEvent } from '../redifood-module/src/events/orders-event';
import {
  EGroupId,
  EOrderStatus,
  ETopics,
  IGetServerSideData,
} from '../redifood-module/src/interfaces';
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
  async getPaidOrder() {
    return await this.orderService.getPaidOrder();
  }

  @Get(':id')
  async getOneOrder(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return await this.orderService.getOneOrder(id);
  }

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDro) {
    //empty
    const orderId = '67';
    await this.foodClient.emit(
      ETopics.ORDER_CREATED,
      new OrderStateEvent(orderId, EOrderStatus.CREATED),
    );
  }

  @Put(':id')
  async editOrder() {
    //empty
  }

  @Put(':id/await')
  setAwaitPayment(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    //empty
  }
  // should emit an event to payment service by settings the order there and foods

  @Put('id/delete')
  async cancelOrder(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    //empty
    const orderId = '67';
    await this.foodClient.emit(
      ETopics.ORDER_CANCELLED,
      new OrderStateEvent(orderId, EOrderStatus.CANCELLED),
    );
  }
  // should emit an event
}
