import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// import { rest } from "msw";
import CreateOrder from "../../../pages/orders/create"; // { getServerSideProps }
import { convertApiDataToDbData } from "../../../src/functions/db.fn";
import { sendErrorTableInput } from "../../../src/functions/order.fn";
import {
  // createErrorProps,
  createSuccessProps,
  mockedFoodData,
} from "../../../test/mocks/mockFoodData";
// import { server } from "../../../test/mocks/server";
import { render } from "../../index";
// describe("Create Order - Server Side Props", () => {
//   it("should return food data if API call is successful", async () => {
//     const response = await getServerSideProps();
//     expect(response).toEqual(
//       expect.objectContaining({
//         props: {
//           foodList: mockedFoodData,
//           status: "success",
//         },
//       }),
//     );
//   });

//   it.skip("should return error if API call is unsuccessful", async () => {
//     server.resetHandlers(
//       rest.get("/api/orders", (req, res, ctx) => res(ctx.status(400), ctx.json({ foodList: [], status: "error" }))),
//     );
//     const response = await getServerSideProps();
//     expect(response).toEqual(
//       expect.objectContaining({
//         props: {
//           foodList: [],
//           status: "error",
//         },
//       }),
//     );
//   });
//   it.skip("should send an error if the data is not properly recovered", async () => {
//     render(<CreateOrder {...createErrorProps} />);
//     await waitFor(() => {
//       expect(screen.queryAllByRole("card")).toHaveLength(0);
//     });
//     expect(await screen.findByRole("alert")).toBeInTheDocument();
//     expect(await screen.findByText(/please refresh the page/i)).toBeInTheDocument();
//   });
// });

describe("Function testing", () => {
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

  it("function that send error if table is already allocated", () => {
    expect(sendErrorTableInput(1, [1, 4, 5])).toStrictEqual({ alreadyInDb: true, missingValue: false });
    expect(sendErrorTableInput(3, [1, 4, 5])).toStrictEqual({ alreadyInDb: false, missingValue: false });
    expect(sendErrorTableInput(null, [1, 4, 5])).toStrictEqual({ alreadyInDb: false, missingValue: true });
    expect(sendErrorTableInput(0, [1, 4, 5])).toStrictEqual({ alreadyInDb: false, missingValue: true });
  });
});

