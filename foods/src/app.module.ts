import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EGroupId } from 'redifood-module/src/interfaces';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FoodController } from './foods/foods.controller';
import { FoodsModule } from './foods/foods.module';
import { FoodService } from './foods/foods.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    FoodsModule,
    ClientsModule.register([
      {
        name: EGroupId.UPLOAD,
        transport: Transport.TCP,
      },
    ]),
  ],
  controllers: [AppController, FoodController],
  providers: [AppService, FoodService],
})
export class AppModule {}
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(currentUser, requireAuth).forRoutes('*');
//   }
// }
