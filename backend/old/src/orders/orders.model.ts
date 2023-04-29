import * as mongoose from 'mongoose';
const ObjectId = mongoose.Schema.Types.ObjectId;
import { Menu } from 'src/app.interface';

export const OrderSchema = new mongoose.Schema({
  table: {
    type: Number,
    required: true,
  },
  paid: {
    type: Boolean,
    required: true,
  },
  total: Number,
  menu: [
    {
      food: {
        type: ObjectId,
        ref: 'foods',
        required: true,
      },
      qty: {
        required: true,
        type: Number,
      },
    },
  ],
  date: Date,
  payment: String,
});

export interface Order extends mongoose.Document {
  _id: string;
  table: number;
  paid: boolean;
  total: number;
  menu: Menu[];
  date?: Date;
  payment: string;
}