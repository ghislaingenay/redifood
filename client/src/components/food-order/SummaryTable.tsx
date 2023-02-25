import { Col, Typography } from "antd";
import { BACKGROUND_COLOR, ORANGE_DARK } from "../../constants";
import { hexToRgba } from "../../functions/global.fn";
import { IFood, IOrder } from "../../interfaces";
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

const headerColumns = ["FOOD", "QTY", "PRICE ua", "TOTAL"];

const SummaryTable = ({ order, xSize, sSize, mSize, lSize }: ISummaryTable) => {
  const lgValue = lSize || 7;
  const mdValue = mSize || 7;
  const sValue = sSize || 7;
  const xsValue = xSize || 7;
  const { orderItems, orderTotal } = order;
  const sizeProps = { lg: lgValue, xs: xsValue, sm: sValue, md: mdValue };
  return (
    <div role="table" style={{ width: "100%", ...noMP }}>
      <div style={{ ...noMP }} role="rowgroup">
        <RowSpaceAround role="rowheader">
          {headerColumns.map((item: string, index: number) => {
            return (
              <Col {...sizeProps} key={index} role="columnheader">
                <Title level={5}>{item}</Title>
              </Col>
            );
          })}
        </RowSpaceAround>
      </div>
      <div style={{ ...noMP }} role="rowgroup">
        {orderItems.map((food: IFood, index: number) => {
          const indexEven = index % 2 === 0 ? hexToRgba(ORANGE_DARK, 0.3) : hexToRgba(ORANGE_DARK, 0.5);
          return (
            <RowSpaceAround key={index} role="row" style={{ backgroundColor: indexEven }}>
              <Col {...sizeProps} role="gridcell">
                {food.itemName}
              </Col>
              <Col {...sizeProps} role="gridcell">
                {food.itemQuantity}
              </Col>
              <Col {...sizeProps} role="gridcell">
                {food.itemPrice}
              </Col>
              <Col {...sizeProps} role="gridcell">
                {(food.itemPrice * food.itemQuantity).toFixed(2)}
              </Col>
            </RowSpaceAround>
          );
        })}
        <RowSpaceAround role="row" style={{ backgroundColor: hexToRgba(BACKGROUND_COLOR, 0.2) }}>
          <Col {...sizeProps} role="gridcell"></Col>
          <Col {...sizeProps} role="gridcell"></Col>
          <Col {...sizeProps} role="gridcell">
            Total before VAT
          </Col>
          <Col {...sizeProps} role="gridcell">
            {orderTotal.toFixed(2)}$
          </Col>
        </RowSpaceAround>
        <RowSpaceAround role="row" style={{ backgroundColor: hexToRgba(BACKGROUND_COLOR, 0.5) }}>
          <Col {...sizeProps} role="gridcell"></Col>
          <Col {...sizeProps} role="gridcell"></Col>
          <Col {...sizeProps} role="gridcell">
            VAT(%)
          </Col>
          <Col {...sizeProps} role="gridcell">
            7
          </Col>
        </RowSpaceAround>
        <RowSpaceAround role="row" style={{ backgroundColor: hexToRgba(BACKGROUND_COLOR, 1), color: "white" }}>
          <Col {...sizeProps} role="gridcell"></Col>
          <Col {...sizeProps} role="gridcell"></Col>
          <Col {...sizeProps} role="gridcell">
            Total for payment
          </Col>
          <Col {...sizeProps} role="gridcell">
            {(orderTotal * 1.07).toFixed(2)}$
          </Col>
        </RowSpaceAround>
      </div>
    </div>
  );
};