describe("Create Order - Food List", () => {
  it("renders without crashing", () => {
    render(<CreateOrder {...createSuccessProps} />);
    expect(1 + 1).toEqual(2);
  });

  it("Page contains create order and and food list heading", async () => {
    render(<CreateOrder {...createSuccessProps} />);
    expect(screen.getByRole("heading", { name: /create order/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /food list/i })).toBeInTheDocument();
  });
  it("should have a number input", () => {
    render(<CreateOrder {...createSuccessProps} />);
    expect(screen.getByRole("spinbutton", { name: /TableNumber/i }).ariaValueText).toBe(undefined);
    expect(screen.getByRole("heading", { name: /Table Number/i })).toBeInTheDocument();
  });

  it("should show an alert if table number is already allocated", async () => {
    render(<CreateOrder {...createSuccessProps} />);
    const user = userEvent.setup();
    await user.type(screen.getByRole("spinbutton", { name: /tableNumber/i }), "1");
    await user.click(await screen.findByText(/espresso/i));
    await user.click(await screen.findByRole("button", { name: /validate/i }));
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(await screen.findByText(/This table number is already allocated/i)).toBeInTheDocument();
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
    const validateButton = screen.getByRole("button", { name: /Validate/i });
    expect(validateButton).toBeDisabled();
    await user.click(screen.getByText(/espresso/i));
    expect(validateButton).toBeEnabled();
  });

  // it("should send an error and refresh the page if food data is not recovered", async () => {
  //   render(<CreateOrder {...createErrorProps} />);
  //   expect(await screen.findByRole("alert")).toBeInTheDocument();
  //   expect(await screen.findByText(/An error occured/i)).toBeInTheDocument();
  //   expect(await screen.findByText(/Please refresh the page/i)).toBeInTheDocument();
  // });

  it("order cart should be empty when the page is loaded", () => {
    render(<CreateOrder {...createSuccessProps} />);
    expect(screen.getByRole("button", { name: /Validate/i })).toBeDisabled();
    mockedFoodData.forEach(async (food) => {
      expect(await screen.findAllByText(food.itemName)).toHaveLength(1);
    });
  });

  it("After fetching data, should obtain ALL, PIZZA, DRINK, DESSERT buttons", async () => {
    render(<CreateOrder {...createSuccessProps} />);
    expect(await screen.findByRole("radio", { name: /ALL/i })).toBeEnabled();
    expect(await screen.findByRole("radio", { name: /DESSERT/i })).toBeEnabled();
    expect(await screen.findByRole("radio", { name: /DRINK/i })).toBeEnabled();
    expect(await screen.findByRole("radio", { name: /PIZZA/i })).toBeEnabled();
  });

  it("DESSERT button selected should contains 3 cards", async () => {
    render(<CreateOrder {...createSuccessProps} />);
    expect(await screen.findAllByRole("card")).toHaveLength(9);
    fireEvent.click(screen.getByRole("radio", { name: /DESSERT/i }));
    [/Carrot cake/i, /Profiteroles/i, /Millefeuille/i].forEach(async (name) => {
      expect(await screen.findAllByText(name)).toHaveLength(1);
    });
    await waitFor(() => {
      [/espresso/i, /Pizza Cheesy/i].forEach((name) => {
        expect(screen.queryByText(name)).toBe(null);
      });
    });
  });

  it("ALL button should be selected when the page is loaded", async () => {
    render(<CreateOrder {...createSuccessProps} />);
    expect(await screen.findByRole("radio", { name: /ALL/i })).toBeChecked();
    expect(await screen.findByRole("radio", { name: /DESSERT/i })).not.toBeChecked();
    expect(await screen.findByRole("radio", { name: /DRINK/i })).not.toBeChecked();
    expect(await screen.findByRole("radio", { name: /PIZZA/i })).not.toBeChecked();
  });

  it("ALL button selected should contains 9 cards", async () => {
    render(<CreateOrder {...createSuccessProps} />);
    expect(await screen.findByRole("radio", { name: /ALL/i })).toBeChecked();
    expect(await screen.findAllByRole("card")).toHaveLength(9);
  });

  it("DRINK should be selected when clicked", async () => {
    render(<CreateOrder {...createSuccessProps} />);
    expect(await screen.findByRole("radio", { name: /ALL/i })).toBeChecked();
    expect(await screen.findByRole("radio", { name: /DRINK/i })).not.toBeChecked();
    fireEvent.click(screen.getByLabelText(/DRINK/i));
    expect(await screen.findAllByRole("card")).toHaveLength(4);
    expect(await screen.findByRole("radio", { name: /ALL/i })).not.toBeChecked();
    expect(await screen.findByRole("radio", { name: /DRINK/i })).toBeChecked();
  });

  it("PIZZA button selected should contains 2 cards", async () => {
    render(<CreateOrder {...createSuccessProps} />);
    expect(await screen.findAllByRole("card")).toHaveLength(9);
    fireEvent.click(screen.getByRole("radio", { name: /PIZZA/i }));
    expect(await screen.findAllByRole("card")).toHaveLength(2);
  });

  it("DRINK button selected should contains 4 cards", async () => {
    render(<CreateOrder {...createSuccessProps} />);
    expect(await screen.findAllByRole("card")).toHaveLength(9);
    fireEvent.click(screen.getByRole("radio", { name: /DRINK/i }));
    expect(await screen.findAllByRole("card")).toHaveLength(4);
  });

  it("DESSERT button selected should contains 3 cards", async () => {
    render(<CreateOrder {...createSuccessProps} />);
    expect(await screen.findAllByRole("card")).toHaveLength(9);
    fireEvent.click(screen.getByRole("radio", { name: /DRINK/i }));
    expect(await screen.findAllByRole("card")).toHaveLength(4);
  });

  it("should add food to the cart when clicking on the food card", async () => {
    render(<CreateOrder {...createSuccessProps} />);
    const user = userEvent.setup();
    await user.click(screen.getByText(/espresso/i));
    expect(await screen.findAllByText(/espresso/i)).toHaveLength(2);
  });

  it("should have the validate button enabled when a food is in the order cart", async () => {
    render(<CreateOrder {...createSuccessProps} />);
    expect(screen.getByRole("button", { name: /Validate/i })).toBeDisabled();
    const user = userEvent.setup();
    await user.click(screen.getByText(/profiteroles/i));
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Validate/i })).toBeEnabled();
    });
  });
  it("should have the total indicate when the user first add a product in order cart", async () => {
    render(<CreateOrder {...createSuccessProps} />);
    expect(screen.queryByText(/total/i)).toBe(null);
    const user = userEvent.setup();
    await user.click(screen.getByText(/profiteroles/i));
    expect(await screen.findByText(/total/i)).toBeInTheDocument();
  });
});

