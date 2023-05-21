import {
  IPaymentApi,
  IPaymentDB,
  UserPayload,
} from 'redifood-module/src/interfaces';
import { convertKeys } from 'src/foods/global.function';
import { pool } from '../../src/pool.pg';

class Payments {
  static async findAll(userId: UserPayload['id']) {
    const response = await pool.query(
      `SELECT * FROM payment WHERE user_id = $1`,
      [userId],
    );
    return response.rows;
  }

  static async findOne(id, userId): Promise<IPaymentApi> {
    const response: IPaymentDB = (
      await pool.query(`SELECT * FROM payment WHERE id = $1 AND user_id = $2`, [
        id,
        userId,
      ])
    ).rows[0];
    const apiResponse = convertKeys<IPaymentDB, IPaymentApi>(
      response,
      'dbToApi',
    );
    return apiResponse;
  }

  static async createOne(payment: IPaymentApi, userId: UserPayload['id']) {}

  static async updateOne(
    payment: Partial<IPaymentApi>,
    userId: UserPayload['id'],
  ) {}
}

export default Payments;
