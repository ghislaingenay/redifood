import { screen, waitFor } from "@testing-library/react";
import { render } from "../..";
import CurrentOrder from "../../../pages/orders/[id]";
import { clickRadio, expectFindText, findButton, findRadio, findText } from "../../../src/functions/testhelpers.fn";
import { mockOneOrder } from "../../mocks/mockOrdersData";
jest.mock("next/navigation", () => require("next-router-mock"));
const successPropsOrderId = { currentOrder: mockOneOrder, status: "success" };
const mockOrderPaid = { ...mockOneOrder, orderStatus: "COMPLETE" };
const paidOrderProps = { currentOrder: mockOrderPaid, status: "success" };

describe("Order - Unit Testing", () => {
  it("render without crashing", () => {
    render(<CurrentOrder {...successPropsOrderId} />);
    expect(true).toBe(true);
  });

  it("should find a order # heading", () => {
    const { getByText } = render(<CurrentOrder {...successPropsOrderId} />);
    expect(getByText("Order #")).toBeInTheDocument();
  });

  // put all the text that is planned here
  it("Should display the information regarding the order", () => {
    render(<CurrentOrder {...successPropsOrderId} />);
    [/order #/i, /date/i, /table/i].forEach(async (text: any) => {
      expect(await findText(text)).toBeInTheDocument();
    });
  });
  it("should have a table with 6 rows (head + 2 food + total + taxes + total after taxes", async () => {
    render(<CurrentOrder {...successPropsOrderId} />);
    expect(await screen.findAllByRole("row")).toHaveLength(5);
    expect(await screen.findAllByRole("table")).toHaveLength(1);
    expect(await screen.findAllByRole("rowgroup")).toHaveLength(2);
    expect(await screen.findAllByRole("columnheader")).toHaveLength(4);
    expect(await screen.findAllByRole("gridcell")).toHaveLength(20);
  });
  it("should contain a disabled button 'PAY'", async () => {
    render(<CurrentOrder {...successPropsOrderId} />);
    console.log("byn", await screen.findByRole("button"));
    // await waitFor(() => {
    expect(await findButton(/PAY/i)).toBeInTheDocument();
    // });
  });
  it("should have 2 radio button (cash and card)", async () => {
    render(<CurrentOrder {...successPropsOrderId} />);
    expect(await findRadio(/cash/i)).toBeInTheDocument();
    expect(await findRadio(/card/i)).toBeInTheDocument();
    expect(await findRadio(/card/i)).not.toBeChecked();
    expect(await findRadio(/cash/i)).not.toBeChecked();
  });
  it("pay button should be enabled when a radio button is selected", async () => {
    render(<CurrentOrder {...successPropsOrderId} />);
    expect(await findButton(/PAY/i)).toBeDisabled();
    await clickRadio(/cash/i);
    expect(await findButton(/PAY/i)).toBeEnabled();
    expect(await findRadio(/card/i)).not.toBeChecked();
    expect(await findRadio(/cash/i)).toBeChecked();
    expect(await findButton(/PAY/i)).toBeEnabled();
  });

  it('user selects "cash" and clicks "PAY" button', async () => {
    render(<CurrentOrder {...successPropsOrderId} />);
    await clickRadio(/cash/i);
    expect(await findButton(/PAY/i)).toBeEnabled();
    expect(await findRadio(/cash/i)).toBeChecked();
    expect(await findRadio(/card/i)).not.toBeChecked();
    await clickRadio(/card/i);
    expect(await findRadio(/cash/i)).not.toBeChecked();
    expect(await findRadio(/card/i)).toBeChecked();
  });
});

describe("Order - Paid Order", () => {
  it("should contains the order list", async () => {
    render(<CurrentOrder {...paidOrderProps} />);
    expect(await screen.findAllByRole("row")).toHaveLength(5);
    expect(await screen.findAllByRole("table")).toHaveLength(1);
    expect(await screen.findAllByRole("rowgroup")).toHaveLength(2);
    expect(await screen.findAllByRole("columnheader")).toHaveLength(4);
    expect(await screen.findAllByRole("gridcell")).toHaveLength(20);
  });
  it("should contains the order info", async () => {
    render(<CurrentOrder {...paidOrderProps} />);
    [/order #/i, /date/i, /table/i].forEach(async (text: any) => {
      expect(await findText(text)).toBeInTheDocument();
    });
  });
  it("should display paid order", async () => {
    render(<CurrentOrder {...paidOrderProps} />);
    await expectFindText(/paid/i);
  });
  it("should not have payment choice", async () => {
    render(<CurrentOrder {...paidOrderProps} />);
    await waitFor(() => {
      expect(screen.queryByRole("radio")).not.toBeInTheDocument();
    });
  });
  it("should not have pay button", async () => {
    render(<CurrentOrder {...paidOrderProps} />);
    console.log("hey", successPropsOrderId);
    await waitFor(() => {
      expect(screen.queryByRole("button", { name: /pay/i })).not.toBeInTheDocument();
    });
  });
});
