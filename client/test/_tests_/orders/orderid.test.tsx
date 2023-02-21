import { render } from "../..";
import CurrentOrder from "../../../pages/orders/[id]";
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
  it.only("Should display the information regarding the order");
  it.only("should have a table with 6 rows (head + 2 food + total + taxes + total after taxes");
  it.only("should contain a disabled button 'PAY'");
  it.only("should have 2 radio button (cash and card)");
  it.only("pay button should be enabled when a radio button is selected");
});
