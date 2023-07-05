import { BadRequestException } from '@nestjs/common';
import * as moment from 'moment';
import { roundTwoDecimals } from 'redifood-module/src/global.functions';
import {
  EPaymentStatus,
  IFoodApi,
  IFoodGetApi,
  IFoodOrder,
  IOrderApi,
  IOrderDB,
  IOrderItemsApi,
  IOrderItemsDB,
  IPagination,
  IPaymentDB,
  TGetHistoryParams,
  TOrderType,
  UserPayload,
} from 'redifood-module/src/interfaces';
import Foods from 'src/foods/foodsrepo';
import {
  convertKeys,
  createQuery,
  updateQuery,
} from 'src/foods/global.function';
import { DatabaseError } from 'src/global/database-error.exception';
import { pool } from '../pool.pg';
import { AwaitPaymentDto } from './orders.dto';
interface IMenuId {
  orderId: number;
  userId: string;
}

class Orders {
  static countOrders = async (): Promise<number> => {
    const response = await pool.query(`SELECT COUNT(*) FROM orders`);
    return response.rows[0].count;
  };

  static async findOrderItems(orderId: number): Promise<IOrderItemsApi[]> {
    const response = await pool.query(
      `SELECT * FROM order_items WHERE order_id = $1`,
      [orderId],
    );
    if (!response) {
      throw new DatabaseError();
    }
    const updatedResponse: IOrderItemsApi[] = (
      response.rows as IOrderItemsDB[]
    ).map((item: IOrderItemsDB) => {
      return convertKeys<IOrderItemsDB, IOrderItemsApi>(item, 'dbToApi');
    });
    return updatedResponse;
  }

  static async findTable(userId: UserPayload['id']): Promise<number[]> {
    const response = (
      await pool.query(
        `SELECT order_table_number FROM orders WHERE order_status != 'finished' AND order_status != 'cancelled' AND user_id = $1`,
        [userId],
      )
    ).rows;
    if (!response) {
      throw new DatabaseError();
    }
    const updatedResponse: number[] = response.map(
      ({ order_table_number }: { order_table_number: number }) => {
        return order_table_number;
      },
    );
    return updatedResponse;
  }

  static async findAll(
    orderType: TOrderType,
    userId: UserPayload['id'],
  ): Promise<IOrderApi<string>[]> {
    let data: IOrderDB[] = [];
    if (orderType === 'ALL') {
      const response = await pool.query(
        `SELECT * FROM orders WHERE user_id = $1`,
        [userId],
      );
      if (!response) {
        throw new DatabaseError();
      }
      data = response.rows;
    } else {
      const orderClause =
        orderType === 'PAID'
          ? `order_status = 'finished'`
          : orderType === 'NOT_PAID'
          ? `order_status != 'finished' AND order_status != 'cancelled'`
          : '';

      const response = await pool.query(
        `SELECT * FROM orders o WHERE ${orderClause} AND user_id = $1`,
        [userId],
      );

      if (!response) {
        throw new DatabaseError();
      }
      data = response.rows;
    }

    const updatedData: IOrderApi<string>[] = data.map((item: IOrderDB) =>
      convertKeys(item, 'dbToApi'),
    );
    return updatedData;
  }

  static async findOne({
    userId,
    orderId,
  }: {
    userId: UserPayload['id'];
    orderId: number;
  }): Promise<IOrderApi<string>> {
    const orderDB: { rows: IOrderDB[] } = await pool.query(
      `SELECT * FROM orders WHERE user_id = $1 AND id = $2`,
      [userId, orderId],
    );
    if (!orderDB.rows[0]) throw new BadRequestException('Order not found');
    return convertKeys(orderDB.rows[0], 'dbToApi') as IOrderApi<string>;
  }

