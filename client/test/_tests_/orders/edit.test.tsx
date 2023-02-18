describe("Edit Order - Server Side Props", () => {
  it.todo("should return food data if API call is successful");
  it.todo("should return error if API call is unsuccessful");
});

describe("Edit Order - Unit Testing", () => {
  it.todo("renders without crashing");
  it.todo("should indicate a table number input deactivated");
  it.todo("should show a pay button enable if order not empty");
  it.todo("should show a pay button not enable if order not empty");

  it.todo("should send an error and refresh the page if food data is not recovered");

  it.todo("order cart should not be empty when the page is loaded");

  it.todo("DESSERT button selected should contains 3 cards");
  it.todo("After fetching data, should obtain ALL, PIZZA, DRINK, DESSERT buttons");
  it.todo("ALL button should be selected when the page is loaded");
  it.todo("ALL button selected should contains 9 cards");
  it.todo("DRINK button selected should contains 4 cards");
});

describe("Edit Order - Integration", () => {
  it.todo("after fetching dayta, should an order cart");

  it.todo("should add food to the cart when clicking on the food card");
  it.todo("should add one quantity to the food if already in the cart");
  it.todo("should be able to add one food quantity inside the order when clicking on the food card");
  it.todo("should be able to remove one food quantity inside the order when clicking on the food card");
  it.todo("should be able to delete one food inside the order when clicking on the food card");

  it.todo("should show confirm to user that the order has been updated");
  it.todo("should show error to user if the order failed to be updated");

  it.todo("should ask the user to cancel or deleet order if the cart is empty");

  it.todo("should be able to cancel the order when clicking on the cancel button if cart is empty");
  it.todo("should show a cancel confirmation button to user if cart is different to the one recovered in the database");
  it.todo("show ask to cancel order if order is not empty and user click outside the foodlayout");
});

export {};
