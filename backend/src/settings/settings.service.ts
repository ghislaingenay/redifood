import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import {
  IGetServerSideData,
  ISettingsApi,
  UserInfo,
  UserPayload,
} from 'redifood-module/src/interfaces';
import { DatabaseError } from 'src/global/database-error.exception';
import { User } from 'src/models/users.model';
import { Setting } from '../../src/models/settings.model';
import { CreateSettingsDto } from './settings.dto';

@Injectable()
export class SettingsService {
  async getSettings(
    userId: UserPayload['id'],
  ): Promise<IGetServerSideData<any>> {
    try {
      if (!userId) throw new BadRequestException('No user id provided');
      const settings = await Setting.findOne({ user: userId });
      return { results: settings || {}, message: 'Settings retrieved' };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getUserAndSettings(
    userId: UserPayload['id'],
  ): Promise<IGetServerSideData<any>> {
    try {
      if (!userId) throw new BadRequestException('No user id provided');
      const { results: settings } = await this.getSettings(userId);
      const user = await User.findById(userId);
      return {
        statusCode: HttpStatus.OK,
        results: { settings, user } || {},
        message: 'Settings retrieved',
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async changeUserInfo(
    body: Partial<UserInfo>,
    userId: string,
  ): Promise<IGetServerSideData<any>> {
    try {
      const user = await User.findByIdAndUpdate({ _id: userId }, body, {
        new: true,
      });
      return {
        results: user,
        message: `User ${userId} updated`,
        statusCode: HttpStatus.CREATED,
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async createSettings(body: CreateSettingsDto, userId: string) {
    try {
      if (!body) throw new BadRequestException('No body provided');
      if (!userId) throw new BadRequestException('No user id provided');

      const newSettings = Setting.build({
        user: userId,
        language: body.language,
        currency: body.currency,
        haveFoodImage: body.haveFoodImage,
        vat: body.vat,
      });
      const savedSettings = await newSettings.save();
      if (!savedSettings) throw new DatabaseError();
      return {
        results: savedSettings,
        message: 'Settings created',
        statusCode: HttpStatus.CREATED,
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async updateSettings(body: Partial<ISettingsApi>, userId: string) {
    try {
      if (!body) throw new BadRequestException('No body provided');
      if (!userId) throw new BadRequestException('No user id provided');

      const savedSettings = await Setting.findOneAndUpdate(
        { user: userId },
        body,
        { new: true },
      );
      if (!savedSettings) throw new DatabaseError();
      return {
        results: body,
        message: `Settings ${savedSettings._id} updated`,
        statusCode: HttpStatus.OK,
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
