import { Injectable } from '@nestjs/common';
import { IGetServerSideData, TOrderType } from 'redifood-module/src/interfaces';

@Injectable()
export class OrdersService {
  async getOrders(
    orderType: TOrderType,
    userId: number,
  ): Promise<IGetServerSideData<any>> {
    return {
      statusCode: 200,
      results: [],
      message: 'Orders recovered',
    };
  }
}
