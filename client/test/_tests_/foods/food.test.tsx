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
    expect(convertFoodToSection(mockedFoodData as any, ["pizza", "dessert", "drink"])).toStrictEqual({
      pizza: ["tomato", "cream"],
      dessert: ["pastry", "cake"],
      drink: ["hot drink", "soda", "beer"],
    });
  });
});

describe("Food - Layout", () => {
  it("Select all radio to verify the correct number of cards", async () => {
    render(<FoodLayout {...foodAlterProps} />);
    expectCardLength(9); // 9 + 1
    await clickRadio(/PIZZA/i);
    expectCardLength(2);
    await clickRadio(/DESSERT/i);
    expectCardLength(3);
    await clickRadio(/DRINK/i);
    expectCardLength(4);
    await clickRadio(/ALL/i);
    expectCardLength(9);
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
  });
  it("Should have no select food when user click on CREATE radio button", async () => {
    render(<FoodLayout {...foodAlterProps} />);
    expectAlertLength(1);
    await clickRadio(/CREATE/i);
    await waitFor(() => {
      expect(screen.queryByRole("alert")).toBe(null);
    });
  });

  it("User click on one food and the alert should disappear", async () => {
    render(<FoodLayout {...foodAlterProps} />);
    await clickFindAltText(/food millefeuille/i);
    await waitFor(() => {
      expectNotFoundText(/Please select a food to update/i);
    });
  });

  it("User click on one food and the food should appear", async () => {
    render(<FoodLayout {...foodAlterProps} />);
    await clickFindAltText(/food millefeuille/i);
    [/Name/i, /Description/i, /Price/i, /Section/i].forEach(async (item: RegExp) => {
      expectFindText(item);
    });
  });

  it("User click on create and edit radio shouldn/t be enabled", async () => {
    render(<FoodLayout {...foodAlterProps} />);
    await expectCheckedRadio(/EDIT/i);
    await clickRadio(/CREATE/i);
    await expectNotCheckedRadio(/EDIT/i);
    await expectCheckedRadio(/CREATE/i);
  });

  it("user click on one food and click submit, no error should be displayed", async () => {
    render(<FoodLayout {...foodAlterProps} />);
    await clickFindAltText(/food millefeuille/i);
    await clickButton(/confirm/i);
    await waitFor(() => {
      expect(screen.queryByRole("alert")).toBe(null);
    });
  });

  it("user click on one food, delete the name and click submit, name is required error should be displayed", async () => {
    render(<FoodLayout {...foodAlterProps} />);
    const user = userEvent.setup();
    await clickFindAltText(/food millefeuille/i);
    await user.clear(await screen.findByRole("textbox", { name: /itemName/i }));
    await waitFor(() => {
      expect(screen.queryByRole("alert")).toBe(null);
    });
    await clickButton(/confirm/i);
    await expectAlertLength(1);
  });

  it("user click on one food, delete the price and click submit, price is required error should be displayed", async () => {
    render(<FoodLayout {...foodAlterProps} />);
    const user = userEvent.setup();
    await clickFindAltText(/food millefeuille/i);
    await user.clear(await screen.findByLabelText(/Price/i));
    await waitFor(() => {
      expect(screen.queryByRole("alert")).toBe(null);
    });
    await clickButton(/confirm/i);
    await expectAlertLength(1);
  });

  it("user click on one food, delete the description and click submit, no error must be displayed", async () => {
    render(<FoodLayout {...foodAlterProps} />);
    const user = userEvent.setup();
    await user.click(await screen.findByAltText(/food millefeuille/i));
    await user.clear(await screen.findByRole("textbox", { name: /itemDescription/i }));
    await clickButton(/confirm/i);
    await waitFor(() => {
      expectNotFoundText(/A description is required/i);
    });
  });

  it("User click on create, confirm button must be disabled", async () => {
    render(<FoodLayout {...foodAlterProps} />);
    await clickRadio(/CREATE/i);
    expect(await findButton(/confirm/i)).toBeDisabled();
  });

  it("User click on create, label should be on the page", async () => {
    render(<FoodLayout {...foodAlterProps} />);
    await clickRadio(/CREATE/i);
    [/Name/i, /Description/i, /Price/i, /Section/i].forEach(async (item: RegExp) => {
      await expectFindText(item);
    });
  });
  it("User click on create, all the label must be present with empty data", async () => {
    render(<FoodLayout {...foodAlterProps} />);
    await clickRadio(/CREATE/i);
    expect((await screen.findByRole("textbox", { name: /itemName/i })).ariaValueText).toBe(undefined);
    expect((await screen.findByRole("textbox", { name: /itemDescription/i })).ariaValueText).toBe(undefined);
    expect((await screen.findByLabelText(/itemPrice/i)).ariaValueText).toBe(undefined);
  });

  // it("user click on one food, delete the picture and click submit, picture is required error should be displayed", async () => {
  //   render(<FoodLayout {...foodAlterProps} />);
  //   const user = userEvent.setup();
  //   await clickFindAltText(/food millefeuille/i);
  //   await user.click(await findButton(/Remove file/i));
  //   await waitFor(() => {
  //     expect(screen.queryByRole("alert")).toBe(null);
  //   });
  //   await clickButton(/confirm/i);
  //   await expectAlertLength(1);
  // });
});
