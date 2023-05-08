import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TOrderType, UserPayload } from '../../redifood-module/src/interfaces';
import { User } from '../../src/auth/user-decorator';
import { AuthGuard } from '../../src/global/auth-guard';
import { ValidationPipe } from '../../src/global/validation.pipe';
import { OrdersService } from './orders.service';

@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // get paid orders or all (add a param to the function) by userid
  @UseGuards(new AuthGuard())
  @Get()
  async getOrders(
    @Query('orderType') orderType: TOrderType,
    @User() user: UserPayload,
  ) {
    const userId = user.id;
    return await this.ordersService.getOrders(orderType, userId);
  }

  @UseGuards(new AuthGuard())
  @Get(':id')
  async getOneOrder(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
    @User() user: UserPayload,
  ) {
    return await this.ordersService.getOneOrder(id, user.id);
  }

  @UseGuards(new AuthGuard())
  @Get('items/:id')
  async getOrderItems(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return await this.ordersService.getOrderItems(id);
  }

  @Get('table')
  async getUnPaidOrdersTable() {
    return await this.ordersService.getUnPaidOrdersTable();
  }

  @UseGuards(new AuthGuard())
  @Post()
  async createOrder(
    @Body(new ValidationPipe()) createOrderDto: any,
    @User() user: UserPayload,
  ) {
    // get order tot and set it to the order
    return await this.ordersService.createOrder(createOrderDto, user.id);
  }
  // get one order by user id
  // create order => dto, then get global price and separate each order item and set it after order is created. create function to get order id (getOrderCoiunt)
  // create order Item db based on the order*
  // update order and update order item // send back the menu
  // cancel order apin and update order item
  // add await payment api
  // add to google sheet as well to have all the data
  // add information for receipt as well
}
