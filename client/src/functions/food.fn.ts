import { IFood } from "../interfaces";

export const convertFoodToSection = (foodList: IFood[], foodSection: string[]) => {
  let foodObject = {};
  foodSection.forEach((section) => {
    foodObject[section] = foodList.filter((food) => food.itemSection === section);
  });
  return foodObject;
};
