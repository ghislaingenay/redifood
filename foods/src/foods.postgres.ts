import { IFoodGetApi } from 'redifood-module/src/interfaces';
import { pool } from './pool.pg';

class Foods {
  static async findAll(): Promise<IFoodGetApi[]> {
    const response = pool.query(
      `SELECT * FROM foods INNER JOIN section_food ON food_section.id = foods.item_section INNER JOIN food_extra ON foods.item_extra = food_extra.id`,
    );

    const updatedResponse = response.map((item: any) => {
      return {
        id: item.id,
        itemName: item.item_name,
        itemPhoto: item.item_photo,
        itemDescription: item.item_description,
        itemPrice: item.item_price,
        itemQuantity: 0,
        itemExtra: {
          id: item.item_extra,
          extraName: item.extra_name,
        },
        itemSection: {
          id: item.item_section,
          sectionName: item.section_name,
        },
      } as IFoodGetApi;
    });
    return updatedResponse;
  }

  static findBySectionId() {
    // id: number
    // empty
  }

  static getSectionList() {
    //empty
  }

  static getSectionAndExtraList() {}
}

export default Foods;
