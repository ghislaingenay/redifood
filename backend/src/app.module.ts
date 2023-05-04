import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SettingsModule } from './settings/settings.module';
import { FoodsModule } from './foods/foods.module';

@Module({
  imports: [
    AuthModule,
    SettingsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    FoodsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
