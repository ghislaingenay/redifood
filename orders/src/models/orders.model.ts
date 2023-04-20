import mongoose from 'mongoose';
import {
  ECurrency,
  EOrderStatus,
  IFoodOrder,
  IOrderApi,
} from '../../redifood-module/src/interfaces';

type OrdersAttrs = IOrderApi;

export interface OrdersDoc extends mongoose.Document {
  id?: string;
  orderNo: number;
  orderStatus: EOrderStatus;
  orderCreatedDate: Date;
  orderCompleteDate: Date;
  tableNumber: number;
  orderTotal: number;
  orderItems: IFoodOrder[];
  orderCurrency: ECurrency;
}

interface OrdersModel extends mongoose.Model<OrdersDoc> {
  build(attrs: OrdersAttrs): OrdersDoc;
}

mongoose.set('strictQuery', false);
const ordersSchema = new mongoose.Schema(
  {
    orderNo: {
      type: Number,
      required: true,
    },

    orderStatus: {
      type: String,
      required: true,
      enum: Object.keys(EOrderStatus),
      default: EOrderStatus.CREATED,
    },
    orderCreatedDate: {
      type: Date,
      required: true,
      default: new Date(),
    },
    orderCompleteDate: {
      type: Date,
      required: false,
    },
    tableNumber: {
      type: Number,
      required: true,
    },
    orderTotal: {
      type: Number,
      required: true,
    },
    orderItems: {
      type: [Object],
      required: true,
    },
    orderCurrency: {
      type: String,
      enum: Object.keys(ECurrency),
      required: true,
    },
  },
  {
    toJSON: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transform(doc: mongoose.Document, ret: any) {
        // Make direct changes to the JSON OBJECT
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

// Add a static method to the model to check type
ordersSchema.statics.build = (attrs: OrdersAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrdersDoc, OrdersModel>('orders', ordersSchema);

export { Order };
