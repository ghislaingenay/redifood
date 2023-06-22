import { IFoodOrder } from "../../redifood-module/src/interfaces";

export interface IErrorTableInput {
  alreadyInDb: boolean;
  missingValue: boolean;
}

export type TCreateOrderBody = { orderTableNumber: number; orderItems: IFoodOrder[] };

export type TUpdateOrderBody = {
  orderItems: IFoodOrder[];
};