describe("Create Order - Integration", () => {
  it("should add food to the cart when clicking on the food card", async () => {
    render(<CreateOrder {...createSuccessProps} />);
    const user = userEvent.setup();
    expect(await screen.findAllByText(/espresso/i)).toHaveLength(1);
    await user.click(screen.getByText(/espresso/i));
    expect(await screen.findAllByText(/espresso/i)).toHaveLength(2);
    expect(await screen.findByText(1)).toBeInTheDocument();
  });
  it("should add one quantity to the food if already in the cart via food list", async () => {
    render(<CreateOrder {...createSuccessProps} />);
    const user = userEvent.setup();
    const findProfiteroles = await screen.findByAltText(/Food profiteroles/i);
    expect(screen.queryByText(/Total:/i)).toBe(null);
    expect(await screen.findAllByAltText(/Food profiteroles/i)).toHaveLength(1);
    await user.click(findProfiteroles);
    expect(await screen.findByText(/Total: 3.75/i)).toBeInTheDocument();
    await user.click(findProfiteroles);
    expect(await screen.findByText(/Total: 7.50/i)).toBeInTheDocument();
  });

  it.only("should add one quantity to the food if already in the cart via order cart list", async () => {
    render(<CreateOrder {...createSuccessProps} />);
    const user = userEvent.setup();
    const findProfiteroles = await screen.findByAltText(/Food profiteroles/i);
    expect(await screen.findAllByAltText(/Food profiteroles/i)).toHaveLength(1);
    await user.click(findProfiteroles);
    expect(await screen.findByText(/Total: 3.75/i)).toBeInTheDocument();
    await user.click(await screen.findByRole("img", { name: /add profiteroles/i }));
    expect(await screen.findByText(/Total: 7.50/i)).toBeInTheDocument();
  });

  it.only("button remove button is deactivated when quantity is 1", async () => {
    render(<CreateOrder {...createSuccessProps} />);
    const user = userEvent.setup();
    const findProfiteroles = await screen.findByAltText(/Food profiteroles/i);
    expect(await screen.findAllByAltText(/Food profiteroles/i)).toHaveLength(1);
    await user.click(findProfiteroles);
    expect(await screen.findByText(/Total: 3.75/i)).toBeInTheDocument();
    expect(await screen.findByRole("button", { name: /remove profiteroles/i })).toBeDisabled();
  });

  it.only("should the button remove should be activated when quantity is 2", async () => {
    render(<CreateOrder {...createSuccessProps} />);
    const user = userEvent.setup();
    const findProfiteroles = await screen.findByAltText(/Food profiteroles/i);
    expect(await screen.findAllByAltText(/Food profiteroles/i)).toHaveLength(1);
    await user.click(findProfiteroles);
    expect(await screen.findByRole("button", { name: /remove profiteroles/i })).toBeDisabled();
    await user.click(findProfiteroles);
    expect(await screen.findByText(/Total: 7.50/i)).toBeInTheDocument();
    expect(await screen.findByRole("button", { name: /remove profiteroles/i })).toBeEnabled();
  });

  it.todo("should be able to remove one food quantity inside the order when clicking on the food card");
  it.todo("should be able to delete one food inside the order when clicking on the food card");
  it.todo("should show confirm to user that the order has been created");
  it.todo("should show error to user if the order failed to be created");
  it.todo("should show a cancel confirmation button to user if orer cart is empty");
  it.todo("should be able to cancel the order when clicking on the cancel button if cart is empty");
  it.todo("should show a cancel confirmation button to user if orer cart is not empty");
  it.todo("show ask to cancel order if order is not empty and user click outside the foodlayout");
  // it("should show an alert if table number is not selected", async () => {
  //   render(<CreateOrder {...createSuccessProps} />);
  //   const user = userEvent.setup();
  //   await user.click(screen.getByText(/espresso/i));
  //   expect()
  //   await user.click(screen.getByRole("button", { name: /Validate/i }));
  //   expect(await screen.findByRole("alert")).toBeInTheDocument();
  //   expect(await screen.findByText(/Please select a table number/i)).toBeInTheDocument();
  // });
  it.todo("should send a success notification when the order was successfully saved");
  it.todo("should send an error notification when the order was not saved");
});
