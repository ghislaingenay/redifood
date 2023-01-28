import { IErrorTableInput } from "../interfaces";

export const sendErrorTableInput = (tableNumber: number, tableArray: number[]) => {
  let errorState: IErrorTableInput = { alreadyInDb: false, missingValue: false };
  if (tableNumber === null || tableNumber === 0) {
    errorState.missingValue = true;
  }
  if (tableArray.includes(tableNumber)) {
    errorState.alreadyInDb = true;
  }
  return errorState;
};
