import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EGroupId } from 'redifood-module/src/interfaces';
import { FoodController } from './foods.controller';
import { FoodService } from './foods.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: EGroupId.UPLOAD,
        transport: Transport.TCP,
      },
      {
        name: EGroupId.ORDER,
        transport: Transport.TCP,
      },
    ]),
  ],
  controllers: [FoodController],
  providers: [FoodService],
})
export class FoodsModule {}
