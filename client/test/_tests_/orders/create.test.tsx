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
jest.mock("next/navigation", () => require("next-router-mock"));
jest.setTimeout(10000);
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
  it("should show a cancel button", async () => {
    render(<CreateOrder {...createSuccessProps} />);
    expect(await screen.findByRole("button", { name: /Cancel order/i })).toBeInTheDocument();
  });
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

  it("should add one quantity to the food if already in the cart via order cart list", async () => {
    render(<CreateOrder {...createSuccessProps} />);
    const user = userEvent.setup();
    const findProfiteroles = await screen.findByAltText(/Food profiteroles/i);
    expect(await screen.findAllByAltText(/Food profiteroles/i)).toHaveLength(1);
    await user.click(findProfiteroles);
    expect(await screen.findByText(/Total: 3.75/i)).toBeInTheDocument();
    await user.click(await screen.findByRole("img", { name: /add profiteroles/i }));
    expect(await screen.findByText(/Total: 7.50/i)).toBeInTheDocument();
  });

  it("button remove button is deactivated when quantity is 1", async () => {
    render(<CreateOrder {...createSuccessProps} />);
    const user = userEvent.setup();
    const findProfiteroles = await screen.findByAltText(/Food profiteroles/i);
    expect(await screen.findAllByAltText(/Food profiteroles/i)).toHaveLength(1);
    await user.click(findProfiteroles);
    expect(await screen.findByText(/Total: 3.75/i)).toBeInTheDocument();
    expect(await screen.findByRole("button", { name: /remove profiteroles/i })).toBeDisabled();
  });

  it("should the button remove should be activated when quantity is 2", async () => {
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

  it("should be able to remove one food quantity inside the order when clicking on the food card", async () => {
    render(<CreateOrder {...createSuccessProps} />);
    const user = userEvent.setup();
    await user.click(await screen.findByAltText(/Food profiteroles/i));
    expect(await screen.findByText(/Total: 3.75/i)).toBeInTheDocument();
    await user.click(await screen.findByAltText(/Food millefeuille/i));
    expect(await screen.findByText(/Total: 8.00/i)).toBeInTheDocument();
    await user.click(await screen.findByRole("button", { name: /delete profiteroles/i }));
    expect(await screen.findByText(/Total: 4.25/i)).toBeInTheDocument();
  });

  it("should be able to cancel the order when clicking on the cancel button if cart is empty", async () => {
    render(<CreateOrder {...createSuccessProps} />);
    const user = userEvent.setup();
    await user.click(await screen.findByRole("button", { name: /Cancel order/i }));
    await waitFor(() => {
      expect(screen.queryByText(/Are u sure you want to cancel?/i)).toBe(null);
    });
  });

  it("should show a cancel confirmation button to user if orer cart is not empty", async () => {
    render(<CreateOrder {...createSuccessProps} />);
    const user = userEvent.setup();
    expect(screen.queryByText(/Are u sure you want to cancel/i)).toBe(null);
    await user.click(screen.getByText(/espresso/i));
    await user.click(screen.getByRole("button", { name: /Cancel order/i }));
    expect(await screen.findByText(/Are u sure you want to cancel/i)).toBeInTheDocument();
  });

  // This element will be tested in e2e testing
  it.todo("show ask to cancel order if order is not empty and user click outside the foodlayout");
  //

  it.todo("should send a success notification when the order was successfully saved");
  it.todo("should send an error notification when the order was not saved");
});

