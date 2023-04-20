import { Injectable } from '@nestjs/common';
import {
  FoodCreatedEvent,
  FoodDeletedEvent,
  FoodUpdatedEvent,
} from 'redifood-module/src/events/foods-event';
import {
  EOrderStatus,
  IGetServerSideData,
} from 'redifood-module/src/interfaces';
import { DatabaseError } from '../redifood-module/src/handling-nestjs/database-error.exception';
import { Food } from './models/foods.model';
import { Order, OrdersDoc } from './models/orders.model';

@Injectable()
export class OrderService {
  async createFood(
    data: FoodCreatedEvent,
  ): Promise<IGetServerSideData<null, any>> {
    return new Promise(async (resolve, reject) => {
      const food = await Food.build(data);
      const res = await food.save();
      if (!res) reject(new DatabaseError());
      resolve({
        results: null,
        message: 'saved succesfully',
      });
    });
  }
  async updateFood(
    data: FoodUpdatedEvent,
  ): Promise<IGetServerSideData<null, any>> {
    return new Promise(async (resolve, reject) => {
      const food = await Food.findByIdAndUpdate(data.food.foodId, data);
      if (!food) reject(new DatabaseError());
      resolve({
        results: null,
        message: 'updated succesfully',
      });
    });
  }
  async deleteFood(
    data: FoodDeletedEvent,
  ): Promise<IGetServerSideData<null, any>> {
    return new Promise(async (resolve, reject) => {
      const food = await Food.findByIdAndDelete(data.item_id);
      if (!food) reject(new DatabaseError());
      resolve({
        results: null,
        message: 'deleted succesfully',
      });
    });
  }

  async getPaidOrder(): Promise<IGetServerSideData<OrdersDoc[], any>> {
    const res = await Order.find({ orderStatus: EOrderStatus.COMPLETE });
    if (!res) throw new DatabaseError();
    return {
      results: res,
      message: 'success',
    };
  }

  async getOneOrder(id: number): Promise<IGetServerSideData<OrdersDoc, any>> {
    const res = await Order.findById(id);
    if (!res) throw new DatabaseError();
    return {
      results: res,
      message: 'success',
    };
  }
}
