import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ORDER_MODEL } from 'constant';
import { Order } from './app.interface';
import { Model } from 'mongoose';
@Injectable()
export class AppService {
  constructor(
    @InjectModel(ORDER_MODEL) private readonly orderModel: Model<Order>,
  ) {}
  // Recover the orders from database and filter them (only ones with paid: false)
  async getAllOrders() {
    // const allOrders = await this.orderModel.find().exec();
    // return allOrders as Orders[]
    console.log('properly connected');
    return [
      {
        _id: 'AVGVHB5373DHUDFBHSCC',
        table: 4,
        paid: false,
        total: 15.2,
        payment: '',
        menu: [
          {
            food: {
              _id: '4',
              photo: '',
              name: 'Cheese Cake Vanilla',
              price: 4.8,
              section: 'dessert',
              extra: 'cakes',
            },
            qty: 2,
          },
          {
            food: {
              _id: '3',
              photo: '',
              name: 'Hot coffee',
              price: 2.8,
              section: 'drink',
              extra: 'hot',
            },
            qty: 2,
          },
        ],
      },
      {
        _id: '01frVGVH4514DC',
        paid: false,
        table: 7,
        total: 23.2,
        payment: '',
        menu: [
          {
            food: {
              _id: '8',
              photo: '',
              name: 'German salad',
              price: 9.6,
              section: 'entrees',
              extra: 'salad',
            },
            qty: 1,
          },
          {
            food: {
              _id: '9',
              photo: '',
              name: 'Ice Coffee',
              price: 3.4,
              section: 'drink',
              extra: 'cold',
            },
            qty: 4,
          },
        ],
      },
    ];
  }
}
