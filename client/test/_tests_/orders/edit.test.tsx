import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// import { rest } from "msw";
import EditOrder from "../../../pages/orders/[id]/edit";
import {
  clickFindAltText,
  clickFindButton,
  clickRadio,
  expectCardLength,
  expectFindText,
  findButton,
  findRadio,
  findText,
} from "../../../src/functions/testhelpers.fn";
import { editSuccessProps } from "../../../test/mocks/mockFoodData";
// import { server } from "../../../test/mocks/server";
import { render } from "../../index";
jest.mock("next/navigation", () => require("next-router-mock"));
jest.setTimeout(30000);

describe("Edit Order - Food List", () => {
  it("renders without crashing", () => {
    render(<EditOrder {...editSuccessProps} />);
    expect(1 + 1).toEqual(2);
  });

  it("Page contains edit order heading", async () => {
    render(<EditOrder {...editSuccessProps} />);
    expect(screen.getByRole("heading", { name: /edit order/i })).toBeInTheDocument();
  });
  it("should have a number input disabled", () => {
    render(<EditOrder {...editSuccessProps} />);
    expect(screen.getByRole("spinbutton", { name: /TableNumber/i })).toBeDisabled();
    expect(screen.getByRole("heading", { name: /Table Number/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Order #/i })).toBeInTheDocument();
  });

  it("Validate button should be enabled if the cart", () => {
    render(<EditOrder {...editSuccessProps} />);
    expect(screen.getByRole("button", { name: /Validate/i })).toBeEnabled();
  });

  // it("should send an error and refresh the page if food data is not recovered", async () => {
  //   render(<CreateOrder {...createErrorProps} />);
  //   expect(await screen.findByRole("alert")).toBeInTheDocument();
  //   expect(await findText(/An error occured/i)).toBeInTheDocument();
  //   expect(await findText(/Please refresh the page/i)).toBeInTheDocument();
  // });

  it("order cart should contains a total of 10.65 when the page is loaded", async () => {
    render(<EditOrder {...editSuccessProps} />);
    expect(await findText(/Total: [$]10.65/i)).toBeInTheDocument();
  });

  it("should add food to the cart when clicking on the food card", async () => {
    render(<EditOrder {...editSuccessProps} />);
    const user = userEvent.setup();
    expect(await screen.findAllByText(/espresso/i)).toHaveLength(1);
    await user.click(screen.getByText(/espresso/i));
    expect(await screen.findAllByText(/espresso/i)).toHaveLength(2);
  });

  it("After fetching data, should obtain ALL, PIZZA, DRINK, DESSERT buttons", async () => {
    render(<EditOrder {...editSuccessProps} />);
    expect(await findRadio(/ALL/i)).toBeChecked();
    expect(await findRadio(/ALL/i)).toBeEnabled();
    expect(await findRadio(/DESSERT/i)).toBeEnabled();
    expect(await findRadio(/DRINK/i)).toBeEnabled();
    expect(await findRadio(/PIZZA/i)).toBeEnabled();
  });

  it("DESSERT button selected should contains 3 cards", async () => {
    render(<EditOrder {...editSuccessProps} />);
    await expectCardLength(11);
    await clickRadio(/DESSERT/i);
    await expectCardLength(5);
  });

  it("DRINK should be selected when clicked", async () => {
    render(<EditOrder {...editSuccessProps} />);
    expect(await findRadio(/ALL/i)).toBeChecked();
    expect(await findRadio(/DRINK/i)).not.toBeChecked();
    await clickRadio(/DRINK/i);
    await expectCardLength(6);
    expect(await findRadio(/ALL/i)).not.toBeChecked();
    expect(await findRadio(/DRINK/i)).toBeChecked();
  });

  it("should add food to the cart when clicking on the food card", async () => {
    render(<EditOrder {...editSuccessProps} />);
    const user = userEvent.setup();
    expect(await findText(/Total: [$]10.65/i)).toBeInTheDocument();
    await user.click(screen.getByText(/espresso/i));
    expect(await findText(/Total: [$]11.65/i)).toBeInTheDocument();
  });
});

describe("Edit Order - Integration", () => {
  it("should show a cancel button", async () => {
    render(<EditOrder {...editSuccessProps} />);
    expect(await findButton(/Cancel order/i)).toBeInTheDocument();
  });

  it("should add one quantity to the food if already in the cart via food list", async () => {
    render(<EditOrder {...editSuccessProps} />);
    const user = userEvent.setup();
    const findProfiteroles = await screen.findByAltText(/Food profiteroles/i);
    expect(await findText(/Total: [$]10.65/i)).toBeInTheDocument();
    expect(await screen.findAllByAltText(/Food profiteroles/i)).toHaveLength(1);
    await user.click(findProfiteroles);
    expect(await findText(/Total: [$]14.40/i)).toBeInTheDocument();
    await user.click(findProfiteroles);
    expect(await findText(/Total: [$]18.15/i)).toBeInTheDocument();
  });

  it("should add one quantity to the food if already in the cart via order cart list", async () => {
    render(<EditOrder {...editSuccessProps} />);
    const user = userEvent.setup();
    const findProfiteroles = await screen.findByAltText(/Food profiteroles/i);
    expect(await screen.findAllByAltText(/Food profiteroles/i)).toHaveLength(1);
    await user.click(findProfiteroles);
    expect(await findText(/Total: [$]14.40/i)).toBeInTheDocument();
    await user.click(await screen.findByRole("img", { name: /add profiteroles/i }));
    expect(await findText(/Total: [$]18.15/i)).toBeInTheDocument();
  });

  it("button remove button is deactivated when quantity is 1", async () => {
    render(<EditOrder {...editSuccessProps} />);
    const user = userEvent.setup();
    const findProfiteroles = await screen.findByAltText(/Food profiteroles/i);
    expect(await screen.findAllByAltText(/Food profiteroles/i)).toHaveLength(1);
    await user.click(findProfiteroles);
    expect(await findText(/Total: [$]14.40/i)).toBeInTheDocument();
    expect(await findButton(/remove profiteroles/i)).toBeDisabled();
  });

  it("should the button remove should be activated when quantity is 2", async () => {
    render(<EditOrder {...editSuccessProps} />);
    const user = userEvent.setup();
    const findProfiteroles = await screen.findByAltText(/Food profiteroles/i);
    expect(await screen.findAllByAltText(/Food profiteroles/i)).toHaveLength(1);
    await user.click(findProfiteroles);
    expect(await findButton(/remove profiteroles/i)).toBeDisabled();
    await user.click(findProfiteroles);
    expect(await findText(/Total: [$]18.15/i)).toBeInTheDocument();
    expect(await findButton(/remove profiteroles/i)).toBeEnabled();
  });

  // it("should be able to cancel the order when clicking on the cancel button if cart is empty", async () => {
  //   render(<CreateOrder {...createSuccessProps} />);
  //   const user = userEvent.setup();
  //   await user.click(await findButton(/Cancel order/i));
  //   await waitFor(() => {
  //     expect(screen.queryByText(/Are u sure you want to cancel?/i)).toBe(null);
  //   });
  // });

  // it("should show a cancel confirmation button to user if orer cart is not empty", async () => {
  //   render(<CreateOrder {...createSuccessProps} />);
  //   const user = userEvent.setup();
  //   expect(screen.queryByText(/Are u sure you want to cancel/i)).toBe(null);
  //   await user.click(screen.getByText(/espresso/i));
  //   await user.click(screen.getByRole("button", { name: /Cancel order/i }));
  //   expect(await findText(/Are u sure you want to cancel/i)).toBeInTheDocument();
  // });

  // This element will be tested in e2e testing
  it.todo("show ask to cancel order if order was updated and user click outside the foodlayout");
  it.todo("should send a success notification when the order was successfully saved");

  it("should be able to remove one food quantity inside the order when clicking on the food card", () => {
    render(<EditOrder {...editSuccessProps} />);
    clickFindAltText(/Food profiteroles/i);
    expectFindText(/Total: [$]14.40/i);
    clickFindButton(/delete profiteroles/i);
    expectFindText(/Total: [$]10.65/i);
  });
  it.todo("should send an error notification when the order was not saved");
});

describe("Edit Order - Integration Testing", () => {
  it("User order multiple products and click on the cancel button", () => {
    render(<EditOrder {...editSuccessProps} />);
    expectFindText(/Total: [$]10.65/i);
    clickFindAltText(/food millefeuille/i);
    expectFindText(/Total: [$]14.90/i);
    clickRadio(/PIZZA/i);
    clickFindAltText(/food pizza cheesy/i);
    clickFindAltText(/food pizza cheesy/i);
    expectFindText(/Total: [$]42.88/i);
    clickRadio(/DRINK/i);
    clickFindAltText(/330 mL/i);
    expectFindText(/Total: [$]44.08/i);
    clickFindButton(/add Sprite can - 330 mL/i);
    clickFindButton(/add Sprite can - 330 mL/i);
    expectFindText(/Total: [$]46.48/i);
    clickFindButton(/remove Sprite can - 330 mL/i);
    expectFindText(/Total: [$]45.28/i);
    clickFindButton(/delete pizza cheesy/i);
    expectFindText(/Total: [$]17.30/i);
  });
});
