import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
