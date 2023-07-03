import { IFoodApi, IFoodSectionList } from "../../redifood-module/src/interfaces";

export type TFoodSection = string[];
export type TFoodOrder = IFoodApi[];

export enum EFoodMode {
  CREATE = "create",
  EDIT = "edit",
  ALTER = "alter",
}

export interface IFoodForm {
  foodSection: IFoodSectionList[];
  foodList: IFoodApi[];
}

interface IFoodFormValues {
  itemName: string;
  itemPrice: number;
  sectionId: EHandleType;
  extraId: EHandleType;
  itemPhoto: string;
  itemDescription?: string;
  itemQuantity: number;
  id?: undefined;
}

export type PartialFormFood = Partial<IFoodFormValues>;
export type PartialFood = Partial<IFoodApi> | null;

export enum EHandleType {
  NONE = "NONE",
  CREATE = "CREATE",
  EDIT = "EDIT",
  ADDSECTION = "ADDSECTION",
  DELETESECTION = "DELETESECTION",
  ADDEXTRA = "ADDEXTRA",
  DELETEEXTRA = "DELETEEXTRA",
}
