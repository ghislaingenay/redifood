import { DeleteOutlined, MinusSquareOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { Col, Typography } from "antd";
import { IFood } from "../../../src/interfaces/food.interface";
import { OrderCardStyled } from "../../../src/styles/styledComponents/div.styled";
import { GREY } from "../../constants";
import { EButtonType } from "../../interfaces";
import { CenteredTitle } from "../../styles/styledComponents/typography.styled";
import { RediButton } from "../styling/Button.style";
import { RowSpaceAround, RowSpaceBetween } from "../styling/grid.styled";
const { Title } = Typography;

interface IFoodOrderCard {
  food: IFood;
  handleDeleteFood: (foodId: IFood["itemId"]) => void;
  handleQty: (foodId: IFood["itemId"], type: "add" | "remove") => void;
}

const FoodOrderCard = ({ food, handleDeleteFood, handleQty }: IFoodOrderCard) => {
  const isDisabled = food.itemQuantity === 1 ? true : false;
  return (
    <OrderCardStyled key={food.itemId} role="card">
      <RowSpaceBetween gutter={10} style={{ padding: "0 0.5rem" }}>
        <Col lg={8} style={{ overflow: "ellipsis", textOverflow: "ellipsis" }}>
          <Title level={5} style={{ margin: 0, padding: "0 auto 1rem" }}>
            <b>{food.itemName}</b>
          </Title>
        </Col>
        <Col lg={6}>
          <RediButton
            buttonType={EButtonType.ERROR}
            name={`Delete ${food.itemName}`}
            shape="round"
            size="large"
            onClick={() => handleDeleteFood(food.itemId)}
          >
            <DeleteOutlined aria-label={`delete ${food.itemName}`} />
          </RediButton>
        </Col>
        <Col lg={10} style={{ border: `1px solid ${GREY}`, borderRadius: "4rem" }}>
          <RowSpaceAround style={{ height: "3rem", margin: 0 }}>
            <RediButton
              buttonType={EButtonType.DISPLAY}
              size="large"
              shape="circle"
              disabled={isDisabled}
              onClick={() => handleQty(food.itemId, "remove")}
            >
              <MinusSquareOutlined aria-label={`remove ${food.itemName}`} />
            </RediButton>
            <CenteredTitle level={4} style={{ margin: 0 }}>
              {food.itemQuantity}
            </CenteredTitle>
            <RediButton
              buttonType={EButtonType.SUCCESS}
              size="large"
              shape="circle"
              onClick={() => handleQty(food.itemId, "add")}
            >
              <PlusSquareOutlined aria-label={`add ${food.itemName}`} />
            </RediButton>
          </RowSpaceAround>
        </Col>
      </RowSpaceBetween>
    </OrderCardStyled>
  );
};

export default FoodOrderCard;
