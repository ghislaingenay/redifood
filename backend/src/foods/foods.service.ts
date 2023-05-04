import { Injectable } from '@nestjs/common';
import { DatabaseError } from '../../redifood-module/src/handling-nestjs/database-error.exception';
import {
  EStatusCodes,
  IExtraApi,
  IFoodGetApi,
  IGetServerSideData,
  ISectionFoodApi,
} from '../../redifood-module/src/interfaces';
import {
  CreateExtraDto,
  CreateFoodDto,
  CreateSectionDto,
  UpdateFoodDto,
} from './foods.dto';
import { EFoodMessage } from './foods.interface';
import Foods from './foodsrepo';
import { convertKeys, createQuery, updateQuery } from './global.function';

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
  async createSection(
    body: CreateSectionDto,
  ): Promise<IGetServerSideData<any>> {
    const bodyWithOrder: ISectionFoodApi = {
      ...body,
      sectionOrder: Number(await Foods.countSection()) + 1,
    };
    const updatedData = convertKeys(bodyWithOrder, 'apiToDb');
    const postgresQuery = createQuery(updatedData, 'food_section');
    const response = await Foods.createRows(postgresQuery);
    if (!response) {
      throw new DatabaseError();
    }
    return {
      results: {},
      statusCode: EStatusCodes.CREATED,
      message: EFoodMessage.SECTION_CREATED,
    };
  }

  async createExtra(body: CreateExtraDto): Promise<IGetServerSideData<any>> {
    const bodyWithOrder: IExtraApi = {
      ...body,
      extraOrder: Number(await Foods.countExtra()) + 1,
    };
    const updatedData = convertKeys(bodyWithOrder, 'apiToDb');
    console.log('updatedData', updatedData);
    const postgresQuery = createQuery(updatedData, 'food_extra');
    const response = await Foods.createRows(postgresQuery);
    if (!response) {
      throw new DatabaseError();
    }
    return {
      results: {},
      statusCode: EStatusCodes.CREATED,
      message: EFoodMessage.EXTRA_CREATED,
    };
  }

  async createFood(body: CreateFoodDto) {
    const updatedData = convertKeys(body, 'apiToDb');
    const postgresQuery = createQuery(updatedData, 'foods');
    const response = await Foods.createRows(postgresQuery);
    // await this.handleCreatePicture({
    //   item_id: response.rows[0],
    //   photo_url: body.itemPhoto,
    // });

    if (!response) {
      throw new DatabaseError();
    }
    return {
      results: {},
      statusCode: EStatusCodes.CREATED,
      message: EFoodMessage.FOOD_CREATED,
    };
  }

  async updateFood(body: UpdateFoodDto, id: number) {
    const postgresQuery = updateQuery(convertKeys(body, 'apiToDb'), 'foods');
    console.log('postgresQuery', postgresQuery);
    const response = await Foods.updateRow(postgresQuery, id);
    // await this.handleUpdatePicture({
    //   item_id: response.rows[0],
    //   photo_url: body.itemPhoto,
    // });

    if (!response) {
      throw new DatabaseError();
    }
    return {
      results: {},
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
      results: {},
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

  async handleCreatePicture(
    base64: CreateFoodDto['base64Img'] | UpdateFoodDto['base64Img'],
  ) {
    console.log('base64', base64);
  }
}
