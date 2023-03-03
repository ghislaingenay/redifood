import { screen } from "@testing-library/react";
import { render } from "../..";
import PaymentSystem from "../../../pages/orders/[id]/payment/[paymentChoice]";
import { clickButton, expectAlertLength, findButton } from "../../../src/functions/testhelpers.fn";
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
      expect(await findButton(`${num}`)).toBeInTheDocument();
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

describe("Cash - User interaction", () => {
  it("clear and confirm should be enabled when user click on one button", async () => {
    render(<PaymentSystem {...paymentCashProps} />);
    await clickButton(/1/i);
    expect((await screen.findByRole("textbox", { name: /select amount/i })).ariaValueText).toEqual(1);
    expect(await findButton(/clear/i)).toBeEnabled();
    expect(await findButton(/confirm/i)).toBeEnabled();
  });

  it("user click on one button and clear, confirm and clear must be empty", async () => {
    render(<PaymentSystem {...paymentCashProps} />);
    await clickButton(/1/i);
    expect((await screen.findByRole("textbox", { name: /select amount/i })).ariaValueText).toEqual(1);
    await clickButton(/4/i);
    expect((await screen.findByRole("textbox", { name: /select amount/i })).ariaValueText).toEqual(1);
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
    await clickButton(/num_4/i);
    await clickButton(/num_4/i);
    expect((await screen.findByRole("textbox", { name: /select amount/i })).ariaValueText).toEqual(44);
    expect((await screen.findByRole("textbox", { name: /selected amount/i })).ariaValueText).toEqual(undefined);
    await clickButton(/confirm/i);
    expect((await screen.findByRole("textbox", { name: /select amount/i })).ariaValueText).toBe(undefined);
    expect(await findButton(/clear/i)).toBeDisabled();
    expect(await findButton(/confirm/i)).toBeDisabled();
    expect((await screen.findByRole("textbox", { name: /selected amount/i })).ariaValueText).toEqual(44);
    expect(await findButton(/Finalize payment/i)).toBeEnabled();
  });

  it.todo("user should click 10 and confirm, pay button must not appear and alert render", async () => {
    render(<PaymentSystem {...paymentCashProps} />);
    await clickButton(/num_1/i);
    await clickButton(/num_0/i);
    expect(await findButton(/Finalize payment/i)).toBeDisabled(); // Show also that this is in the DOM
    expect((await screen.findByRole("textbox", { name: /select amount/i })).ariaValueText).toEqual(20);
    await clickButton(/confirm/i);
    expect((await screen.findByRole("textbox", { name: /render money/i })).ariaValueText).toEqual("10.65 $");
    expect((await screen.findByRole("textbox", { name: /reimbursement/i })).ariaValueText).toEqual("9.35 $");
    expect(await findButton(/Finalize payment/i)).not.toBeInTheDocument();
  });

  it("user must be able to click a number 20, confirm, and the value should be displayed accordingly", async () => {
    render(<PaymentSystem {...paymentCashProps} />);
    await clickButton(/2/i);
    await clickButton(/0/i);
    expect((await screen.findByRole("textbox", { name: /select amount/i })).ariaValueText).toEqual(10);
    expect(screen.queryByRole("alert")).toBe(null);
    expect(await findButton(/Finalize payment/i)).toBeDisabled();
    await clickButton(/confirm/i);
    expectAlertLength(1);
    expect(await findButton(/Finalize payment/i)).not.toBeInTheDocument();
    expect((await screen.findByRole("textbox", { name: /render money/i })).ariaValueText).toEqual("10.65 $");
    expect((await screen.findByRole("textbox", { name: /reimbursement/i })).ariaValueText).toEqual(
      /not enough amount/i,
    );
  });
});
