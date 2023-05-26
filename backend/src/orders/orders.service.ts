import { HttpStatus, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { Setting } from 'src/models/settings.model';
import Payments from 'src/payments/paymentsrepo';
import {
  EOrderStatus,
  EPaymentStatus,
  IGetServerSideData,
  IOrderApi,
  IOrderItemsApi,
  IPaymentDB,
  TOrderType,
  UserPayload,
} from '../../redifood-module/src/interfaces';
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

  async getUnPaidOrdersTable(
    userId: UserPayload['id'],
  ): Promise<IGetServerSideData<number[]>> {
    const orderItemsResults = await Orders.findTable(userId);
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
    const totalPrice = await Orders.calculateAmountFromMenu(
      body.orderItems,
      userId,
    );
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
    userId: UserPayload['id'],
  ): Promise<IGetServerSideData<any>> {
    await Orders.updateOrder(updateOrderDto, orderId, userId);
    return {
      statusCode: HttpStatus.OK,
      results: {},
      message: 'Order updated',
    };
  }

  async cancelOrder(
    orderId: number,
    userId: UserPayload['id'],
  ): Promise<IGetServerSideData<any>> {
    await Orders.cancelOrder(orderId, userId);
    await Payments.cancelPayment(orderId, userId);

    return {
      statusCode: HttpStatus.OK,
      results: {},
      message: 'Order cancelled',
    };
  }

  async awaitPayment(
    body: AwaitPaymenDto,
  ): Promise<IGetServerSideData<IPaymentDB>> {
    const { orderId, userId, paymentType } = body;
    console.log('%c params', 'color: #00e600', body);
    const orderData = await Orders.findOne({ orderId, userId });
    const settingData = await Setting.findOne({ user: userId });
    const dataForPayment: IPaymentDB = {
      user_id: userId,
      order_id: orderId,
      payment_stripe_id: '',
      payment_status: EPaymentStatus.AWAITING,
      payment_type: paymentType,
      payment_amount: orderData.orderTotal,
      payment_date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      payment_discount_applied: false,
      payment_discount_id: 0,
      payment_tax_amount: orderData.orderTotal * (settingData.vat / 100),
    };
    const paymentResult = await Payments.createOne(dataForPayment);
    if (paymentResult.created) {
      return {
        statusCode: HttpStatus.OK,
        results: dataForPayment,
        message: `Payment created from order ${orderId}`,
      };
    } else {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        results: dataForPayment,
        message: `Payment not created from order ${orderId}`,
      };
    }
  }

  async sendReceipt(sendReceiptDto: ReceiptBodyDto, orderId: number) {
    // empty
    console.log(sendReceiptDto, orderId);
  }
}
