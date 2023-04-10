import { IFoodApi } from "../../redifood-module/src/interfaces";

export const convertFoodToSection = (foodList: IFoodApi[], foodSection: string[]) => {
  let foodObject: Record<string, number[]> = {};
  foodSection.forEach((section: string) => {
    foodObject[section] = Array.from(
      new Set(foodList.filter((food) => food.sectionId === section).map((food) => food.extraId)),
    );
  });
  return foodObject;
};
