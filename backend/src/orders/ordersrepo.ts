import {
  IFoodGetApi,
  IFoodOrder,
  IOrderApi,
  IOrderDB,
  IOrderItemsApi,
  IOrderItemsDB,
  TOrderType,
  UserPayload,
} from 'redifood-module/src/interfaces';
import Foods from 'src/foods/foodsrepo';
import {
  convertKeys,
  createQuery,
  updateQuery,
} from 'src/foods/global.function';
import { DatabaseError } from '../../redifood-module/src/handling-nestjs/database-error.exception';
import { pool } from '../pool.pg';

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

  static async findTable(): Promise<number[]> {
    const response = (
      await pool.query(
        `SELECT order_table_number FROM orders WHERE order_status != 'completed' AND order_status != 'cancelled'`,
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
  ): Promise<IOrderApi[]> {
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
          ? 'order_status == "completed"'
          : orderType === 'NOT_PAID'
          ? 'order_status != "completed"'
          : '';

      const response = await pool.query(
        `SELECT * FROM orders WHERE ${orderClause} AND user_id = $1`,
        [userId],
      );

      if (!response) {
        throw new DatabaseError();
      }
      data = response.rows;
    }

    const updatedData: IOrderApi[] = data.map((item: IOrderDB) =>
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
  }): Promise<IOrderApi> {
    const orderDB: { rows: IOrderDB[] } = pool.query(
      `SELECT * FROM orders WHERE user_id = $1 AND id = $2`,
      [userId, orderId],
    );
    return convertKeys(orderDB.rows[0], 'dbToApi') as IOrderApi;
  }

  static async createOrder(
    body: Omit<IOrderApi, 'orderFinished' | 'orderCreatedDate'>,
  ) {
    // use createQuery function
    const response = await pool.query(
      `INSERT INTO orders (order_no, order_status, order_table_number, order_total, order_items, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        body.orderNo,
        `'${body.orderStatus}'`,
        body.orderTableNumber,
        body.orderTotal,
        JSON.stringify(body.orderItems),
        body.userId,
      ],
    );
    return response;
  }

  static async updateOrder(body: any, id: number) {
    const updatedQuery = updateQuery(body, 'order');
    const response = await pool.query(`${updatedQuery} WHERE id = $1`, [id]);
    return response;
  }

  static async cancelOrder(orderId: number) {
    const response = await pool.query(
      `UPDATE orders SET order_status = 'cancelled' WHERE id = $1`,
      [orderId],
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

  static async setOrderItems(idList: IMenuId, orderItems: string) {
    const { userId, orderId } = idList;
    const orderMenu: IFoodOrder[] = JSON.parse(orderItems);
    const foodList = await Foods.findAll(userId);
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
    const completedMenu: IOrderItemsDB[] = updatedMenu.map((item) => {
      return {
        order_id: orderId,
        user_id: userId,
        food_id: item.id,
        order_item_quantity: item.itemQuantity,
        order_item_price: item.itemPrice,
        order_item_name: item.itemName,
      };
    });

    const createdQuery = createQuery<IOrderItemsDB[]>(
      completedMenu,
      'order_items',
    );
    const response = await pool.query(createdQuery);
    return response;
  }
}

export default Orders;
