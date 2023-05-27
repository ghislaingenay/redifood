import { HttpStatus, Injectable } from '@nestjs/common';
import moment from 'moment';
import { DatabaseError } from 'redifood-module/src/handling-nestjs/database-error.exception';
import StripePayService from 'src/definitions/stripe-pay';
import { convertKeys } from 'src/foods/global.function';
import Stripe from 'stripe';
import {
  EPaymentStatus,
  EPaymentType,
  IGetServerSideData,
  IPaymentApi,
  IPaymentDB,
  UserPayload,
} from '../../redifood-module/src/interfaces';
import { CreatePaymentDto, PayPaymentDto } from './payments.dto';
import Payments from './paymentsrepo';

@Injectable()
export class PaymentsService {
  async getPaymentByOrderId(
    orderId: number,
    userId: UserPayload['id'],
  ): Promise<IGetServerSideData<IPaymentApi>> {
    const payment = await Payments.findByOrderId(orderId, userId);
    return {
      results: payment,
      statusCode: HttpStatus.OK,
      message: 'recovered',
    };
  }

  async initializePayment(
    paymentDto: CreatePaymentDto,
    userId: UserPayload['id'],
  ): Promise<IGetServerSideData<any>> {
    const paymentInformation: IPaymentApi = {
      ...paymentDto,
      userId,
      paymentDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    };

    const paymentDataDB = convertKeys<IPaymentApi, IPaymentDB>(
      paymentInformation,
      'apiToDb',
    );
    // query is created in repo
    await Payments.createOne(paymentDataDB);
    return {
      results: {},
      message: 'Payment initialized',
      statusCode: HttpStatus.CREATED,
    };
  }

  // or maybe payment already performed before
  async payOrder(
    payPaymentDto: PayPaymentDto,
    userId: UserPayload['id'],
    paymentType: EPaymentType,
    token: Stripe.Token,
  ): Promise<IGetServerSideData<{ isPaid: boolean }>> {
    // check for discount
    if (paymentType === EPaymentType.CASH) {
      const updatedData: Partial<IPaymentApi> = {
        id: payPaymentDto.id,
        paymentType: EPaymentType.CASH,
        paymentStatus: EPaymentStatus.COMPLETED,
      };
      try {
        // update payment - catch err already in updateOne function
        const res = await Payments.updateOne(updatedData, userId);
        if (!res) throw new DatabaseError();
        return {
          results: { isPaid: true },
          statusCode: HttpStatus.OK,
          message: `Payment for order #${payPaymentDto.orderId} is completed}`,
        };
      } catch (err) {
        return {
          results: { isPaid: false },
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An issue occured while updating payment',
        };
      }
    } else {
      const stripePayment = new StripePayService({
        userId,
        token,
        id: payPaymentDto.orderId,
        service: 'payments',
      });
      try {
        const chargeData = await stripePayment.payCharge();
        console.log('chrged', chargeData);
        return {
          results: { isPaid: true },
          statusCode: HttpStatus.OK,
          message: 'recovered',
        };
      } catch (err) {
        return {
          results: { isPaid: false },
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Issue while paying with stripe',
        };
      }
    }
  }
}
