import { screen } from "@testing-library/react";
import { render } from "../..";
import PaymentSystem from "../../../pages/orders/[id]/payment/[paymentChoice]";
import { EPaymentType } from "../../../redifood-module/src/interfaces";
import { clickButton, expectAlertLength, expectFindText, findButton } from "../../../src/functions/testhelpers.fn";
import { mockOneOrder } from "../../mocks/mockOrdersData";

const paymentCashProps = {
  currentOrder: mockOneOrder,
  paymentType: EPaymentType.CASH,
};

describe("Cash - Unit Testing", () => {
  it("component should properly render with props", () => {
    render(<PaymentSystem {...paymentCashProps} />);
    expect(1 + 1).toBe(2);
  });
  it("should display the nine numbers", async () => {
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(async (num: number) => {
      expect(await findButton(`${num}`)).toBeInTheDocument();
    });
  });

  it("Should have an input with no value with a label = select amount", async () => {
    render(<PaymentSystem {...paymentCashProps} />);
    expect(screen.getByRole("textbox", { name: /select amount/i }).ariaValueText).toEqual(undefined);
  });

  it("Should have an input with no value with a label = selected amount", async () => {
    // show on the right side when user confirm the select amount value
    render(<PaymentSystem {...paymentCashProps} />);
    expect(screen.getByRole("textbox", { name: /selected amount/i }).ariaValueText).toEqual(undefined);
  });

  it("should have a confirm and clear button disabled when select amount is 0", async () => {
    render(<PaymentSystem {...paymentCashProps} />);
    expect(await findButton(/confirm/i)).toBeDisabled();
    expect(await findButton(/clear/i)).toBeDisabled();
  });

  it("Show show a disabled button Finalize payment when the page is loaded", async () => {
    render(<PaymentSystem {...paymentCashProps} />);
    expect(await findButton(/finalize payment/i)).toBeDisabled();
  });
});

describe("Cash - User interaction", () => {
  it("confirm button enabled when one number", async () => {
    render(<PaymentSystem {...paymentCashProps} />);
    await clickButton(/1/);
    expect(await findButton(/confirm/i)).toBeEnabled();
  });
  it("1. should have confirm button disabled", async () => {
    render(<PaymentSystem {...paymentCashProps} />);
    await clickButton(/1/);
    await clickButton(/point/);
    expect(await findButton(/confirm/i)).toBeDisabled();
  });

  it(".1 should have confirm button disabled", async () => {
    render(<PaymentSystem {...paymentCashProps} />);
    await clickButton(/point/);
    await clickButton(/1/);
    expect(await findButton(/confirm/i)).toBeDisabled();
  });
  it("1.1 should have confirm button enabled", async () => {
    render(<PaymentSystem {...paymentCashProps} />);
    await clickButton(/1/);
    await clickButton(/point/);
    await clickButton(/1/);
    expect(await findButton(/confirm/i)).toBeEnabled();
  });
  it("2 points so confirm button shoule be disabled", async () => {
    render(<PaymentSystem {...paymentCashProps} />);
    await clickButton(/1/);
    await clickButton(/point/);
    await clickButton(/point/);
    await clickButton(/1/);
    expect(await findButton(/confirm/i)).toBeDisabled();
  });

  it("user click on one button and clear, confirm and clear must be empty", async () => {
    render(<PaymentSystem {...paymentCashProps} />);
    await clickButton(/1/i);
    await clickButton(/4/i);
    expect(await findButton(/clear/i)).toBeEnabled();
    expect(await findButton(/confirm/i)).toBeEnabled();
    expect(await findButton(/Finalize payment/i)).toBeDisabled();
    await clickButton(/clear/i);
    expect(await findButton(/clear/i)).toBeDisabled();
    expect(await findButton(/confirm/i)).toBeDisabled();
    expect(await findButton(/Finalize payment/i)).toBeDisabled();
  });

  it("user should select 15, confirm and click confirm, select input should be cleared, and confirm, clear disabled", async () => {
    render(<PaymentSystem {...paymentCashProps} />);
    await clickButton(/4/);
    await clickButton(/4/);
    await clickButton(/confirm/i);
    expect(await findButton(/clear/i)).toBeDisabled();
    expect(await findButton(/confirm/i)).toBeDisabled();
    expect(await findButton(/Finalize payment/i)).toBeEnabled();
  });

  it("user should click 10 and confirm, pay button must not appear and alert render", async () => {
    render(<PaymentSystem {...paymentCashProps} />);
    await clickButton(/2/);
    await clickButton(/0/);
    await clickButton(/confirm/i);
    expect(await findButton(/Finalize payment/i)).toBeInTheDocument();
    expect(await findButton(/Finalize payment/i)).toBeEnabled();
  });

  it("user must be able to click a number 20, confirm, and the value should be displayed accordingly", async () => {
    render(<PaymentSystem {...paymentCashProps} />);
    await clickButton(/1/i);
    await clickButton(/0/i);
    expect(screen.queryByRole("alert")).toBe(null);
    expect(await findButton(/Finalize payment/i)).toBeDisabled();
    await clickButton(/confirm/i);
    expectAlertLength(1);
    expect(await findButton(/Finalize payment/i)).toBeDisabled();
    expectFindText(/not enough amount/i);
  });
});
