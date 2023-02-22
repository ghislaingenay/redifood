import { convertFoodToSection } from "../../../src/functions/food.fn";
import { mockedFoodData } from "../../mocks/mockFoodData";

export {};
describe("FoodForm - Functions", () => {
  it("should return section and extra sorted", () => {
    expect(convertFoodToSection(mockedFoodData, ["pizza", "dessert", "drink"])).toStrictEqual({
      pizza: ["tomato", "cream"],
      dessert: ["pastry", "cake"],
      drink: ["hot drink", "soda", "beer"],
    });
  });
});
