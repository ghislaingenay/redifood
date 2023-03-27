import { IFoodGetApi } from 'redifood-module/src/interfaces';
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
        id: food.item_extra,
        extraName: food.extra_name,
      },
      itemSection: {
        id: food.item_section,
        sectionName: food.section_name,
      },
    };
  };

  private static find_foods_query = `SELECT * FROM foods INNER JOIN section_food ON food_section.id = foods.item_section INNER JOIN food_extra ON foods.item_extra = food_extra.id`;
  static async findAll(): Promise<IFoodGetApi[]> {
    const response = await pool.query(this.find_foods_query);

    // if (!response) {
    //   throw new DatabaseError();
    // }

    const updatedResponse: IFoodGetApi[] = response.map((item: any) => {
      return this.convertFoodResponseToFoodGet(item);
    });
    return updatedResponse;
  }

  static async findBySectionId(id: number): Promise<IFoodGetApi[]> {
    const response = await pool.query(
      `${this.find_foods_query} WHERE item_section = $1`,
      [id],
    );
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
      await pool.query(`DELETE FROM food_extra WHERE id = $1`, [id]);
      await pool.query(
        `UPDATE foods SET item_extra = null WHERE item_extra = $1`,
        [id],
      );
      return { deleted: true };
    } catch (error) {
      throw new DatabaseError();
    }
  }

  static async deleteSection(id: number) {
    try {
      await pool.query(`DELETE FROM food_section WHERE id = $1`, [id]);
      await pool.query(`DELETE FROM foods WHERE item_section = $1`, [id]);
      await pool.query(`DELETE FROM food_extra WHERE section_id = $1`, [id]);
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
    const res = pool.query(`SELECT COUNT(*) FROM food_section`);
    console.log('res count', res, 'res');
    if (!res) throw new DatabaseError();
    return res;
  }
  static async countExtra(): Promise<number> {
    const res = pool.query(`SELECT COUNT(*) FROM food_extra`);
    if (!res) throw new DatabaseError();
    return res;
  }
  static async countFoods(): Promise<number> {
    const res = pool.query(`SELECT COUNT(*) FROM foods`);
    if (!res) throw new DatabaseError();
    return res;
  }
  // static getSectionAndExtraList() {}
}

export default Foods;
