import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ORDER_MODEL } from 'constant';
import { OrderSchema } from 'schemas/orders.schema';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ORDER_MODEL, schema: OrderSchema }]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
