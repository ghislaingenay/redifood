import { IErrorTableInput, IFood } from "../interfaces";

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

export const calculateTotal = (array: IFood[]) => {
  if (array.length === 0) {
    return 0;
  }
  return [...array].map((food) => food.itemQuantity * food.itemPrice).reduce((t, e) => t + e);
};

export const checkIfArrayAreTheSame = (array1: IFood[], array2: IFood[]) => {
  if (array1.length !== array2.length) {
    return false;
  }
  for (let i = 0; i < array1.length; i++) {
    if (array1[i].itemId !== array2[i].itemId) {
      return false;
    }
  }
  return true;
};
