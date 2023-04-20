import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import retry from 'async-retry';
import { FoodDeletedEvent } from '../../redifood-module/src/events/foods-event';
import {
  PhotoCreatedEvent,
  PhotoDeletedEvent,
  PhotoUpdatedEvent,
} from '../../redifood-module/src/events/picture/picture-class.event';
import {
  EGroupId,
  EStatusCodes,
  ETopics,
  IExtraApi,
  IFoodDB,
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
  constructor(
    @Inject(EGroupId.UPLOAD) private readonly uploadClient: ClientProxy,
    @Inject(EGroupId.ORDER) private readonly orderClient: ClientProxy,
  ) {}
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

  async createExtra(body: ExtraApiDto): Promise<IGetServerSideData<any>> {
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

  async createFood(body: FoodApiDto) {
    const updatedData = convertKeys(body, 'apiToDb');
    const postgresQuery = createQuery(updatedData, 'foods');
    const response = await Foods.createRows(postgresQuery);
    await this.handleCreatePicture({
      item_id: response.rows[0],
      photo_url: body.itemPhoto,
    });
    // await this.orderClient.emit(
    //   ETopics.FOOD_CREATED,
    //   new FoodCreatedEvent(body),
    // );
    if (!response) {
      throw new DatabaseError();
    }
    return {
      results: {},
      statusCode: EStatusCodes.CREATED,
      message: EFoodMessage.FOOD_CREATED,
    };
  }

  async updateFood(body: FoodApiDto, id: number) {
    const postgresQuery = updateQuery(convertKeys(body, 'apiToDb'), 'foods');
    console.log('postgresQuery', postgresQuery);
    const response = await Foods.updateRow(postgresQuery, id);
    await this.handleUpdatePicture({
      item_id: response.rows[0],
      photo_url: body.itemPhoto,
    });

    // await this.orderClient.emit(
    //   ETopics.FOOD_UPDATED,
    //   new FoodUpdatedEvent(body),
    // );
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
    await this.orderClient.emit(ETopics.FOOD_DELETED, new FoodDeletedEvent(id));
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
    await this.handleDeletePicture(id);
    if (!response) {
      throw new DatabaseError();
    }
    return {
      results: response,
      statusCode: EStatusCodes.SUCCESS,
      message: EFoodMessage.FOOD_DELETED,
    };
  }

  async handleCreatePicture(createPictureDto) {
    console.log('before sending...', createPictureDto);
    try {
      await retry(
        async () => {
          await this.uploadClient.emit(
            ETopics.PICTURE_CREATED,
            new PhotoCreatedEvent(
              createPictureDto.item_id,
              createPictureDto.photo_url,
            ),
          );
          console.log('sent');
        },
        {
          retries: 3,
          onRetry: (err: Error, attempt: number) => {
            Logger.error(
              `Error consuming message, executing retry ${attempt}/3`,
              err,
            );
          },
        },
      );
    } catch (err) {
      Logger.error(`Error consuming message, Adding to DQL...`, err);
      // Failed after 3 retries, add to DQL
    }
  }

  async handleUpdatePicture(updatePictureDto) {
    console.log('before sending...', updatePictureDto);
    try {
      await retry(
        async () => {
          await this.uploadClient.emit(
            ETopics.PICTURE_UPDATED,
            new PhotoUpdatedEvent(
              updatePictureDto.item_id,
              updatePictureDto.photo_url,
            ),
          );
          console.log('sent');
        },
        {
          retries: 3,
          onRetry: (err: Error, attempt: number) => {
            Logger.error(
              `Error consuming message, executing retry ${attempt}/3`,
              err,
            );
          },
        },
      );
    } catch (err) {
      Logger.error(`Error consuming message, Adding to DQL...`, err);
      // Failed after 3 retries, add to DQL
    }
  }

  async handleDeletePicture(foodId: IFoodDB['id']) {
    try {
      await retry(
        async () => {
          await this.uploadClient.emit(
            ETopics.PICTURE_DELETED,
            new PhotoDeletedEvent(foodId),
          );
          console.log('sent');
        },
        {
          retries: 3,
          onRetry: (err: Error, attempt: number) => {
            Logger.error(
              `Error consuming message, executing retry ${attempt}/3`,
              err,
            );
          },
        },
      );
    } catch (err) {
      Logger.error(`Error consuming message, Adding to DQL...`, err);
      // Failed after 3 retries, add to DQL
    }
  }
}
