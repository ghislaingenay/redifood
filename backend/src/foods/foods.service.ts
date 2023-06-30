import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { DatabaseError } from '../../redifood-module/src/handling-nestjs/database-error.exception';
import {
  EStatusCodes,
  IExtraApi,
  IExtraDB,
  IFoodGetApi,
  IFoodSectionList,
  IGetSectionInfo,
  IGetServerSideData,
  ISectionFoodApi,
  UserPayload,
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
  async getAllFoods(userId: UserPayload['id']): Promise<
    IGetServerSideData<{
      foodResults: IFoodGetApi[];
      sectionList: IFoodSectionList[];
    }>
  > {
    const foodResults = await Foods.findAllFormatted(userId);
    if (!foodResults) {
      throw new DatabaseError();
    }
    const sectionList = await Foods.getSectionList(userId);
    return {
      statusCode: EStatusCodes.SUCCESS,
      results: { foodResults, sectionList },
      message: EFoodMessage.FOOD_RECOVERED,
    };
  }

  // @Get('section/:id')
  async getFoodBySectionId(
    id: number,
    userId: UserPayload['id'],
  ): Promise<IGetServerSideData<IFoodGetApi[]>> {
    const foodResults = await Foods.findBySectionId(id, userId);
    if (!foodResults) {
      throw new DatabaseError();
    }
    return {
      statusCode: EStatusCodes.SUCCESS,
      results: foodResults,
      message: EFoodMessage.FOOD_RECOVERED,
    };
  }

  async getSectionInfo(
    userId: UserPayload['id'],
  ): Promise<IGetServerSideData<IGetSectionInfo>> {
    try {
      const res = await Foods.getAllInformationBySection(userId);
      return {
        statusCode: HttpStatus.OK,
        results: res,
        message: EFoodMessage.FOOD_RECOVERED,
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async createSection(
    body: CreateSectionDto,
    userId: UserPayload['id'],
  ): Promise<IGetServerSideData<any>> {
    const bodyWithOrder: ISectionFoodApi = {
      userId: userId,
      ...body,
      sectionOrder: Number(await Foods.countSection(userId)) + 1,
    };
    const updatedData = convertKeys(bodyWithOrder, 'apiToDb');
    const postgresQuery = createQuery(updatedData, 'food_section');
    const response = await Foods.createRows(postgresQuery);
    if (!response) {
      throw new DatabaseError();
    }
    return {
      results: {},
      statusCode: HttpStatus.CREATED,
      message: `Section: ${body.sectionName} was created successfully`,
    };
  }

  async createExtra(
    body: CreateExtraDto,
    userId: UserPayload['id'],
  ): Promise<IGetServerSideData<IExtraApi | null>> {
    const bodyWithOrder: IExtraApi = {
      userId: userId,
      ...body,
      extraOrder: Number(await Foods.countExtra(userId)) + 1,
    };
    const updatedData: IExtraDB = convertKeys<IExtraApi, IExtraDB>(
      bodyWithOrder,
      'apiToDb',
    );
    const postgresQuery = createQuery(updatedData, 'food_extra');
    try {
      const response = await Foods.createRows(postgresQuery);
      if (!response) {
        throw new DatabaseError();
      }
      return {
        results: bodyWithOrder,
        statusCode: HttpStatus.CREATED,
        message: `Section: ${body.extraName} was created successfully for section #${body.sectionId}`,
      };
    } catch (err) {
      return {
        results: null,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Impossible to create ${body.extraName}. Please verify the extra name is already allocated and try again`,
      };
    }
  }

  async createFood(body: CreateFoodDto, userId: UserPayload['id']) {
    const updatedBody = { ...body, userId };
    const updatedData = convertKeys(updatedBody, 'apiToDb');
    const postgresQuery = createQuery(updatedData, 'food');
    try {
      const response = await Foods.createRows(postgresQuery);
      if (!response) {
        throw new DatabaseError();
      }
      return {
        results: {},
        statusCode: HttpStatus.CREATED,
        message: `${body.itemName} was properly created`,
      };
    } catch (error) {
      return {
        results: {},
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Impossible to create ${body.itemName}. Please try again later`,
      };
    }
  }

  async updateFood(body: UpdateFoodDto, id: number) {
    const postgresQuery = updateQuery(convertKeys(body, 'apiToDb'), 'food');
    console.log('postgresQuery', postgresQuery);
    const response = await Foods.updateRow(postgresQuery, id);

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

  async handleCreatePicture(base64: string) {
    // If nothing was set, return a default image
    if (!base64) {
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg==';
    }

    // if image is already a url, return it because no changes was made on the picture
    if (this.isValidUrl(base64)) {
      return base64;
    }

    // Initialize the form data for the picture
    try {
      const dataBase64 = base64.split(';base64,').pop();
      // data:image/png;base64,......
      const formData = new FormData();
      const buff = Buffer.from(dataBase64, 'base64').toString();
      console.log('buff', buff);
      formData.append('file', buff);
      formData.append('upload_preset', String(process.env.UPLOAD_PRESET));
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
        formData,
      );
      const { statusText, data } = response;
      console.log('url', data.secure_url);
      if (statusText === 'OK') {
        return data.secure_url;
      }
    } catch (err) {
      console.log(err);
    }
  }

  isValidUrl(str: string) {
    try {
      new URL(str);
      return true;
    } catch (err) {
      return false;
    }
  }
}
