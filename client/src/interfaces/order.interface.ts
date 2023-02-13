import { IFood } from "./food.interface";

export interface IErrorTableInput {
  alreadyInDb: boolean;
  missingValue: boolean;
}

export enum EOrderStatus {
  CREATED = "created",
  UPDATED = "updated",
  AWAITING_PAYMENT = "awaiting payment",
  COMPLETE = "completed",
}

export interface IOrder {
  _id?: string;
  orderStatus: EOrderStatus;
  orderCreatedDate: Date;
  orderCompleteDate: Date;
  tableNumber: number;
  orderTotal: number;
  orderItems: IFood[];
}
