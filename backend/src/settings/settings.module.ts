import { Module } from '@nestjs/common';
// import { APP_GUARD } from '@nestjs/core';
// import { AuthGuard } from '../../redifood-module/src/handling-nestjs/auth-guard';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
@Module({
  controllers: [SettingsController],
  providers: [
    SettingsService,
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
  ],
})
export class SettingsModule {}
