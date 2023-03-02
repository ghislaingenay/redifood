import { screen } from "@testing-library/react";
import { render } from "../..";
import PaymentSystem from "../../../pages/orders/[id]/payment/[paymentChoice]";
import { findButton } from "../../../src/functions/testhelpers.fn";
import { EPaymentType } from "../../../src/interfaces";
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
      expect(await findButton(`num_${num}`)).toBeInTheDocument();
    });
  });

  it("Should have an input with no value with a label = select amount", async () => {
    render(<PaymentSystem {...paymentCashProps} />);
    expect(screen.getByRole("textbox", { name: /select amount/i }).ariaValueText).toEqual(undefined);
    expect(screen.getByRole("textbox", { name: /select amount/i })).toBeDisabled();
  });

  it("Should have an input with no value with a label = selected amount", async () => {
    // show on the right side when user confirm the select amount value
    render(<PaymentSystem {...paymentCashProps} />);
    expect(screen.getByRole("textbox", { name: /selected amount/i }).ariaValueText).toEqual(undefined);
    expect(screen.getByRole("textbox", { name: /selected amount/i })).toBeDisabled();
  });

  it("should have a confirm and clear button disabled when select amount is 0", async () => {
    render(<PaymentSystem {...paymentCashProps} />);
    expect(await findButton(/confirm/i)).toBeDisabled();
    expect(await findButton(/clear/i)).toBeDisabled();
  });

  it("should display an input labelled screen disabled with a null value", () => {
    render(<PaymentSystem {...paymentCashProps} />);
    expect(screen.getByRole("textbox", { name: /Amount to pay/i }).ariaValueText).toEqual("10.65 $");
  });

  it("should show an input to render the money disabled when the page is loaded", async () => {
    render(<PaymentSystem {...paymentCashProps} />);
    expect(screen.getByRole("textbox", { name: /render money/i }).ariaValueText).toEqual("10.65 $");
  });
  it("Show show a disabled button Finalize payment when the page is loaded", async () => {
    render(<PaymentSystem {...paymentCashProps} />);
    expect(await findButton(/finalize payment/i)).toBeDisabled();
  });
});

describe("Cash - User interaction", () => {});
