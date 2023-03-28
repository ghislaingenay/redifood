import {
  IExtraApi,
  IFoodGetApi,
  ISectionFoodApi,
} from 'redifood-module/src/interfaces';
import { convertKeys } from './global.function';
import { DatabaseError } from './handling/database-error.exception';
import { pool } from './pool.pg';

class Foods {
  private static convertFoodResponseToFoodGet = (food: any): IFoodGetApi => {
    return {
      id: food.id,
      itemName: food.item_name,
      itemPhoto: food.item_photo,
      itemDescription: food.item_description,
      itemPrice: food.item_price,
      itemQuantity: 0,
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

  private static find_foods_query = `SELECT * FROM foods as f INNER JOIN food_section ON food_section.id = f.section_id INNER JOIN food_extra ON f.extra_id = food_extra.id`;
  static async findAll(): Promise<IFoodGetApi[]> {
    const response = (await pool.query(this.find_foods_query)).rows;

    if (!response) {
      throw new DatabaseError();
    }

    const updatedResponse: IFoodGetApi[] = response.map((item: any) => {
      return this.convertFoodResponseToFoodGet(item);
    });
    return updatedResponse;
  }

  static async findBySectionId(id: number): Promise<IFoodGetApi[]> {
    const response = (
      await pool.query(`${this.find_foods_query} WHERE f.section_id = $1`, [id])
    ).rows;
    const updatedResponse = response.map((item: any) => {
      return this.convertFoodResponseToFoodGet(item);
    });
    return updatedResponse;
  }

  static async createRows(queryString: string): Promise<any> {
    const query = await pool.query(queryString);
    console.log('res', query);
    return query;
  }

  static async updateRow(queryString: string): Promise<any> {
    const query = await pool.query(queryString);
    console.log('res', query);
    return query;
  }

  static async getSectionList() {
    const response = await pool.query(
      `SELECT * FROM food_extra INNER JOIN food_section ON food_section.id = food.extra.section_id`,
    );
    return response;
  }

  static async deleteExtra(id: number) {
    try {
      await pool.query(`DELETE FROM foods WHERE extra_id = $1`, [id]);
      await pool.query(`DELETE FROM food_extra WHERE id = $1`, [id]);
      return { deleted: true };
    } catch (error) {
      throw new DatabaseError();
    }
  }

  static async deleteSection(id: number) {
    try {
      await pool.query(`DELETE FROM foods WHERE section_id = $1`, [id]);
      await pool.query(`DELETE FROM food_extra WHERE section_id = $1`, [id]);
      await pool.query(`DELETE FROM food_section WHERE id = $1`, [id]);
      return { deleted: true };
    } catch (err) {
      throw new DatabaseError();
    }
  }

  static async deleteFood(id: number) {
    try {
      await pool.query(`DELETE FROM foods WHERE id = $1`, [id]);
      return { deleted: true };
    } catch (err) {
      throw new DatabaseError();
    }
  }

  static async countSection(): Promise<number> {
    const count = (await pool.query(`SELECT COUNT(*) FROM food_section`))
      .rows[0].count;

    if (!count) throw new DatabaseError();
    return count;
  }
  static async countExtra(): Promise<number> {
    const res = (await pool.query(`SELECT COUNT(*) FROM food_extra`)).rows[0]
      .count;
    if (!res) throw new DatabaseError();
    return res;
  }
  static async countFoods(): Promise<number> {
    const res = (await pool.query(`SELECT COUNT(*) FROM foods`)).rows[0].count;
    if (!res) throw new DatabaseError();
    return res;
  }
  // static getSectionAndExtraList() {}
  static async getAllSectionName(): Promise<
    Pick<ISectionFoodApi, 'sectionName'>[]
  > {
    const response = await pool.query(`SELECT * FROM food_section`);
    const updatedResponseDB = response.map((item: any) => item.section_name);
    const updatedResponseApi = updatedResponseDB.map((item: any) =>
      convertKeys(item, 'dbToApi'),
    );
    return updatedResponseApi;
  }
  static async getAllExtraName(): Promise<Pick<IExtraApi, 'extraName'>[]> {
    const response = await pool.query(`SELECT * FROM food_extra`);
    const updatedResponseDB = response.map((item: any) => item.extra_name);
    const updatedResponseApi = updatedResponseDB.map((item: any) =>
      convertKeys(item, 'dbToApi'),
    );
    return updatedResponseApi;
  }
}

export default Foods;
