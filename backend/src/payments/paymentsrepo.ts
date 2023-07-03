import StripePayService from 'src/definitions/stripe-service';
import {
  IPaymentApi,
  IPaymentDB,
  UserPayload,
} from '../../redifood-module/src/interfaces';
import { convertKeys, createQuery } from '../../src/foods/global.function';
import { pool } from '../../src/pool.pg';
import { DatabaseError } from 'src/others/database-error.exception';

class Payments {
  static async findAllByUser(
    userId: UserPayload['id'],
  ): Promise<IPaymentApi[]> {
    try {
      const response = await pool.query(
        `SELECT * FROM payment WHERE user_id = $1`,
        [userId],
      );
      const res: IPaymentDB[] = response.rows;
      const apiResponse = res.map((item: IPaymentDB) => {
        return convertKeys<IPaymentDB, IPaymentApi>(item, 'dbToApi');
      });
      return apiResponse;
    } catch (err) {
      throw new DatabaseError();
    }
  }

  static async findByOrderId(
    orderId: IPaymentApi['orderId'] | IPaymentDB['order_id'],
    userId: UserPayload['id'],
  ): Promise<IPaymentApi> {
    try {
      const response: IPaymentDB = (
        await pool.query(
          `SELECT * FROM payment WHERE order_id = $1 AND user_id = $2`,
          [orderId, userId],
        )
      ).rows[0];
      const apiResponse = convertKeys<IPaymentDB, IPaymentApi>(
        response,
        'dbToApi',
      );
      return apiResponse;
    } catch (err) {
      throw new DatabaseError();
    }
  }

  static async findOne(
    paymentId: number,
    userId: UserPayload['id'],
  ): Promise<IPaymentApi> {
    try {
      const response: IPaymentDB = (
        await pool.query(
          `SELECT * FROM payment WHERE id = $1 AND user_id = $2`,
          [paymentId, userId],
        )
      ).rows[0];
      const apiResponse = convertKeys<IPaymentDB, IPaymentApi>(
        response,
        'dbToApi',
      );
      return apiResponse;
    } catch (err) {
      throw new DatabaseError();
    }
  }

  static async createOne(data: IPaymentDB): Promise<{ created: boolean }> {
    const postgresQuery = createQuery(data, 'payment');
    console.log(postgresQuery);
    try {
      await pool.query(postgresQuery);
      return { created: true };
    } catch (err) {
      console.log(err);
      throw new DatabaseError();
    }
  }

  static async updateOne(
    payment: Partial<IPaymentApi>,
    userId: UserPayload['id'],
  ): Promise<{ updated: boolean }> {
    try {
      const updatedQuery = createQuery(payment, 'payment');
      await pool.query(`${updatedQuery} WHERE id = $1 AND user_id = $2`, [
        payment.id,
        userId,
      ]);
      return { updated: true };
    } catch (err) {
      throw new DatabaseError();
    }
  }

  static async getChargeByStripeId(
    chargeId: IPaymentApi['paymentStripeId'] | IPaymentDB['payment_stripe_id'],
  ) {
    try {
      return await StripePayService.retrieveCharge(chargeId);
    } catch (err) {
      throw new DatabaseError();
    }
  }

  static async cancelPayment(
    orderId: IPaymentApi['orderId'],
    userId: UserPayload['id'],
  ) {
    try {
      await pool.query(
        `UPDATE payment SET payment_status = 'cancelled' WHERE order_id = $1 AND user_id = $2`,
        [orderId, userId],
      );
      return { message: 'Payment cancelled' };
    } catch (err) {
      throw new DatabaseError();
    }
  }
}

export default Payments;
