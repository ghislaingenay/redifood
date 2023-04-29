import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { HistoryModule } from './history/history.module';
import { ProfileModule } from './profile/profile.module';
import { AppController } from './app.controller';
import { FoodModule } from './foods/foods.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ORDER_MODEL } from 'constant';
import { OrderSchema } from 'schemas/orders.schema';

@Module({
  imports: [
    OrdersModule,
    AuthModule,
    HistoryModule,
    ProfileModule,
    FoodModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forFeature([{ name: ORDER_MODEL, schema: OrderSchema }]),
    UsersModule,
    MongooseModule.forRoot(process.env.MONGODB_URL),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
