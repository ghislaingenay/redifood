import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { IGetServerSideData } from 'redifood-module/src/interfaces';
import { DatabaseError } from '../../redifood-module/src/handling-nestjs/database-error.exception';
import { Setting } from '../../src/models/settings.model';
import { CreateSettingsDto, UpdateSettingsDto } from './settings.dto';

@Injectable()
export class SettingsService {
  async getSettings(
    userId: mongoose.Types.ObjectId,
  ): Promise<IGetServerSideData<any>> {
    try {
      if (!userId) throw new BadRequestException('No user id provided');

      const settings = await Setting.findOne({ user: userId });
      return { results: settings || {}, message: 'Settings retrieved' };
    } catch (err) {
      if (err instanceof BadRequestException) {
        return {
          results: {},
          message: err.message,
          statusCode: HttpStatus.BAD_REQUEST,
        };
      } else {
        return {
          results: {},
          message: 'Error retrieving settings',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        };
      }
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
      return { results: savedSettings, message: 'Settings created' };
    } catch (err) {
      if (err instanceof BadRequestException) {
        return {
          results: {},
          message: err.message,
          statusCode: HttpStatus.BAD_REQUEST,
        };
      } else {
        return {
          results: {},
          message: 'Settings already exist',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        };
      }
    }
  }

  async updateSettings(body: UpdateSettingsDto, userId: string) {
    try {
      if (!body) throw new BadRequestException('No body provided');
      if (!userId) throw new BadRequestException('No user id provided');

      const savedSettings = await Setting.findOneAndUpdate(
        { user: userId },
        body,
      );
      if (!savedSettings) throw new DatabaseError();
      return {
        results: body,
        message: 'Settings updated',
        statusCode: HttpStatus.OK,
      };
    } catch (err) {
      if (err instanceof BadRequestException) {
        return {
          results: {},
          message: err.message,
          statusCode: HttpStatus.BAD_REQUEST,
        };
      } else {
        return {
          results: {},
          message: err.message,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        };
      }
    }
  }
}
