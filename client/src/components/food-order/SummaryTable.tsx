import { Col, Typography } from "antd";
import { BACKGROUND_COLOR, GREY, ORANGE_DARK } from "../../constants";
import { hexToRgba } from "../../functions/global.fn";
import { IFood, IOrder } from "../../interfaces";
import { CenteredP, CenteredTitle } from "../../styles";
import { RowSpaceAround } from "../styling/grid.styled";
const { Title } = Typography;

interface ISummaryTable {
  order: IOrder;
  xSize?: number;
  sSize?: number;
  mSize?: number;
  lSize?: number;
}

const noMP = { margin: 0, padding: 0 };

const headerColumns = ["FOOD", "QTY", "PRICE (ua)", "TOTAL"];

const SummaryTable = ({ order, xSize, sSize, mSize, lSize }: ISummaryTable) => {
  const lgValue = lSize || 5;
  const mdValue = mSize || 5;
  const sValue = sSize || 5;
  const xsValue = xSize || 5;
  const { orderItems, orderTotal } = order;
  const sizeProps = { lg: lgValue, xs: xsValue, sm: sValue, md: mdValue };
  return (
    <div role="table" style={{ width: "100%", margin: "2rem 0" }}>
      <div style={{ ...noMP }} role="rowgroup">
        <RowSpaceAround
          role="rowheader"
          style={{ ...noMP, backgroundColor: hexToRgba(BACKGROUND_COLOR, 1), color: "white" }}
        >
          {headerColumns.map((item: string, index: number) => {
            return (
              <Col {...sizeProps} key={index} role="columnheader">
                <CenteredTitle style={{ ...noMP, color: "white" }} level={5}>
                  {item}
                </CenteredTitle>
              </Col>
            );
          })}
        </RowSpaceAround>
      </div>
      <div role="rowgroup">
        {orderItems.map((food: IFood, index: number) => {
          const indexEven = index % 2 === 0 ? hexToRgba(ORANGE_DARK, 0.3) : hexToRgba(ORANGE_DARK, 0.5);
          return (
            <RowSpaceAround
              key={index}
              role="row"
              style={{ backgroundColor: indexEven, borderBottom: `2px solid ${hexToRgba(GREY, 0.3)}` }}
            >
              <Col {...sizeProps} role="gridcell">
                <CenteredP>{food.itemName}</CenteredP>
              </Col>
              <Col {...sizeProps} role="gridcell">
                <CenteredP>{food.itemQuantity}</CenteredP>
              </Col>
              <Col {...sizeProps} role="gridcell">
                <CenteredP>{food.itemPrice}</CenteredP>
              </Col>
              <Col {...sizeProps} role="gridcell">
                <CenteredP>{(food.itemPrice * food.itemQuantity).toFixed(2)}</CenteredP>
              </Col>
            </RowSpaceAround>
          );
        })}
        <RowSpaceAround role="row" style={{ backgroundColor: hexToRgba(BACKGROUND_COLOR, 0.2) }}>
          <Col {...sizeProps} role="gridcell"></Col>
          <Col {...sizeProps} role="gridcell"></Col>
          <Col {...sizeProps} role="gridcell">
            <CenteredP>Total before VAT</CenteredP>
          </Col>
          <Col {...sizeProps} role="gridcell">
            <CenteredP>{orderTotal.toFixed(2)}$</CenteredP>
          </Col>
        </RowSpaceAround>
        <RowSpaceAround role="row" style={{ backgroundColor: hexToRgba(BACKGROUND_COLOR, 0.5) }}>
          <Col {...sizeProps} role="gridcell"></Col>
          <Col {...sizeProps} role="gridcell"></Col>
          <Col {...sizeProps} role="gridcell">
            <CenteredP>VAT(%)</CenteredP>
          </Col>
          <Col {...sizeProps} role="gridcell">
            <CenteredP>7</CenteredP>
          </Col>
        </RowSpaceAround>
        <RowSpaceAround role="row" style={{ backgroundColor: hexToRgba(BACKGROUND_COLOR, 1), color: "white" }}>
          <Col {...sizeProps} role="gridcell"></Col>
          <Col {...sizeProps} role="gridcell"></Col>
          <Col {...sizeProps} role="gridcell">
            <CenteredP>Total for payment</CenteredP>
          </Col>
          <Col {...sizeProps} role="gridcell">
            <CenteredP>{(orderTotal * 1.07).toFixed(2)}$</CenteredP>
          </Col>
        </RowSpaceAround>
      </div>
    </div>
  );
};

export default SummaryTable;
