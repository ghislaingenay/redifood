import { Col } from "antd";
import { useTranslation } from "next-i18next";
import { useContext } from "react";
import { IFoodGetApi } from "../../../redifood-module/src/interfaces";
import { BACKGROUND_COLOR, GREY, ORANGE_DARK } from "../../constants";
import AppContext from "../../contexts/app.context";
import { hexToRgba } from "../../functions/global.fn";
import useCurrency from "../../hooks/useCurrency.hook";
import { CenteredP, CenteredTitle } from "../../styles";
import { RowSpaceAround } from "../styling/grid.styled";

interface ISummaryTable {
  orderTotal: number;
  foodList: IFoodGetApi[];
  xSize?: number;
  sSize?: number;
  mSize?: number;
  lSize?: number;
}

const SummaryTable = ({ orderTotal, xSize, sSize, mSize, lSize, foodList }: ISummaryTable) => {
  const noMP = { margin: 0, padding: 0 };
  const { t } = useTranslation("common");
  const {
    state: { vat },
  } = useContext(AppContext);
  const { convertPrice } = useCurrency();
  const lgValue = lSize || 5;
  const mdValue = mSize || 5;
  const sValue = sSize || 5;
  const xsValue = xSize || 5;
  const headerColumns = [
    { key: t("orders.summary-table.food"), label: "FOOD" },
    { key: t("orders.summary-table.quantity"), label: "QTY" },
    { key: t("orders.summary-table.price"), label: "PRICE" },
    { key: t("orders.summary-table.total"), label: "TOTAL" },
  ];
  const sizeProps = { lg: lgValue, xs: xsValue, sm: sValue, md: mdValue };
  return (
    <div role="table" style={{ width: "100%", margin: "2rem 0" }}>
      <div style={{ ...noMP }} role="rowgroup">
        <RowSpaceAround
          role="rowheader"
          style={{ ...noMP, backgroundColor: hexToRgba(BACKGROUND_COLOR, 1), color: "white" }}
        >
          {headerColumns.map(({ key, label }, index: number) => {
            return (
              <Col {...sizeProps} key={index} role="columnheader">
                <CenteredTitle style={{ ...noMP, color: "white" }} level={5} aria-label={label}>
                  {key}
                </CenteredTitle>
              </Col>
            );
          })}
        </RowSpaceAround>
      </div>
      <div role="rowgroup">
        {foodList.map((food, index: number) => {
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
                <CenteredP>{convertPrice(food.itemPrice, "backToFront", false)}</CenteredP>
              </Col>
              <Col {...sizeProps} role="gridcell">
                <CenteredP>{convertPrice(food.itemPrice * food.itemQuantity, "backToFront", false)}</CenteredP>
              </Col>
            </RowSpaceAround>
          );
        })}
        <RowSpaceAround role="row" style={{ backgroundColor: hexToRgba(BACKGROUND_COLOR, 0.2) }}>
          <Col {...sizeProps} role="gridcell"></Col>
          <Col {...sizeProps} role="gridcell"></Col>
          <Col {...sizeProps} role="gridcell">
            <CenteredP aria-label="Total before VAT">{t("orders.summary-table.tot-before-vat")}</CenteredP>
          </Col>
          <Col {...sizeProps} role="gridcell">
            <CenteredP>{convertPrice(orderTotal, "backToFront", true)}</CenteredP>
          </Col>
        </RowSpaceAround>
        <RowSpaceAround role="row" style={{ backgroundColor: hexToRgba(BACKGROUND_COLOR, 0.5) }}>
          <Col {...sizeProps} role="gridcell"></Col>
          <Col {...sizeProps} role="gridcell"></Col>
          <Col {...sizeProps} role="gridcell">
            <CenteredP aria-label="VAT (%)">{t("orders.summary-table.vat")}</CenteredP>
          </Col>
          <Col {...sizeProps} role="gridcell">
            <CenteredP>{vat}</CenteredP>
          </Col>
        </RowSpaceAround>
        <RowSpaceAround role="row" style={{ backgroundColor: hexToRgba(BACKGROUND_COLOR, 1), color: "white" }}>
          <Col {...sizeProps} role="gridcell"></Col>
          <Col {...sizeProps} role="gridcell"></Col>
          <Col {...sizeProps} role="gridcell">
            <CenteredP aria-label="Total for payment">{t("orders.summary-table.total-price")}</CenteredP>
          </Col>
          <Col {...sizeProps} role="gridcell">
            <CenteredP>{convertPrice(orderTotal * (1 + vat / 100), "backToFront", true)}</CenteredP>
          </Col>
        </RowSpaceAround>
      </div>
    </div>
  );
};

export default SummaryTable;
