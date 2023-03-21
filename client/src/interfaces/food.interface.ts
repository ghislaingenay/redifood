import { IFoodApi } from "../../redifood-module/src/interfaces";

export type TFoodSection = string[];
export type TFoodOrder = IFoodApi[];

export enum EFoodMode {
  CREATE = "create",
  EDIT = "edit",
  ALTER = "alter",
}
