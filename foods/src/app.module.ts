import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FoodsModule } from './foods/foods.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), FoodsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}