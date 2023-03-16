import { Alert, Divider, InputNumber, Space, Typography } from "antd";
import { useTranslation } from "next-i18next";
import { ORANGE, RED } from "../../constants";
import { useFood } from "../../contexts/food.context";
import { calculateTotal } from "../../functions/order.fn";
import useCurrency from "../../hooks/useCurrency.hook";
import { EButtonType, EFoodMode, IFood } from "../../interfaces";
import { AnimButton } from "../../styles/animations/styled.anim";
import { Scroll } from "../../styles/styledComponents/div.styled";
import { CenteredTitle } from "../../styles/styledComponents/typography.styled";
import { RediButton } from "../styling/Button.style";
import { RowCenter } from "../styling/grid.styled";
import FoodOrderCard from "./FoodOrderCard";
const { Title } = Typography;

interface IOrderSectionProps {
  tableNumber: number | null;
  setTableNumber: (value: number | null) => void;
  mode: EFoodMode;
  errorTable: { alreadyInDb: boolean; missingValue: boolean };
  handleSubmit: (foodOrder: IFood[]) => void;
  handleCancel: (url: string) => void;
}

const OrderSection = ({
  tableNumber,
  setTableNumber,
  mode,
  errorTable,
  handleSubmit,
  handleCancel,
}: IOrderSectionProps) => {
  const { t } = useTranslation("");
  const { convertPrice } = useCurrency();
  const { foodOrder } = useFood();
  const isCreateMode = mode === EFoodMode.CREATE ? true : false;
  const isVisible = foodOrder.length > 0 ? "visible" : "hidden";
  const isDisabled = foodOrder.length === 0 ? true : false;

  return (
    <>
      <RowCenter>
        <Title level={5} aria-label="Table number">
          {t("orders.table-number")}:
        </Title>
        <InputNumber
          type="number"
          value={tableNumber}
          onChange={(e) => {
            if (typeof e === "number") {
              setTableNumber(Number(e));
            } else {
              setTableNumber(null);
            }
          }}
          disabled={!isCreateMode ? true : false}
          name="tableNumber"
          min={0}
          aria-label="tableNumber"
          style={{ height: "50%", top: "0.5rem", marginLeft: "1rem" }}
          placeholder="Select a table number"
        />
        {errorTable.alreadyInDb && <Alert type="error" message={t("orders.error-type.allocated-table")} />}
        {errorTable.missingValue && <Alert type="error" message={t("orders.error-type.missing-table")} />}
      </RowCenter>
      {mode === EFoodMode.EDIT && (
        <RowCenter>
          <Title style={{ margin: 0 }} level={5} aria-label="Order #">
            {t("orders.order")} #
          </Title>
        </RowCenter>
      )}
      {mode !== EFoodMode.EDIT && <Divider style={{ border: `0.125rem solid ${ORANGE}` }} />}
      <CenteredTitle level={5} aria-label="Order List">
        {t("orders.order-list")}
      </CenteredTitle>
      <Scroll>
        {foodOrder?.map((food) => (
          <FoodOrderCard key={food.itemId} food={food} />
        ))}
      </Scroll>
      <CenteredTitle level={5} style={{ color: RED, visibility: isVisible }}>
        Total: {convertPrice(Number(calculateTotal(foodOrder)), "backToFront", true)}
      </CenteredTitle>
      <RowCenter style={{ marginTop: "1rem" }}>
        <AnimButton>
          <Space>
            <RediButton
              buttonType={EButtonType.SUCCESS}
              shape="round"
              aria-label="Validate"
              disabled={isDisabled}
              onClick={() => handleSubmit(foodOrder)}
            >
              <b>{t("buttons.validate")}</b>
            </RediButton>

            <RediButton
              buttonType={EButtonType.ERROR}
              shape="round"
              onClick={() => handleCancel("/")}
              aria-label="cancel order"
            >
              {t("buttons.cancel-order")}
            </RediButton>
          </Space>
        </AnimButton>
      </RowCenter>
    </>
  );
};

export default OrderSection;
