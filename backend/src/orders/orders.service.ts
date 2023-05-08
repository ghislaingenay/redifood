import { Injectable } from '@nestjs/common';
import {
  IGetServerSideData,
  IOrderApi,
  IOrderItemsApi,
  TOrderType,
  UserPayload,
} from 'redifood-module/src/interfaces';
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
      statusCode: 200,
      results: orderItemsResults,
      message: 'Order items recovered',
    };
  }

  async getUnPaidOrdersTable(): Promise<IGetServerSideData<number[]>> {
    const orderItemsResults = await Orders.findTable();
    return {
      statusCode: 200,
      results: orderItemsResults,
      message: 'Order items recovered',
    };
  }
}
