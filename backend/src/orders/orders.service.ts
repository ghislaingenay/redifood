import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { BadRequestError } from 'redifood-module/src/errors/bad-request-error';
import Foods from 'src/foods/foodsrepo';
import { Setting } from 'src/models/settings.model';
import Payments from 'src/payments/paymentsrepo';
import {
  AsyncServer,
  EOrderStatus,
  IFoodOrder,
  IGetEditOrderRes,
  IGetHistoryOrders,
  IGetOneOrder,
  IGetServerSideData,
  IOrderApi,
  IOrderItemsApi,
  IPaymentDB,
  TGetHistoryParams,
  TOrderType,
  UserPayload,
} from '../../redifood-module/src/interfaces';
import { AwaitPaymentDto, CreateOrderDto, UpdateOrderDto } from './orders.dto';
import Orders from './ordersrepo';

@Injectable()
export class OrdersService {
  async getOrders(
    orderType: TOrderType,
    userId: UserPayload['id'],
  ): Promise<
    IGetServerSideData<{
      orders: IOrderApi<IFoodOrder[]>[];
      unPaidOrdersNo: string[];
    }>
  > {
    const orderResults = await Orders.findAll(orderType, userId);
    const ordersWithItems: IOrderApi<IFoodOrder[]>[] = [...orderResults].map(
      (item) => {
        return {
          ...item,
          orderItems: JSON.parse(item.orderItems),
        } as IOrderApi<IFoodOrder[]>;
      },
    );

    const unPaidOrdersNo = orderResults.map((item) => item.orderNo);
    return {
      statusCode: 200,
      results: { orders: ordersWithItems, unPaidOrdersNo },
      message: 'Orders recovered',
    };
  }

  async getHistoryOrders(
    params: TGetHistoryParams,
    userId: UserPayload['id'],
  ): Promise<IGetServerSideData<IGetHistoryOrders>> {
    try {
      const meta = await Orders.getPaginationOrdersHistory(params, userId);
      const orders = await Orders.getPaidOrdersFromHistoryParams(
        params,
        userId,
      );
      return {
        message: 'Orders recovered',
        results: { orders, meta },
        statusCode: HttpStatus.OK,
      };
    } catch (err) {
      throw new BadRequestError(err.message);
    }
  }

  async getOneOrder(
    orderId: number,
    userId: UserPayload['id'],
  ): Promise<IGetServerSideData<IGetOneOrder>> {
    try {
      const orderResult = await Orders.findOne({ orderId, userId });
      // need to parse the orderItems
      const parsedOrderItems = JSON.parse(orderResult.orderItems);
      const parsedOrderResult: IOrderApi<IFoodOrder[]> = {
        ...orderResult,
        orderItems: JSON.parse(orderResult.orderItems),
      };
      const foodIdArray = parsedOrderItems.map((item) => item.id);
      const foodList = await Foods.getFoodApiByFoodIdArray(foodIdArray, userId);
      return {
        statusCode: 200,
        results: { currentOrder: parsedOrderResult, foodList },
        message: 'Order recovered',
      };
    } catch (err) {
      throw new BadRequestError(err.message);
    }
  }

  async getEditOrder(
    orderId: number,
    userId: UserPayload['id'],
  ): AsyncServer<IGetEditOrderRes> {
    try {
      const order = await Orders.findOne({ orderId, userId });
      const orderItems = order.orderItems;
      const orderItemsResults: IFoodOrder[] = JSON.parse(orderItems);
      const foodIdArray =
        Orders.getFoodIdArrayFromOrderItems(orderItemsResults);
      const foodResults = await Foods.getFoodApiByFoodIdArray(
        foodIdArray,
        userId,
      );
      const updatedFoodWithQuantity = Orders.addFoodQuantityToOrderItems(
        foodResults,
        orderItemsResults,
      );
      const { foods, listing } = await Foods.getAllInformationBySection(userId);
      return {
        results: {
          foodList: foods,
          foodSectionExtra: listing,
          order,
          orderFoodItems: updatedFoodWithQuantity,
        },
        statusCode: HttpStatus.OK,
        message: 'Order recovered',
      };
    } catch (err) {
      throw new BadRequestError('Order not found');
    }
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
    // Check the table if not already allocated
    const orderItemsResults = await Orders.findTable(userId);
    if (orderItemsResults.includes(body.orderTableNumber))
      throw new BadRequestError('Table already has an order');
    const getOrderNo = await Orders.countOrders();
    const today = new Date();
    // Generate order number
    const orderNo = `${today.getFullYear()}${
      today.getMonth() + 1
    }${getOrderNo}`;
    const updatedBody: Omit<
      IOrderApi<IFoodOrder[]>,
      'orderFinished' | 'orderCreatedDate'
    > = {
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
    userId,
    orderId,
  }: {
    userId: UserPayload['id'];
    orderId: number;
  }) {
    const orderItemsResults = await Orders.setOrderItems({
      userId,
      orderId,
    });
    if (!orderItemsResults.created)
      throw new BadRequestError('Order items not created');
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
    const orderItems = updateOrderDto.orderItems;
    await Orders.updateOrder(orderItems, orderId, userId);
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
    body: AwaitPaymentDto,
  ): Promise<IGetServerSideData<IPaymentDB>> {
    const { orderId, userId } = body;
    const orderData = await Orders.findOne({ orderId, userId });
    const { orderTotal } = orderData;
    const settingData = await Setting.findOne({ user: userId });
    const dataForPayment: IPaymentDB = Orders.buildDataForPayment(
      body,
      orderTotal,
      settingData.vat,
    );
    const paymentResult = await Payments.createOne(dataForPayment);
    if (paymentResult.created) {
      try {
        await Orders.validatePayment(orderId); // For now validate the order directly to avoid problems
        await Orders.setOrderItems({ orderId, userId });
        return {
          statusCode: HttpStatus.OK,
          results: dataForPayment,
          message: `Payment created from order ${orderId}`,
        };
      } catch (err) {
        throw new BadRequestException(err.message);
      }
    } else {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        results: dataForPayment,
        message: `Payment not created from order ${orderId}`,
      };
    }
  }
}
