import { IFood } from "../interfaces";

export const convertFoodToSection = (foodList: IFood[], foodSection: string[]) => {
  let foodObject: Record<string, string[]> = {};
  foodSection.forEach((section: string) => {
    foodObject[section] = Array.from(
      new Set(foodList.filter((food) => food.itemSection === section).map((food) => food.itemExtra)),
    );
  });
  return foodObject;
};
