import StripeCharge from 'src/definitions/stripe-charge';
import { DatabaseError } from '../../redifood-module/src/handling-nestjs/database-error.exception';
import {
  IPaymentApi,
  IPaymentDB,
  UserPayload,
} from '../../redifood-module/src/interfaces';
import { convertKeys, createQuery } from '../../src/foods/global.function';
import { pool } from '../../src/pool.pg';

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

  static async findOne(
    id: number,
    userId: UserPayload['id'],
  ): Promise<IPaymentApi> {
    try {
      const response: IPaymentDB = (
        await pool.query(
          `SELECT * FROM payment WHERE id = $1 AND user_id = $2`,
          [id, userId],
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

  static async createOne(data: IPaymentApi): Promise<{ created: boolean }> {
    const postgresQuery = createQuery(data, 'payment');
    try {
      await pool.query(postgresQuery);
      return { created: true };
    } catch (err) {
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
      const stripe = new StripeCharge(chargeId);
      return await stripe.retrieveCharge();
    } catch (err) {
      throw new DatabaseError();
    }
  }
}

export default Payments;
