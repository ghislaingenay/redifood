import { Divider, Space, Typography } from "antd";
import { useTranslation } from "next-i18next";
import { Else, If, Then } from "react-if";
import { IFoodApi } from "../../../redifood-module/src/interfaces";
import { ORANGE, RED } from "../../constants";
import { useFood } from "../../contexts/food.context";
import { calculateTotal } from "../../functions/order.fn";
import useCurrency from "../../hooks/useCurrency.hook";
import { EButtonType, EFoodMode } from "../../interfaces";
import { AnimButton } from "../../styles/animations/styled.anim";
import { Scroll } from "../../styles/styledComponents/div.styled";
import { CenteredTitle } from "../../styles/styledComponents/typography.styled";
import { RediButton } from "../styling/Button.style";
import { RowCenter } from "../styling/grid.styled";
import FoodOrderCard from "./FoodOrderCard";
const { Title } = Typography;

interface IOrderSectionProps {
  tableNumber: number | null;
  mode: EFoodMode;
  handleSubmit: (foodOrder: IFoodApi[]) => void;
  handleCancel: (url: string) => void;
  loading?: boolean;
}

const OrderSection = ({ tableNumber, mode, handleSubmit, handleCancel, loading }: IOrderSectionProps) => {
  const { t } = useTranslation("common");
  const { convertPrice } = useCurrency();
  const { foodOrder } = useFood();
  const isCreateMode = mode === EFoodMode.CREATE ? true : false;
  const isVisible = foodOrder.length > 0 ? "visible" : "hidden";
  const isDisabled = foodOrder.length === 0 ? true : false;

  return (
    <>
      <Space>
        <Title level={5} aria-label="Table number">
          {t("orders.table-number")}:
        </Title>
        <Title level={5}>{tableNumber}</Title>
      </Space>
      <If condition={isCreateMode}>
        <Then>
          <Divider style={{ border: `0.125rem solid ${ORANGE}` }} />
        </Then>
        <Else>
          <RowCenter>
            <Title style={{ margin: 0 }} level={5} aria-label="Order #">
              {t("orders.order")} #
            </Title>
          </RowCenter>
        </Else>
      </If>
      <CenteredTitle level={5} aria-label="Order List">
        {t("orders.order-list")}
      </CenteredTitle>
      <Scroll>
        {foodOrder?.map((food) => (
          <FoodOrderCard key={food.id} food={food} />
        ))}
      </Scroll>
      <CenteredTitle level={5} style={{ color: RED, visibility: isVisible }}>
        Total: {convertPrice(Number(calculateTotal(foodOrder)), "backToFront", true)}
      </CenteredTitle>
      <RowCenter style={{ marginTop: "1rem" }}>
        <Space>
          <AnimButton>
            <RediButton
              buttonType={EButtonType.SUCCESS}
              shape="round"
              aria-label="Validate"
              disabled={isDisabled}
              loading={loading}
              onClick={() => handleSubmit(foodOrder)}
            >
              <b>{t("buttons.validate")}</b>
            </RediButton>
          </AnimButton>

          <AnimButton>
            <RediButton
              buttonType={EButtonType.ERROR}
              shape="round"
              onClick={() => handleCancel("/")}
              aria-label="cancel order"
            >
              {t("buttons.cancel-order")}
            </RediButton>
          </AnimButton>
        </Space>
      </RowCenter>
    </>
  );
};

export default OrderSection;
