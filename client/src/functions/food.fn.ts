import { IFood } from "../interfaces";

export const convertFoodToSection = (foodList: IFood[], foodSection: string[]) => {
  let foodObject = {};
  foodSection.forEach((section) => {
    foodObject[section] = Array.from(
      new Set(foodList.filter((food) => food.itemSection === section).map((food) => food.itemExtra)),
    );
  });
  return foodObject;
};
