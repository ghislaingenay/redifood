import { render } from "../..";
import CurrentOrder from "../../../pages/orders/[id]";
import { clickRadio, findButton, findRadio, findText } from "../../../src/functions/testhelpers.fn";
import { mockOneOrder } from "../../mocks/mockOrdersData";

const successPropsOrderId = { currentOrder: mockOneOrder, status: "success" };

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
  it("Should display the information regarding the order", async () => {
    [/order number/i, /date/i, /time/i, /table/i, /waiter/i].forEach((text: any) => {
      render(<CurrentOrder {...successPropsOrderId} />);
      expect(findText(text)).toBeInTheDocument();
    });
  });
  it("should have a table with 6 rows (head + 2 food + total + taxes + total after taxes", () => {
    render(<CurrentOrder {...successPropsOrderId} />);
    expect(document.querySelectorAll("table tr")).toHaveLength(6);
  });
  it("should contain a disabled button 'PAY'", () => {
    render(<CurrentOrder {...successPropsOrderId} />);
    expect(findButton(/PAY/i)).toBeDisabled();
  });
  it("should have 2 radio button (cash and card)", () => {
    render(<CurrentOrder {...successPropsOrderId} />);
    expect(findRadio(/cash/i)).toBeInTheDocument();
    expect(findRadio(/credit/i)).toBeInTheDocument();
    expect(findRadio(/credit/i)).not.toBeChecked();
    expect(findRadio(/cash/i)).not.toBeChecked();
  });
  it("pay button should be enabled when a radio button is selected", () => {
    render(<CurrentOrder {...successPropsOrderId} />);
    expect(findButton(/PAY/i)).toBeDisabled();
    clickRadio(/cash/i);
    expect(findButton(/PAY/i)).toBeEnabled();
    expect(findRadio(/credit/i)).toBeChecked();
    expect(findButton(/PAY/i)).toBeEnabled();
  });
  it('user selects "cash" and clicks "PAY" button', () => {
    render(<CurrentOrder {...successPropsOrderId} />);
    clickRadio(/cash/i);
    expect(findButton(/PAY/i)).toBeEnabled();
    expect(findRadio(/cash/i)).toBeChecked();
    expect(findRadio(/credit/i)).not.toBeChecked();
    clickRadio(/credit/i);
    expect(findRadio(/cash/i)).not.toBeChecked();
    expect(findRadio(/credit/i)).toBeChecked();
  });
});
