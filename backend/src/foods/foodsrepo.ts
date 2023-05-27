import { DatabaseError } from '../../redifood-module/src/handling-nestjs/database-error.exception';
import {
  IExtraApi,
  IFoodGetApi,
  ISectionFoodApi,
  UserPayload,
} from '../../redifood-module/src/interfaces';
import { pool } from '../../src/pool.pg';
import { convertKeys } from './global.function';

class Foods {
  private static formatFood = (food: any): IFoodGetApi => {
    return {
      id: food.id,
      itemName: food.item_name,
      itemPhoto: food.item_photo,
      itemDescription: food.item_description,
      itemPrice: food.item_price,
      itemQuantity: 0,
      userId: food.user_id,
      itemExtra: {
        id: food.extra_id,
        extraName: food.extra_name,
      },
      itemSection: {
        id: food.section_id,
        sectionName: food.section_name,
      },
    };
  };

  private static find_foods_query = `SELECT * FROM food as f INNER JOIN food_section fs on fs.id = f.section_id INNER JOIN food_extra fe ON f.extra_id = fe.id`;
  static async findAll(userId: UserPayload['id']): Promise<IFoodGetApi[]> {
    const response = (
      await pool.query(`${this.find_foods_query} WHERE f.user_id = $1`, [
        userId,
      ])
    ).rows;

    if (!response) {
      throw new DatabaseError();
    }

    const updatedResponse: IFoodGetApi[] = response.map((item: any) => {
      return this.formatFood(item);
    });
    return updatedResponse;
  }

  static async findBySectionId(
    id: number,
    userId: UserPayload['id'],
  ): Promise<IFoodGetApi[]> {
    const response = (
      await pool.query(
        `${this.find_foods_query} WHERE f.section_id = $1 AND f.user_id = $2`,
        [id, userId],
      )
    ).rows;
    const updatedResponse = response.map((item: any) => {
      return this.formatFood(item);
    });
    return updatedResponse;
  }

  static async createRows(queryString: string): Promise<any> {
    const query = await pool.query(queryString);
    return query;
  }

  static async updateRow(queryString: string, id: number): Promise<any> {
    const query = await pool.query(`${queryString} WHERE id = $1`, [id]);
    return query;
  }

  static async getSectionList(userId: UserPayload['id']) {
    const response = await pool.query(
      `SELECT * FROM fe INNER JOIN food_section ON food_section.id = fe.section_id AND fe.user_id = $1`,
      [userId],
    );
    return response;
  }

  static async deleteExtra(id: number) {
    try {
      await pool.query(`DELETE FROM food WHERE extra_id = $1`, [id]);
      await pool.query(`DELETE FROM food_extra WHERE id = $1`, [id]);
      return { deleted: true };
    } catch (error) {
      throw new DatabaseError();
    }
  }

  static async deleteSection(id: number) {
    try {
      await pool.query(`DELETE FROM food WHERE section_id = $1`, [id]);
      await pool.query(`DELETE FROM food_extra WHERE section_id = $1`, [id]);
      await pool.query(`DELETE FROM food_section WHERE id = $1`, [id]);
      return { deleted: true };
    } catch (err) {
      throw new DatabaseError();
    }
  }

  static async deleteFood(id: number) {
    try {
      await pool.query(`DELETE FROM food WHERE id = $1`, [id]);
      return { deleted: true };
    } catch (err) {
      throw new DatabaseError();
    }
  }

  static async countSection(userId: UserPayload['id']): Promise<number> {
    const count = (
      await pool.query(`SELECT COUNT(*) FROM food_section WHERE user_id = $1`, [
        userId,
      ])
    ).rows[0].count;

    if (!count) throw new DatabaseError();
    return Number(count);
  }
  static async countExtra(userId: UserPayload['id']): Promise<number> {
    const res = (
      await pool.query(`SELECT COUNT(*) FROM food_extra WHERE user_id = $1`, [
        userId,
      ])
    ).rows[0].count;
    if (!res) throw new DatabaseError();
    return Number(res);
  }
  static async countFoods(userId: UserPayload['id']): Promise<number> {
    const res = (
      await pool.query(`SELECT COUNT(*) FROM food WHERE user_id = $1`, [userId])
    ).rows[0].count;
    if (!res) throw new DatabaseError();
    return Number(res);
  }
  // static getSectionAndExtraList() {}
  static async getAllSectionName(
    userId: UserPayload['id'],
  ): Promise<Pick<ISectionFoodApi, 'sectionName'>[]> {
    const response = await pool.query(
      `SELECT * FROM food_section  WHERE user_id = $1`,
      [userId],
    );
    const updatedResponseDB = response.map((item: any) => item.section_name);
    const updatedResponseApi = updatedResponseDB.map((item: any) =>
      convertKeys(item, 'dbToApi'),
    );
    return updatedResponseApi;
  }
  static async getAllExtraName(
    userId: UserPayload['id'],
  ): Promise<Pick<IExtraApi, 'extraName'>[]> {
    const response = await pool.query(
      `SELECT * FROM food_extra  WHERE user_id = $1`,
      [userId],
    );
    const updatedResponseDB = response.map((item: any) => item.extra_name);
    const updatedResponseApi = updatedResponseDB.map((item: any) =>
      convertKeys(item, 'dbToApi'),
    );
    return updatedResponseApi;
  }
}

export default Foods;
