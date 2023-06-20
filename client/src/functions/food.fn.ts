import { IFoodApi, IFoodOrder, IFoodSectionList } from "../../redifood-module/src/interfaces";

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
