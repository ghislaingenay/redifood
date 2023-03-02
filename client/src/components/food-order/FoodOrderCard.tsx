import { DeleteOutlined, MinusSquareOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { Col, Typography } from "antd";
import { GREY } from "../../constants";
import { useFood } from "../../contexts/food.context";
import { EButtonType } from "../../interfaces";
import { IFood } from "../../interfaces/food.interface";
import { OrderCardStyled } from "../../styles/styledComponents/div.styled";
import { CenteredTitle } from "../../styles/styledComponents/typography.styled";
import { RediButton } from "../styling/Button.style";
import { RowSpaceAround, RowSpaceBetween } from "../styling/grid.styled";
const { Title } = Typography;

interface IFoodOrderCard {
  food: IFood;
}

const FoodOrderCard = ({ food }: IFoodOrderCard) => {
  const {
    functions: { deleteFood, addFood, removeFood },
  } = useFood();
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
            onClick={() => deleteFood(food.itemId)}
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
              onClick={() => removeFood(food.itemId)}
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
              onClick={() => addFood(food.itemId)}
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
