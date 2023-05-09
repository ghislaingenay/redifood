import { HttpStatus, Injectable } from '@nestjs/common';
import {
  IGetServerSideData,
  UserPayload,
} from '../../redifood-module/src/interfaces';

@Injectable()
export class PaymentsService {
  async getPaymentByOrderId(
    orderId: number,
    userId: UserPayload['id'],
  ): Promise<IGetServerSideData<any>> {
    console.log(orderId, userId);
    return { results: 'yes', statusCode: HttpStatus.OK, message: 'recovered' };
  }

  async payOrder(createPaymentDto: any): Promise<IGetServerSideData<any>> {
    console.log(createPaymentDto);
    return { results: 'yes', statusCode: HttpStatus.OK, message: 'recovered' };
  }
}
