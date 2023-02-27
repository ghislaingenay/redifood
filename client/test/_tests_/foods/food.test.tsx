import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "../..";
import FoodLayout from "../../../src/components/food-order/FoodLayout";
import { convertFoodToSection } from "../../../src/functions/food.fn";
import {
  clickButton,
  clickFindAltText,
  clickRadio,
  expectAlertLength,
  expectCardLength,
  expectCheckedRadio,
  expectFindText,
  expectNotCheckedRadio,
  expectNotFoundText,
  findButton,
} from "../../../src/functions/testhelpers.fn";
import { foodAlterProps, mockedFoodData } from "../../mocks/mockFoodData";

describe("FoodForm - Functions", () => {
  it("should return section and extra sorted", () => {
    expect(convertFoodToSection(mockedFoodData, ["pizza", "dessert", "drink"])).toStrictEqual({
      pizza: ["tomato", "cream"],
      dessert: ["pastry", "cake"],
      drink: ["hot drink", "soda", "beer"],
    });
  });
});

describe("Food - Layout", () => {
  it("Select all radio to verify the correct number of cards", () => {
    render(<FoodLayout {...foodAlterProps} />);
    expectCardLength(10); // 9 + 1
    clickRadio(/PIZZA/i);
    expectCardLength(3);
    clickRadio(/DESSERT/i);
    expectCardLength(4);
    clickRadio(/DRINK/i);
    expectCardLength(5);
    clickRadio(/ALL/i);
    expectCardLength(10); // 9 + 1
  });

  it("Edit radio should be checked", () => {
    render(<FoodLayout {...foodAlterProps} />);
    expectCheckedRadio(/EDIT/i);
    expectNotCheckedRadio(/CREATE/i);
  });

  it("Should have no selected food and show alert", () => {
    render(<FoodLayout {...foodAlterProps} />);
    expectCheckedRadio(/EDIT/i);
    expectAlertLength(1);
    expectFindText(/Please a select a food to update/i);
  });

  it("User click on one food and the alert should disappear", async () => {
    render(<FoodLayout {...foodAlterProps} />);
    clickFindAltText(/food millefeuille/i);
    await waitFor(() => {
      expectNotFoundText(/Please a select a food to update/i);
    });
  });

  it("User click on one food and the food should appear", async () => {
    render(<FoodLayout {...foodAlterProps} />);
    clickFindAltText(/food millefeuille/i);
    [/Picture/i, /Name/i, /Description/i, /Price/i, /Section/i].forEach(async (item: RegExp) => {
      expectFindText(item);
    });
    expect(await screen.findByRole("textbox", { name: /Picture/i })).toBe("hey");
  });

  it("User click on create and edit radio shouldn/t be enabled", () => {
    render(<FoodLayout {...foodAlterProps} />);
    expectCheckedRadio(/EDIT/i);
    clickRadio(/CREATE/i);
    expectNotCheckedRadio(/EDIT/i);
    expectCheckedRadio(/CREATE/i);
  });

  it("user click on one food and click submit, no error should be displayed", async () => {
    render(<FoodLayout {...foodAlterProps} />);
    clickFindAltText(/food millefeuille/i);
    clickButton(/confirm/i);
    await waitFor(() => {
      expect(screen.queryAllByRole("alert")).toBe(null);
    });
  });

  it("user click on one food, delete the name and click submit, name is required error should be displayed", async () => {
    render(<FoodLayout {...foodAlterProps} />);
    const user = userEvent.setup();
    clickFindAltText(/food millefeuille/i);
    await user.clear(await screen.findByLabelText(/name/i));
    clickButton(/confirm/i);
    expectAlertLength(1);
    expectFindText(/A name is required/i);
  });

  it("user click on one food, delete the price and click submit, price is required error should be displayed", async () => {
    render(<FoodLayout {...foodAlterProps} />);
    const user = userEvent.setup();
    clickFindAltText(/food millefeuille/i);
    await user.clear(await screen.findByLabelText(/price/i));
    clickButton(/confirm/i);
    expectAlertLength(1);
    expectFindText(/A price is required/i);
  });

  it("user click on one food, delete the description and click submit, description is required error should be displayed", async () => {
    render(<FoodLayout {...foodAlterProps} />);
    const user = userEvent.setup();
    clickFindAltText(/food millefeuille/i);
    await user.clear(await screen.findByLabelText(/description/i));
    clickButton(/confirm/i);
    expectAlertLength(1);
    expectFindText(/A description is required/i);
  });

  it("user click on one food, delete the picture and click submit, picture is required error should be displayed", async () => {
    render(<FoodLayout {...foodAlterProps} />);
    const user = userEvent.setup();
    clickFindAltText(/food millefeuille/i);
    await user.clear(await screen.findByLabelText(/picture/i));
    clickButton(/confirm/i);
    expectAlertLength(1);
    expectFindText(/A picture is required/i);
  });

  it("User click on create, confirm button must be disabled", () => {
    render(<FoodLayout {...foodAlterProps} />);
    clickRadio(/CREATE/i);
    expect(findButton(/confirm/i)).toBeDisabled();
  });
  it("User click on create, label shouls be on the page", () => {
    render(<FoodLayout {...foodAlterProps} />);
    clickRadio(/CREATE/i);
    [/Upload/i, /Picture/i, /Name/i, /Description/i, /Price/i, /Section/i].forEach(async (item: RegExp) => {
      expectFindText(item);
    });
  });
  it.only("User click on create, all the label must be present with empty data", async () => {
    render(<FoodLayout {...foodAlterProps} />);
    clickRadio(/CREATE/i);
    expectFindText("Select ...");
    expect(await screen.findByLabelText(/picture/i)).toBe(undefined);
    expect(await screen.findByLabelText(/name/i)).toBe(undefined);
    expect(await screen.findByLabelText(/description/i)).toBe(undefined);
    expect(await screen.findByLabelText(/price/i)).toBe(undefined);
  });
});
