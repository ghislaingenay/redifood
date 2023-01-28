export const sendErrorIfTableTaken = (tableNumber: number, tableArray: number[]) => {
  return tableArray.includes(tableNumber);
};
