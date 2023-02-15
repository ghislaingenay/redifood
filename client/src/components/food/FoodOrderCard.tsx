import { DeleteOutlined, MinusSquareOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { Col, Row, Typography } from "antd";
import { IFood } from "../../../src/interfaces/food.interface";
import { OrderCardStyled } from "../../../src/styles/styledComponents/div.styled";
import { EButtonType } from "../../interfaces";
import { RediButton } from "../styling/Button.style";
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
      <Row justify="space-between" gutter={10} style={{ marginBottom: "0.5rem" }}>
        <Col lg={14}>
          <Title level={5} style={{ margin: 0, padding: "0 auto 1rem" }}>
            <b>{food.itemName}</b>
          </Title>
        </Col>
        <Col lg={9}>
          <Title level={5} style={{ margin: 0, padding: "0 auto 1rem" }}>
            Price: {food.itemPrice} $
          </Title>
        </Col>
      </Row>
      <Row justify="space-between" align="middle">
        <Col lg={5} style={{ textAlign: "center" }}>
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
        <Col lg={5} style={{ textAlign: "center" }}>
          <Title level={4} style={{ marginTop: 0, paddingTop: "0.5rem" }}>
            {food.itemQuantity}
          </Title>
        </Col>
        <Col lg={5} style={{ textAlign: "center" }}>
          <RediButton
            buttonType={EButtonType.DISPLAY}
            size="large"
            shape="circle"
            disabled={isDisabled}
            onClick={() => handleQty(food.itemId, "remove")}
          >
            <MinusSquareOutlined aria-label={`remove ${food.itemName}`} />
          </RediButton>
        </Col>
        <Col lg={5} style={{ textAlign: "center" }}>
          <RediButton
            buttonType={EButtonType.SUCCESS}
            size="large"
            shape="circle"
            onClick={() => handleQty(food.itemId, "add")}
          >
            <PlusSquareOutlined aria-label={`add ${food.itemName}`} />
          </RediButton>
        </Col>
      </Row>
    </OrderCardStyled>
  );
};

export default FoodOrderCard;
