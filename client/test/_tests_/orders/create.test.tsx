import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import CreateOrder, { getServerSideProps } from "../../../pages/orders/create";
import { convertApiDataToDbData } from "../../../src/functions/db.fn";
import { createErrorProps, createSuccessProps, mockedFoodData } from "../../../test/mocks/mockFoodData";
import { server } from "../../../test/mocks/server";

describe("Create Order - Server Side Props", () => {
  it.skip("should return food data if API call is successful", async () => {
    const response = await getServerSideProps();
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          foodList: mockedFoodData,
          status: "success",
        },
      }),
    );
  });

  it.skip("should return error if API call is unsuccessful", async () => {
    server.resetHandlers(
      rest.get("/api/orders", (req, res, ctx) => res(ctx.status(400), ctx.json({ foodList: [], status: "error" }))),
    );
    const response = await getServerSideProps();
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          foodList: [],
          status: "error",
        },
      }),
    );
  });
  it.skip("should send an error if the data is not properly recovered", async () => {
    render(<CreateOrder {...createErrorProps} />);
    await waitFor(() => {
      expect(screen.queryAllByRole("card")).toHaveLength(0);
    });
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(await screen.findByText(/please refresh the page/i)).toBeInTheDocument();
  });
});

describe("Create Order - Unit Testing", () => {
  it("renders without crashing", () => {
    render(<CreateOrder {...createSuccessProps} />);
    expect(screen.getByRole("heading", { name: /create order/i })).toBeInTheDocument();
  });

  it("test convertDataForAPI function", () => {
    expect(
      convertApiDataToDbData({ history_id: 1, user_order_new: 5678, order_status: true }, "sql", "dbToApi"),
    ).toStrictEqual({
      historyId: 1,
      userOrderNew: 5678,
      orderStatus: true,
    });
    expect(convertApiDataToDbData({ tableNumber: 1, orderId: 5678, orderPaid: true }, "sql", "apiToDb")).toStrictEqual({
      table_number: 1,
      order_id: 5678,
      order_paid: true,
    });
    expect(
      convertApiDataToDbData({ tableNumber: 1, orderId: 5678, orderPaid: true }, "db", "apiToDb"),
    ).not.toStrictEqual({
      table_number: 1,
      order_id: 5678,
      order_paid: true,
    });
    expect(convertApiDataToDbData({ tableNumber: 1, orderId: 5678, orderPaid: true }, "db", "apiToDb")).toStrictEqual({
      tableNumber: 1,
      orderId: 5678,
      orderPaid: true,
    });
  });

  it("should have a number input", () => {
    render(<CreateOrder {...createSuccessProps} />);
    expect(screen.getByRole("spinbutton")).toBeInTheDocument();
    expect(screen.getByLabelText(/Table number/i)).toBeInTheDocument();
  });

  it("should show an alert if table number is already allocated", async () => {
    render(<CreateOrder {...createSuccessProps} />);
    const user = userEvent.setup();
    // onFocus
    await user.type(screen.getByRole("spinbutton"), "1");
    // UNFOCUS
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText(/This table number is already allocated/i)).toBeInTheDocument();
  });

  it("Order cart should include a button to validate the order", () => {
    render(<CreateOrder {...createSuccessProps} />);
    expect(screen.getByRole("button", { name: /Validate/i })).toBeInTheDocument();
  });

  it("Validate button should not be enabled if the cart is empty", () => {
    render(<CreateOrder {...createSuccessProps} />);
    expect(screen.getByRole("button", { name: /Validate/i })).toBeDisabled();
  });

  it("Validate button should be enabled if the cart is not empty", async () => {
    render(<CreateOrder {...createSuccessProps} />);
    const user = userEvent.setup();
    await user.click(screen.getByText(/espresso/i));
    expect(screen.getByRole("button", { name: /Validate/i })).toBeEnabled();
  });

  it("should send an error and refresh the page if food data is not recovered", async () => {
    render(<CreateOrder {...createSuccessProps} />);
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(screen.getByText(/Error while loading food data/i)).toBeInTheDocument();
  });

  it("order cart should be empty when the page is loaded", () => {
    render(<CreateOrder {...createSuccessProps} />);
    expect(screen.getByRole("button", { name: /Validate/i })).toBeDisabled();
    mockedFoodData.forEach(async (food) => {
      expect(await screen.findAllByText(food.itemName)).toHaveLength(1);
    });
  });

  it("After fetching data, should obtain ALL, PIZZA, DRINK, DESSERT buttons", async () => {
    render(<CreateOrder {...createSuccessProps} />);
    expect(await screen.findByRole("button", { name: /ALL/i })).toBeEnabled();
    expect(await screen.findByRole("button", { name: /DESSERT/i })).toBeEnabled();
    expect(await screen.findByRole("button", { name: /DRINK/i })).toBeEnabled();
    expect(await screen.findByRole("button", { name: /PIZZA/i })).toBeEnabled();
  });

  it("DESSERT button selected should contains 3 cards", async () => {
    render(<CreateOrder {...createSuccessProps} />);
    const user = userEvent.setup();
    expect(await screen.findAllByRole("card")).toHaveLength(9);
    await user.click(screen.getByRole("button", { name: /DESSERT/i }));
    // expect some text food to be here and not to be here
  });

  it("ALL button should be selected when the page is loaded", async () => {
    render(<CreateOrder {...createSuccessProps} />);
    expect(await (await screen.findByRole("button", { name: /ALL/i })).ariaSelected).toBeTruthy();
    expect(await (await screen.findByRole("button", { name: /DESSERT/i })).ariaSelected).not.toBeTruthy();
    expect(await (await screen.findByRole("button", { name: /DRINK/i })).ariaSelected).not.toBeTruthy();
    expect(await (await screen.findByRole("button", { name: /PIZZA/i })).ariaSelected).not.toBeTruthy();
  });

  it("DRINK should be selected when clicked", async () => {
    render(<CreateOrder {...createSuccessProps} />);
    const user = userEvent.setup();
    expect(await (await screen.findByRole("button", { name: /ALL/i })).ariaSelected).toBeTruthy();
    expect(await (await screen.findByRole("button", { name: /DRINK/i })).ariaSelected).not.toBeTruthy();
    await user.click(screen.getByRole("button", { name: /DRINK/i }));
    expect(await screen.findAllByRole("card")).toHaveLength(4);
    expect(await (await screen.findByRole("button", { name: /ALL/i })).ariaSelected).not.toBeTruthy();
    expect(await (await screen.findByRole("button", { name: /DRINK/i })).ariaSelected).toBeTruthy();
  });

  it("ALL button selected should contains 9 cards", async () => {
    render(<CreateOrder {...createSuccessProps} />);
    expect(await (await screen.findByRole("button", { name: /ALL/i })).ariaSelected).toBeTruthy();
    expect(await screen.findAllByRole("card")).toHaveLength(9);
  });

  it("PIZZA button selected should contains 2 cards", async () => {
    render(<CreateOrder {...createSuccessProps} />);
    const user = userEvent.setup();
    expect(await screen.findAllByRole("card")).toHaveLength(9);
    await user.click(screen.getByRole("button", { name: /PIZZA/i }));
    expect(await screen.findAllByRole("card")).toHaveLength(2);
  });
  it("DRINK button selected should contains 4 cards", async () => {
    render(<CreateOrder {...createSuccessProps} />);
    const user = userEvent.setup();
    expect(await screen.findAllByRole("card")).toHaveLength(9);
    await user.click(screen.getByRole("button", { name: /DRINK/i }));
    expect(await screen.findAllByRole("card")).toHaveLength(4);
  });
  it("DESSERT button selected should contains 3 cards", async () => {
    render(<CreateOrder {...createSuccessProps} />);
    const user = userEvent.setup();
    expect(await screen.findAllByRole("card")).toHaveLength(9);
    await user.click(screen.getByRole("button", { name: /DRINK/i }));
    expect(await screen.findAllByRole("card")).toHaveLength(4);
  });
});

describe("Create Order - Integration", () => {
  it("should add food to the cart when clicking on the food card", () => {});
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
  it("should show an alert if table number is not selected", async () => {
    render(<CreateOrder {...createSuccessProps} />);
    const user = userEvent.setup();
    await user.click(screen.getByText(/espresso/i));
    await user.click(screen.getByRole("button", { name: /Validate/i }));
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(await screen.findByText(/Please select a table number/i)).toBeInTheDocument();
  });
});
