import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { IGetServerSideData } from 'redifood-module/src/interfaces';
import { DatabaseError } from '../../redifood-module/src/handling-nestjs/database-error.exception';
import { Setting } from '../../src/models/settings.model';
import { createSettingsDto, updateSettingsDto } from './settings.dto';

@Injectable()
export class SettingsService {
  async getSettings(
    userId: mongoose.Types.ObjectId,
  ): Promise<IGetServerSideData<any>> {
    return await new Promise((resolve, reject) => {
      try {
        if (!userId) throw new BadRequestException('No user id provided');

        const settings = Setting.findById(userId);
        if (!settings) throw new DatabaseError();
        resolve({ results: settings, message: 'Settings retrieved' });
      } catch (err) {
        if (err instanceof BadRequestException) {
          reject({
            results: {},
            message: err.message,
            statusCode: HttpStatus.BAD_REQUEST,
          });
        } else {
          reject({
            results: {},
            message: err.message,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          });
        }
      }
    });
  }

  async createSettings(body: createSettingsDto, userId: string) {
    return await new Promise((resolve, reject) => {
      try {
        if (!body) throw new BadRequestException('No body provided');
        if (!userId) throw new BadRequestException('No user id provided');

        const newSettings = Setting.build({
          user: userId,
          language: body.language,
          haveFoodDescription: body.haveFoodDescription,
          currency: body.currency,
          haveFoodImage: body.haveFoodImage,
          vat: body.vat,
        });
        const savedSettings = newSettings.save();
        if (!savedSettings) throw new DatabaseError();
        resolve({ results: savedSettings, message: 'Settings created' });
      } catch (err) {
        if (err instanceof BadRequestException) {
          reject({
            results: {},
            message: err.message,
            statusCode: HttpStatus.BAD_REQUEST,
          });
        } else {
          reject({
            results: {},
            message: err.message,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          });
        }
      }
    });
  }

  async updateSettings(body: updateSettingsDto, userId: string) {
    return await new Promise((resolve, reject) => {
      try {
        if (!body) throw new BadRequestException('No body provided');
        if (!userId) throw new BadRequestException('No user id provided');

        const savedSettings = Setting.findByIdAndUpdate(userId, body);
        if (!savedSettings) throw new DatabaseError();
        resolve({
          results: savedSettings,
          message: 'Settings updated',
          statusCode: HttpStatus.OK,
        });
      } catch (err) {
        if (err instanceof BadRequestException) {
          reject({
            results: {},
            message: err.message,
            statusCode: HttpStatus.BAD_REQUEST,
          });
        } else {
          reject({
            results: {},
            message: err.message,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          });
        }
      }
    });
  }
}
