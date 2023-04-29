import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ORDER_MODEL } from 'constant';
import { Order } from 'src/app.interface';
import { foods as foundFoods, section as allSection } from '../data';
import { Model } from 'mongoose';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(ORDER_MODEL) public readonly orderModel: Model<Order>,
  ) {}

  // Recover all the foods and section to display on /create (no modifications of section/foods)
  recoverFoodAndSection() {
    return {
      foods: foundFoods,
      section: allSection,
    };
  }

  async createOrder(dto) {
    // Recover the data and add in DB, if error connection, throw error, otherwise return the orders with id and redirect in FE
    const newOrder = new this.orderModel({
      _id: '',
      table: dto.table,
      paid: dto.paid,
      total: dto.total,
      menu: dto.menu,
      payment: dto.payment,
    });
    // const result = await newOrder.save();
    // return result as Order
    console.log(dto);
  }

  private async renderOrder(id: string): Order {
    // let oneOrder
    // try {
    // oneOrder = await this.orderModel.findById({_id: id})
  // } catch (error) {
  //   throw new NotFoundException('Could not find the order');
  // }
    // if (!order) {
    //   throw new NotFoundException('Could not find the order');
    // }
    // Step: Find by id in orderDB and return the one found or throw an error if issue
    // return order
  }

  async updateOrder(dto) {
    // const order = await this.orderModel.findByIdAndUpdate(dto._id, dto)
    // const updatedOrder = {...order}

    const state = {
      payment: '',
      table: 5,
      paid: false,
      _id: '3',
      menu: [],
      total: 5,
    };
    // findByIdAndUpdate system, throw error if not found, return boolean or something to confirm the change
    return {
      ...state,
      dto,
    };
  }
}
