import { Alert, Divider, InputNumber, Typography } from "antd";
import { ORANGE, RED } from "../../constants";
import { useFood } from "../../contexts/food.context";
import { calculateTotal } from "../../functions/order.fn";
import { EButtonType, EFoodMode } from "../../interfaces";
import { Scroll } from "../../styles/styledComponents/div.styled";
import { CenteredTitle } from "../../styles/styledComponents/typography.styled";
import { RediButton } from "../styling/Button.style";
import { RowCenter, RowCenterSp } from "../styling/grid.styled";
import FoodOrderCard from "./FoodOrderCard";
const { Title } = Typography;
const OrderSection = ({ tableNumber, setTableNumber, mode, errorTable, handleSubmit, handleCancel }) => {
  const { foodOrder } = useFood();
  const isCreateMode = mode === EFoodMode.CREATE ? true : false;
  const isVisible = foodOrder.length > 0 ? "visible" : "hidden";
  const isDisabled = foodOrder.length === 0 ? true : false;

  return (
    <>
      <RowCenter>
        <Title level={5}>Table Number:</Title>
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
        {errorTable.alreadyInDb && <Alert type="error" message="This table number is already allocated" />}
        {errorTable.missingValue && <Alert type="error" message="Please select a table number" />}
      </RowCenter>
      {mode === EFoodMode.EDIT && (
        <RowCenter>
          <Title level={5}>Order #</Title>
        </RowCenter>
      )}
      <Divider style={{ border: `0.125rem solid ${ORANGE}` }} />
      <CenteredTitle level={5}>Order List</CenteredTitle>
      <Scroll>
        {foodOrder?.map((food) => (
          <FoodOrderCard key={food.itemId} food={food} />
        ))}
      </Scroll>
      <CenteredTitle level={5} style={{ color: RED, visibility: isVisible }}>
        Total: {calculateTotal(foodOrder).toFixed(2)} $
      </CenteredTitle>
      <RowCenterSp style={{ marginTop: "1rem" }}>
        <RediButton
          buttonType={EButtonType.SUCCESS}
          shape="round"
          disabled={isDisabled}
          onClick={() => handleSubmit(foodOrder)}
        >
          <b>Validate</b>
        </RediButton>

        <RediButton buttonType={EButtonType.ERROR} shape="round" onClick={() => handleCancel("/")}>
          Cancel Order
        </RediButton>
      </RowCenterSp>
    </>
  );
};

export default OrderSection;
