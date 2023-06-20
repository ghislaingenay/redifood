import { EOrderStatus, IFoodOrder } from "../../redifood-module/src/interfaces";

export interface IErrorTableInput {
  alreadyInDb: boolean;
  missingValue: boolean;
}

export type TCreateOrderBody = { orderTableNumber: number; orderItems: IFoodOrder[] };

export type TUpdateOrderBody = {
  orderTableNumber: number;
  orderItems: IFoodOrder[];
  orderStatus: EOrderStatus;
};
