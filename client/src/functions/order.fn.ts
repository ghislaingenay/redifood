import { IFoodGetApi, IFoodOrder } from "../../redifood-module/src/interfaces";
import { IErrorTableInput } from "../interfaces";

export const sendErrorTableInput = (tableNumber: number | null, tableArray: number[]) => {
  let errorState: IErrorTableInput = { alreadyInDb: false, missingValue: false };
  if (tableNumber === null || tableNumber === 0) {
    errorState.missingValue = true;
  }
  if (tableNumber && tableArray.includes(tableNumber)) {
    errorState.alreadyInDb = true;
  }
  return errorState;
};

export const calculateTotal = (array: IFoodGetApi[]) => {
  if (array.length === 0) {
    return 0;
  }
  return [...array].map((food) => food.itemQuantity * food.itemPrice).reduce((t, e) => t + e);
};

export const checkIfArrayAreTheSame = (array1: IFoodGetApi[], array2: IFoodGetApi[]) => {
  if (array1.length !== array2.length) {
    return false;
  }
  for (let i = 0; i < array1.length; i++) {
    if (array1[i].id !== array2[i].id) {
      return false;
    }
  }
  return true;
};

export const recoverQuantityFromOrderItems = (orderItems: IFoodOrder[], foodList: IFoodGetApi[]): IFoodGetApi[] => {
  return [...foodList].map((food) => {
    const foodInOrder = [...orderItems].find((orderItem) => orderItem.id === food.id);
    return {
      ...food,
      itemQuantity: foodInOrder?.itemQuantity,
    } as IFoodGetApi;
  });
};
