import { ECurrency } from "./settings.interface";

export interface IFood {
  itemId: number | string;
  itemName: string;
  itemPhoto: string;
  itemPrice: number;
  itemDescription: string;
  itemSection: string;
  itemExtra: string;
  itemQuantity: number;
  itemCurrency: ECurrency;
}

export type TFoodSection = string[];
export type TFoodOrder = IFood[];

export enum EFoodMode {
  CREATE = "create",
  EDIT = "edit",
  ALTER = "alter",
}
