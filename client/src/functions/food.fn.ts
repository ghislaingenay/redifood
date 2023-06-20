import { IFoodApi, IFoodSectionList } from "../../redifood-module/src/interfaces";

export const convertFoodToSection = (foodList: IFoodApi[], foodSection: IFoodSectionList[]) => {
  let foodObject: Record<string, number[]> = {};
  foodSection.forEach(({id, sectionName}) => {
    foodObject[sectionName] = Array.from(
      new Set(foodList.filter((food) => food.sectionId === id).map((food) => food.extraId)),
    );
  });
  return foodObject;
};
