import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import {
  ISettingsApi,
  UserInfo,
  UserPayload,
} from 'redifood-module/src/interfaces';
import { User } from 'src/global/user-decorator';
import { ValidationPipe } from '../../src/global/validation.pipe';
import { AuthGuard } from '../global/auth-guard';
import { CreateSettingsDto } from './settings.dto';
import { SettingsService } from './settings.service';

@Controller('api/settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @UseGuards(new AuthGuard())
  @Get()
  async getSettings(@User() user: UserPayload) {
    const userId = user.id;
    return await this.settingsService.getSettings(userId);
  }

  @UseGuards(new AuthGuard())
  @Get('user')
  async getUserAndSettings(@User() user: UserPayload) {
    const userId = user.id;
    return await this.settingsService.getUserAndSettings(userId);
  }

  @UseGuards(new AuthGuard())
  @Post()
  async createSettings(
    @User() user: any,
    @Body(new ValidationPipe()) body: CreateSettingsDto,
  ) {
    const userId = user.id;
    return await this.settingsService.createSettings(body, userId);
  }

  @UseGuards(new AuthGuard())
  @Put('user')
  async changeUserInfo(@User() user: any, @Body() body: Partial<UserInfo>) {
    return await this.settingsService.changeUserInfo(body, user.id);
  }

  @UseGuards(new AuthGuard())
  @Put()
  async updateSettings(@User() user: any, @Body() body: Partial<ISettingsApi>) {
    const userId = user.id;
    return await this.settingsService.updateSettings(body, userId);
  }
}
