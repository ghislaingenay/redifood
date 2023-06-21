import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  EPaymentType,
  TOrderType,
  UserPayload,
} from '../../redifood-module/src/interfaces';
import { User } from '../../src/auth/user-decorator';
import GoogleSheetService, {
  IOrderData,
} from '../../src/definitions/googlesheet';
import { AuthGuard } from '../../src/global/auth-guard';
import { ValidationPipe } from '../../src/global/validation.pipe';
import {
  AwaitPaymenDto,
  CreateOrderDto,
  ReceiptBodyDto,
  UpdateOrderDto,
} from './orders.dto';
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
  @Get('table')
  async getUnPaidOrdersTable(@User() user: UserPayload) {
    return await this.ordersService.getUnPaidOrdersTable(user.id);
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
  @Get(':id/edit')
  async getEditOrder(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
    @User() user: UserPayload,
  ) {
    return await this.ordersService.getEditOrder(id, user.id);
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

  @UseGuards(new AuthGuard())
  @Post('sheet')
  async createRowInSheet(@Body() body: IOrderData) {
    const sheets = new GoogleSheetService();
    const res = await sheets.createRow(body);
    return res;
  }

  @UseGuards(new AuthGuard())
  @Post(':id')
  async awaitPayment(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    orderId: number,
    @Query('paymentType') paymentType: EPaymentType,
    @User() user: UserPayload,
    @Body() data: any,
  ) {
    const body: AwaitPaymenDto = {
      ...data,
      orderId,
      userId: user.id,
      paymentType,
    };
    return await this.ordersService.awaitPayment(body);
  }

  @UseGuards(new AuthGuard())
  @Post('receipt/:id')
  async sendReceipt(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    orderId: number,
    @Body(new ValidationPipe()) sendReceiptDto: ReceiptBodyDto,
  ) {
    return await this.ordersService.sendReceipt(sendReceiptDto, orderId);
  }

  @UseGuards(new AuthGuard())
  @Post()
  async createOrder(
    @Body(new ValidationPipe()) createOrderDto: CreateOrderDto,
    @User() user: UserPayload,
  ) {
    return await this.ordersService.createOrder(createOrderDto, user.id);
  }

  @UseGuards(new AuthGuard())
  @Put(':id')
  async updateOrder(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
    @Body(new ValidationPipe()) updateOrderDto: UpdateOrderDto,
    @User() user: UserPayload,
  ) {
    return await this.ordersService.updateOrder(id, updateOrderDto, user.id);
  }

  @UseGuards(new AuthGuard())
  @Delete(':id')
  async cancelOrder(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    orderId: number,
    @User() user: UserPayload,
  ) {
    return await this.ordersService.cancelOrder(orderId, user.id);
  }

  // update order and update order item // send back the menu
  // cancel order apin and update order item
  // add await payment api
  // add to google sheet as well to have all the data
  // add information for receipt as well
}
