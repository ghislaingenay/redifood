import { Injectable } from '@nestjs/common';
import {
  EStatusCodes,
  IFoodGetApi,
  IGetServerSideData,
  ISectionFoodApi,
} from '../../redifood-module/src/interfaces';
import { ExtraApiDto, FoodApiDto, SectionApiDto } from '../foods.dto';
import { EFoodMessage } from '../foods.interface';
import Foods from '../foods.postgres';
import { convertKeys, createQuery, updateQuery } from '../global.function';
import { DatabaseError } from '../handling/database-error.exception';

@Injectable()
export class FoodService {
  // Get foods/all
  async getAllFoods(): Promise<IGetServerSideData<IFoodGetApi[]>> {
    const foodResults = await Foods.findAll();
    if (!foodResults) {
      throw new DatabaseError();
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
      throw new DatabaseError();
    }
    return {
      statusCode: EStatusCodes.SUCCESS,
      results: foodResults,
      message: EFoodMessage.FOOD_RECOVERED,
    };
  }

  // @Post('/section')
  async createSection(body: SectionApiDto): Promise<IGetServerSideData<any>> {
    const bodyWithOrder: ISectionFoodApi = {
      ...body,
      sectionOrder: (await Foods.countSection()) + 1,
    };

    const updatedData = convertKeys(bodyWithOrder, 'apiToDb');
    console.log('upf', updatedData);
    return { message: 'yes' };
    // const postgresQuery = createQuery(updatedData, 'food_section');
    // console.log(postgresQuery);
    // const response = await Foods.createRows(postgresQuery);
    // if (!response) {
    //   throw new DatabaseError();
    // }
    // return {
    //   results: response,
    //   statusCode: EStatusCodes.CREATED,
    //   message: EFoodMessage.SECTION_CREATED,
    // };
  }

  async createExtra(body: ExtraApiDto): Promise<IGetServerSideData<any>> {
    const updatedData = convertKeys(body, 'apiToDb');
    const postgresQuery = createQuery(updatedData, 'food_extra');
    const response = await Foods.createRows(postgresQuery);
    if (!response) {
      throw new DatabaseError();
    }
    return {
      results: response,
      statusCode: EStatusCodes.CREATED,
      message: EFoodMessage.EXTRA_CREATED,
    };
  }

  async createFood(body: FoodApiDto) {
    const updatedData = convertKeys(body, 'apiToDb');
    const postgresQuery = createQuery(updatedData, 'foods');
    const response = await Foods.createRows(postgresQuery);
    if (!response) {
      throw new DatabaseError();
    }
    return {
      results: response,
      statusCode: EStatusCodes.CREATED,
      message: EFoodMessage.FOOD_CREATED,
    };
  }

  async updateFood(body: FoodApiDto) {
    const postgresQuery = updateQuery(body, 'foods');
    const response = await Foods.updateRow(postgresQuery);
    if (!response) {
      throw new DatabaseError();
    }
    return {
      results: response,
      statusCode: EStatusCodes.SUCCESS,
      message: EFoodMessage.FOOD_UPDATED,
    };
  }

  async deleteExtra(id: number) {
    const response = await Foods.deleteExtra(id);
    if (!response) {
      throw new DatabaseError();
    }
    return {
      results: response,
      statusCode: EStatusCodes.SUCCESS,
      message: EFoodMessage.EXTRA_DELETED,
    };
  }

  async deleteSection(id: number) {
    const response = await Foods.deleteSection(id);
    if (!response) {
      throw new DatabaseError();
    }
    return {
      results: response,
      statusCode: EStatusCodes.SUCCESS,
      message: EFoodMessage.SECTION_DELETED,
    };
  }

  async deleteFood(id: number) {
    const response = await Foods.deleteFood(id);
    if (!response) {
      throw new DatabaseError();
    }
    return {
      results: response,
      statusCode: EStatusCodes.SUCCESS,
      message: EFoodMessage.FOOD_DELETED,
    };
  }
}
