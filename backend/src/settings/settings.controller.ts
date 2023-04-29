import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { User } from '../../redifood-module/src/handling-nestjs/user-decorator';
import { ValidationPipe } from '../../redifood-module/src/handling-nestjs/validation.pipe';
import { createSettingsDto } from './settings.dto';
import { SettingsService } from './settings.service';

@Controller('api/settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async getSettings(@User() user: any) {
    const userId = user.id;
    return await this.settingsService.getSettings(userId);
  }

  @Post()
  async createSettings(
    @User() user: any,
    @Body(new ValidationPipe()) body: createSettingsDto,
  ) {
    const userId = user.id;
    return await this.settingsService.createSettings(body, userId);
  }

  @Put()
  async updateSettings(
    @User() user: any,
    @Body(new ValidationPipe()) body: createSettingsDto,
  ) {
    const userId = user.id;
    return await this.settingsService.updateSettings(userId, body);
  }
  // async updateSettings(@User() user: any, @Body(new ValidationPipe()) body: createSettingsDto) {
}