  static async createOrder(
    body: Omit<IOrderApi<IFoodOrder[]>, 'orderFinished' | 'orderCreatedDate'>,
  ) {
    // use createQuery function
    const response = await pool.query(
      `INSERT INTO orders (order_no, order_status, order_table_number, order_total, order_items, user_id) VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        body.orderNo,
        body.orderStatus,
        body.orderTableNumber,
        Number(body.orderTotal),
        JSON.stringify(body.orderItems),
        body.userId,
      ],
    );
    return response;
  }

  static async updateOrder(
    orderItems: IFoodOrder[],
    orderId: number,
    userId: UserPayload['id'],
  ) {
    const totalPrice = await Orders.calculateAmountFromMenu(orderItems, userId);
    const updatedDataApi: Partial<IOrderApi<string>> = {
      orderItems: JSON.stringify(orderItems),
      orderTotal: totalPrice,
    };
    const updatedDataDB = convertKeys<Partial<IOrderApi>, Partial<IOrderDB>>(
      updatedDataApi,
      'apiToDb',
    );
    const updatedQuery = updateQuery(updatedDataDB, 'orders');
    const response = await pool.query(`${updatedQuery} WHERE id = $1`, [
      orderId,
    ]);
    return response;
  }

  static async cancelOrder(orderId: number, userId: UserPayload['id']) {
    const response = await pool.query(
      `UPDATE orders SET order_status = 'cancelled' WHERE id = $1 AND user_id = $2`,
      [orderId, userId],
    );
    return response;
  }

  static async awaitPayment(orderId: number) {
    const response = await pool.query(
      `UPDATE orders SET order_status = 'awaiting payment' WHERE id = $1`,
      [orderId],
    );
    return response;
  }

  static async validatePayment(orderId: number): Promise<{ updated: boolean }> {
    try {
      await pool.query(
        `UPDATE orders SET order_status = 'finished' WHERE id = $1`,
        [orderId],
      );
      return { updated: true };
    } catch (err) {
      throw new BadRequestException('Not update');
    }
  }

  static async setOrderItems(idList: IMenuId): Promise<{ created: boolean }> {
    try {
      const { userId, orderId } = idList;
      const { orderItems } = await Orders.findOne(idList);
      console.log('orderItems', orderItems);
      const orderMenu: IFoodOrder[] = JSON.parse(orderItems);
      const foodList = await Foods.findAllFormatted(userId);
      const updatedMenu: IFoodGetApi[] = foodList.map((item: IFoodGetApi) => {
        const foundItem = orderMenu.find(
          (orderItem: IFoodOrder) => orderItem.id === item.id,
        );
        if (foundItem) {
          return {
            ...item,
            itemQuantity: foundItem.itemQuantity,
          };
        }
        return item;
      });
      const completedMenu: IOrderItemsDB[] = updatedMenu
        .map((item) => {
          return {
            order_id: orderId,
            user_id: userId,
            food_id: item.id,
            order_item_quantity: item.itemQuantity,
            order_item_price: Number(item.itemPrice),
            order_item_name: item.itemName,
          };
        })
        .filter((item) => item.order_item_quantity > 0);
      const createdQuery = createQuery<IOrderItemsDB[]>(
        completedMenu,
        'order_items',
      );
      await pool.query(createdQuery);
      return { created: true };
    } catch (err) {
      return { created: false };
    }
  }

  static async calculateAmountFromMenu(
    orderItems: IFoodOrder[],
    userId: UserPayload['id'],
  ): Promise<number> {
    const foodList = await Foods.findAllFoods(userId);
    const updatedMenu: IFoodApi[] = foodList.map((item) => {
      const foundItem = [...orderItems].find(
        (orderItem: IFoodOrder) => orderItem.id === item.id,
      );
      if (foundItem) {
        return {
          ...item,
          itemQuantity: foundItem.itemQuantity,
        };
      }
      return item;
    });
    const filteredMenu = updatedMenu.filter((item) => item.itemQuantity > 0);
    return filteredMenu.reduce((acc, item) => {
      return acc + item.itemPrice * item.itemQuantity;
    }, 0);
  }

  static getFoodIdArrayFromOrderItems(orderItems: IFoodOrder[]) {
    return orderItems.map((item) => item.id);
  }

  static addFoodQuantityToOrderItems(
    foodList: Omit<IFoodGetApi[], 'itemQuantity'>,
    orderItems: IFoodOrder[],
  ): IFoodGetApi[] {
    return [...foodList].map((item) => {
      const foundItem = orderItems.find(
        (orderItem) => orderItem.id === item.id,
      );
      if (foundItem) {
        return {
          ...item,
          itemQuantity: foundItem.itemQuantity,
        };
      }
      return item;
    });
  }

  static createHistorySqlQuery(
    params: TGetHistoryParams,
    userId: UserPayload['id'],
  ): string {
    const { startDate, endDate } = params;
    const queryConditions = [`ord.user_id = '${userId}'`];
    if (startDate) {
      queryConditions.push(
        `ord.order_date >= '${moment(startDate).format('YYYY-MM-DD')}'`,
      );
    } // need to finish this
    if (endDate) {
      queryConditions.push(
        `ord.order_date <= '${moment(endDate).format('YYYY-MM-DD')}'`,
      );
    }
    const joinedQueryConditions = queryConditions.join(' AND ');
    return joinedQueryConditions;
  }

  static async getPaidOrdersFromHistoryParams(
    params: TGetHistoryParams,
    userId: UserPayload['id'],
  ): Promise<IOrderApi<string>[]> {
    const { results } = params;
    const page = Number(params.page || 1);
    const offset = (page - 1) * Number(results);
    const sqlConditions = Orders.createHistorySqlQuery(params, userId);
    const response: IOrderDB[] = (
      await pool.query(
        `SELECT * FROM (SELECT *, TO_CHAR(order_finished, 'YYYY-MM-DD') AS order_date FROM orders) AS ord WHERE ${sqlConditions} AND ord.order_status = 'finished' ORDER BY ord.order_finished DESC LIMIT ${results} OFFSET ${offset}`,
      )
    ).rows;
    if (!response) throw new BadRequestException('No orders found');
    const updatedResponse: IOrderApi<string>[] = response.map((item) =>
      convertKeys(item, 'dbToApi'),
    );
    return updatedResponse;
  }

  static async getPaginationOrdersHistory(
    params: TGetHistoryParams,
    userId: UserPayload['id'],
  ): Promise<IPagination> {
    const { results, page } = params;
    const sqlConditions = Orders.createHistorySqlQuery(params, userId);
    const response = await pool.query(
      `SELECT id FROM (SELECT *, TO_CHAR(order_finished, 'YYYY-MM-DD') AS order_date FROM orders) AS ord WHERE ${sqlConditions} AND ord.order_status = 'finished'`,
    );
    const count = response.rowCount;
    if (!response) throw new BadRequestException('No count recovered');
    const pages = Math.ceil(count / Number(results));
    return {
      page: Number(page),
      results: Number(results),
      pages,
      total: count,
    };
  }

  static buildDataForPayment(
    body: AwaitPaymentDto,
    orderTotal: number,
    vat: number,
  ): IPaymentDB {
    const { orderId, userId, paymentType } = body;
    return {
      user_id: userId,
      order_id: orderId,
      payment_stripe_id: '',
      payment_status: EPaymentStatus.COMPLETED, //EPaymentStatus.AWAITING ffdd
      payment_type: paymentType,
      payment_amount: orderTotal,
      payment_date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      payment_discount_applied: false,
      payment_discount_id: 0,
      payment_tax_amount: roundTwoDecimals(orderTotal * (vat / 100)),
    };
  }
}

export default Orders;
