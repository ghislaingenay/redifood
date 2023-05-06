import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SettingsModule } from './settings/settings.module';
import { FoodsModule } from './foods/foods.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    AuthModule,
    SettingsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    FoodsModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
