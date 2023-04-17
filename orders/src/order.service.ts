import { Injectable } from '@nestjs/common';
import {
  EOrderStatus,
  IGetServerSideData,
} from 'redifood-module/src/interfaces';
import { DatabaseError } from '../redifood-module/src/handling-nestjs/database-error.exception';
import { Order, OrdersDoc } from './models/orders.model';

@Injectable()
export class OrderService {
  async getPaidOrder(): Promise<IGetServerSideData<OrdersDoc[], any>> {
    const res = await Order.find({ orderStatus: EOrderStatus.COMPLETE });
    if (!res) throw new DatabaseError();
    return {
      results: res,
      message: 'success',
    };
  }

  async getOneOrder(id: number): Promise<IGetServerSideData<OrdersDoc, any>> {
    const res = await Order.findById(id);
    if (!res) throw new DatabaseError();
    return {
      results: res,
      message: 'success',
    };
  }
}
