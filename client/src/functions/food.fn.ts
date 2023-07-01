import {
  IFoodApi,
  IFoodGetApi,
  IFoodOrder,
  IFoodSectionList,
  IFoodSectionListWithExtra,
} from "../../redifood-module/src/interfaces";
import { EHandleType } from "../interfaces";

export const convertFoodToSection = (foodList: IFoodApi[], foodSection: IFoodSectionList[]) => {
  let foodObject: Record<string, number[]> = {};
  foodSection.forEach(({ id, sectionName }) => {
    foodObject[sectionName] = Array.from(
      new Set(foodList.filter((food) => food.sectionId === id).map((food) => food.extraId)),
    );
  });
  return foodObject;
};

export const setFoodItemsForDb = (foodOrder: IFoodApi[]): IFoodOrder[] => {
  return [...foodOrder].map(({ itemName, itemQuantity, id }) => {
    return {
      itemName,
      itemQuantity,
      id,
    } as IFoodOrder;
  });
};

export const setOptionsSelection = (foodSection: IFoodSectionList[]) => {
  const newFoodSection = [{ label: "ALL", value: 0, ariaLabel: "ALL" }];
  const options = [...foodSection].map((section) => {
    return {
      label: section.sectionName,
      value: section.id,
      ariaLabel: section.sectionName,
    };
  });
  return [...newFoodSection, ...options];
};

// For FOOD FORM
export const checkDisability = (sectionValue: EHandleType, extraValue: EHandleType) => {
  return (
    sectionValue === EHandleType.NONE ||
    sectionValue === EHandleType.ADDSECTION ||
    sectionValue === EHandleType.DELETESECTION ||
    extraValue === EHandleType.NONE ||
    extraValue === EHandleType.ADDEXTRA ||
    extraValue === EHandleType.DELETEEXTRA
  );
};

export const recoverIdName = (listing: IFoodSectionListWithExtra[] | IFoodSectionList[]) => {
  return [...listing]?.map((item) => {
    return { id: item.id, name: item.sectionName };
  });
};

export const getDataBySectionId = (
  listSectionExtra: IFoodSectionListWithExtra[],
  sectionId: IFoodSectionList["id"],
): IFoodSectionListWithExtra | undefined => {
  return listSectionExtra?.find((item) => item.id === sectionId);
};

export const initializeDataForFoodForm = (food: IFoodGetApi) => {
  const { id, itemName, itemPrice, itemSection, itemExtra, itemPhoto } = food;
  console.log("food", food);
  return {
    id,
    itemPhoto,
    itemName,
    itemPrice: Number(itemPrice),
    itemSection: itemSection.id,
    itemExtra: itemExtra.id,
  };
};
