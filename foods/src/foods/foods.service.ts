import { Injectable } from '@nestjs/common';
import {
  EStatusCodes,
  IFoodGetApi,
  IGetServerSideData,
} from 'redifood-module/src/interfaces';
import { ExtraApiDto, SectionApiDto } from 'src/foods.dto';
import { EFoodMessage } from 'src/foods.interface';
import Foods from 'src/foods.postgres';
import { createQuery } from 'src/global.function';

@Injectable()
export class FoodService {
  // Get foods/all
  async getAllFoods(): Promise<IGetServerSideData<IFoodGetApi[]>> {
    const foodResults = await Foods.findAll();
    if (!foodResults) {
      //empty
    }
    return {
      statusCode: EStatusCodes.SUCCESS,
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
      statusCode: EStatusCodes.SUCCESS,
      results: foodResults,
      message: EFoodMessage.FOOD_RECOVERED,
    };
  }

  // @Post('/section')
  async createSection(body: SectionApiDto): Promise<IGetServerSideData<any>> {
    const postgresQuery = createQuery(body, 'food_section');
    const response = await Foods.createRows(postgresQuery);
    if (!response) {
      //
    }
    return {
      results: response,
      statusCode: EStatusCodes.CREATED,
      message: EFoodMessage.SECTION_CREATED,
    };
  }

  async createExtra(body: ExtraApiDto): Promise<IGetServerSideData<any>> {
    const postgresQuery = createQuery(body, 'food_extra');
    const response = await Foods.createRows(postgresQuery);
    if (!response) {
      //
    }
    return {
      results: response,
      statusCode: EStatusCodes.CREATED,
      message: EFoodMessage.SECTION_CREATED,
    };
  }
}
