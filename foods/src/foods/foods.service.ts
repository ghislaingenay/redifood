import { Injectable } from '@nestjs/common';
import {
  IFoodGetApi,
  IGetServerSideData,
} from 'redifood-module/src/interfaces';
import { EFoodMessage } from 'src/foods.interface';
import Foods from 'src/foods.postgres';

@Injectable()
export class FoodService {
  // Get foods/all
  async getAllFoods(): Promise<IGetServerSideData<IFoodGetApi[]>> {
    const foodResults = await Foods.findAll();
    if (!foodResults) {
      //empty
    }
    return {
      statusCode: 200,
      results: foodResults,
      message: EFoodMessage.FOOD_RECOVERED,
    };
  }

  // @Get('section/:id')
  async getFoodBySectionId(
    id: number,
  ): Promise<IGetServerSideData<IFoodGetApi[]>> {
    const foodResults = await Foods.findBySectionId(id);
    if (!foodResults) {
      //empty
    }
    return {
      statusCode: 200,
      results: foodResults,
      message: EFoodMessage.FOOD_RECOVERED,
    };
  }
}