describe("Create Order - Integration Testing", () => {
  it("User order multiple products and click on the cancel button", async () => {
    render(<CreateOrder {...createSuccessProps} />);
    const user = userEvent.setup();
    await user.click(await screen.findByAltText(/food millefeuille/i));
    expect(await screen.findByText(/Total: 4.25/i)).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText(/PIZZA/i));
    expect(await screen.findAllByRole("card")).toHaveLength(3); // 2 pizza + & order card
    await user.click(await screen.findByAltText(/food pizza cheesy/i));
    await user.click(await screen.findByAltText(/food pizza cheesy/i));
    expect(await screen.findByText(/Total: 32.23/i)).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText(/DRINK/i));
    await user.click(await screen.findByAltText(/330 mL/i));
    expect(await screen.findByText(/Total: 33.43/i)).toBeInTheDocument();
    await user.click(await screen.findByRole("button", { name: /add Sprite can - 330 mL/i }));
    await user.click(await screen.findByRole("button", { name: /add Sprite can - 330 mL/i }));
    expect(await screen.findByText(/Total: 35.83/i)).toBeInTheDocument();
    await user.click(await screen.findByRole("button", { name: /remove Sprite can - 330 mL/i }));
    expect(await screen.findByText(/Total: 34.63/i)).toBeInTheDocument();
    await user.click(await screen.findByRole("button", { name: /delete pizza cheesy/i }));
    expect(await screen.findByText(/Total: 6.65/i)).toBeInTheDocument();
    await user.type(screen.getByRole("spinbutton", { name: /tableNumber/i }), "2");
    await user.click(screen.getByRole("button", { name: /Cancel order/i }));
    expect(await screen.findByText(/Are u sure you want to cancel?/i));
    expect(await screen.findByRole("button", { name: /OK/i })).toBeEnabled();
  });

  it("User order multiple products but remove all of them, can't validate order, so cancel it", async () => {
    render(<CreateOrder {...createSuccessProps} />);
    const user = userEvent.setup();
    fireEvent.click(screen.getByLabelText(/DESSERT/i));
    expect(await screen.findAllByRole("card")).toHaveLength(3);
    await user.click(await screen.findByAltText(/food carrot cake/i));
    expect(await screen.findByText(/Total: 5.20/i)).toBeInTheDocument();
    await user.click(await screen.findByRole("button", { name: /add carrot cake/i }));
    await user.click(await screen.findByRole("button", { name: /add carrot cake/i }));
    await user.click(await screen.findByRole("button", { name: /add carrot cake/i }));
    await user.click(await screen.findByRole("button", { name: /add carrot cake/i }));
    expect(await screen.findByText(/Total: 26.00/i)).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText(/PIZZA/i));
    await user.click(await screen.findByAltText(/pizza mediterranean/i));
    await user.click(await screen.findByRole("button", { name: /add pizza mediterranean/i }));
    await user.click(await screen.findByRole("button", { name: /add pizza mediterranean/i }));
    expect(await screen.findByText(/Total: 63.50/i)).toBeInTheDocument();
    await user.click(await screen.findByRole("button", { name: /remove pizza mediterranean/i }));
    expect(await screen.findByText(/Total: 51.00/i)).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText(/DRINK/i));
    await user.click(await screen.findByAltText(/espresso/i));
    expect(await screen.findByText(/Total: 52.00/i)).toBeInTheDocument();
    expect(await screen.findByRole("button", { name: /remove espresso/i })).toBeDisabled();
    await user.click(await screen.findByRole("button", { name: /delete espresso/i }));
    expect(await screen.findByText(/Total: 51.00/i)).toBeInTheDocument();
    await user.click(await screen.findByRole("button", { name: /delete pizza mediterranean/i }));
    expect(await screen.findByRole("button", { name: /Validate/i })).toBeEnabled();
    await user.click(await screen.findByRole("button", { name: /delete carrot cake/i }));
    expect(await screen.findByRole("button", { name: /Validate/i })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: /Cancel order/i }));
    await waitFor(() => {
      expect(screen.queryByText(/Are u sure you want to cancel?/i)).toBe(null);
    });
  });

  // These two test will be the same the outcome will be different (show 2 differents notificqtions)
  // Write the code directly
  it.todo("User order multiple products and click on the validate button - succesfully saved");
  it.todo("User order multiple products and click on the validate button - failed to save it");
});
