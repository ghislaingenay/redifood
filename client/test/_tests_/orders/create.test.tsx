import { render } from "@testing-library/react";
import CreateOrder from "pages/orders/create";

describe("Create Order - Server Side Props", () => {
  it.todo("should return food data if API call is successful");
  it.todo("should return error if API call is unsuccessful");
});

describe("Create Order - Unit Testing", () => {
  it("renders without crashing", () => {
    render(<CreateOrder />);
    expect(true).toBe(true);
  });

  it.todo("test convertDataForAPI function");

  it.todo("should indicate a tumber number input");
  it.todo("should show an alert if table number is already allocated");
  it.todo("should show an alert if table number is not selected");
  it.todo("Order cart should include a button to validate the order");
  it.todo("Validate button should not be enabled if the cart is empty");
  it.todo("Validate button should be enabled if the cart is not empty");
  it.todo("Order cart should include a button to validate the order");
  it.todo("should send an error and refresh the page if food data is not recovered");
  it.todo("order cart should be empty when the page is loaded");
  it.todo("DESSERT button selected should contains 4 cards");
  it.todo("After fetching data, should obtain ALL, PIZZA, DRINK, DESSERT buttons");
  it.todo("ALL button should be selected when the page is loaded");
  it.todo("ALL button selected should contains 9 cards");
  it.todo("DRINK button selected should contains 2 cards");
  it.todo("PIZZA button selected should contains 3 cards");
});

describe("Create Order - Integration", () => {
  it.todo("should add food to the cart when clicking on the food card");
  it.todo("should add one quantity to the food if already in the cart");
  it.todo("should be able to add one food quantity inside the order when clicking on the food card");
  it.todo("should be able to remove one food quantity inside the order when clicking on the food card");
  it.todo("should be able to delete one food inside the order when clicking on the food card");
  it.todo("should show confirm to user that the order has been created");
  it.todo("should show error to user if the order failed to be created");
  it.todo("should show a cancel confirmation button to user if orer cart is empty");
  it.todo("should be able to cancel the order when clicking on the cancel button if cart is empty");
  it.todo("should show a cancel confirmation button to user if orer cart is not empty");
  it.todo("show ask to cancel order if order is not empty and user click outside the foodlayout");
});
