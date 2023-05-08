import { HttpStatus, Injectable } from '@nestjs/common';
import {
  EOrderStatus,
  IGetServerSideData,
  IOrderApi,
  IOrderItemsApi,
  TOrderType,
  UserPayload,
} from 'redifood-module/src/interfaces';
import {
  AwaitPaymenDto,
  CreateOrderDto,
  ReceiptBodyDto,
  UpdateOrderDto,
} from './orders.dto';
import Orders from './ordersrepo';

@Injectable()
export class OrdersService {
  async getOrders(
    orderType: TOrderType,
    userId: UserPayload['id'],
  ): Promise<IGetServerSideData<IOrderApi[]>> {
    const orderResults = await Orders.findAll(orderType, userId);
    return {
      statusCode: 200,
      results: orderResults,
      message: 'Orders recovered',
    };
  }

  async getOneOrder(
    orderId: number,
    userId: UserPayload['id'],
  ): Promise<IGetServerSideData<IOrderApi>> {
    const orderResults = await Orders.findOne({ orderId, userId });
    return {
      statusCode: 200,
      results: orderResults,
      message: 'Order recovered',
    };
  }

  async getOrderItems(
    orderId: number,
  ): Promise<IGetServerSideData<IOrderItemsApi[]>> {
    const orderItemsResults = await Orders.findOrderItems(orderId);
    return {
      statusCode: HttpStatus.OK,
      results: orderItemsResults,
      message: 'Order items recovered',
    };
  }

  async getUnPaidOrdersTable(): Promise<IGetServerSideData<number[]>> {
    const orderItemsResults = await Orders.findTable();
    return {
      statusCode: HttpStatus.OK,
      results: orderItemsResults,
      message: 'Order items recovered',
    };
  }

  async createOrder(
    body: CreateOrderDto,
    userId: UserPayload['id'],
  ): Promise<IGetServerSideData<any>> {
    const totalPrice = body.orderItems.reduce((acc, item) => {
      return acc + item.itemPrice * item.itemQuantity;
    }, 0);
    const getOrderNo = await Orders.countOrders();
    const today = new Date();
    // Generate order number
    const orderNo = `${today.getFullYear()}${
      today.getMonth() + 1
    }${getOrderNo}`;
    const updatedBody: Omit<IOrderApi, 'orderFinished' | 'orderCreatedDate'> = {
      orderTotal: totalPrice,
      orderNo,
      orderTableNumber: body.orderTableNumber,
      orderStatus: EOrderStatus.CREATED,
      userId,
      orderItems: body.orderItems,
    };
    const orderResults = await Orders.createOrder(updatedBody);
    return {
      statusCode: HttpStatus.CREATED,
      results: orderResults,
      message: 'Order created',
    };
  }

  async createOrderItems({
    orderItems,
    userId,
    orderId,
  }: {
    orderItems: string;
    userId: UserPayload['id'];
    orderId: number;
  }) {
    const orderItemsResults = await Orders.setOrderItems(
      {
        userId,
        orderId,
      },
      orderItems,
    );
    return {
      statusCode: HttpStatus.CREATED,
      results: orderItemsResults,
      message: 'Order items created',
    };
  }

  async updateOrder(
    orderId: number,
    updateOrderDto: UpdateOrderDto,
  ): Promise<IGetServerSideData<any>> {
    await Orders.updateOrder(updateOrderDto, orderId);
    return {
      statusCode: HttpStatus.OK,
      results: {},
      message: 'Order updated',
    };
  }

  async cancelOrder(orderId: number): Promise<IGetServerSideData<any>> {
    await Orders.cancelOrder(orderId);
    return {
      statusCode: HttpStatus.OK,
      results: {},
      message: 'Order cancelled',
    };
  }

  async awaitPayment(body: AwaitPaymenDto) {
    // emptty
    console.log(body);
  }

  async sendReceipt(sendReceiptDto: ReceiptBodyDto, orderId: number) {
    // empty
    console.log(sendReceiptDto, orderId);
  }
}
