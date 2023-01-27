import { DeleteOutlined, MinusSquareOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { IFood } from "@interfaces/food.interface";
import { Col, Row, Typography } from "antd";
import { OrderCardStyled } from "src/styles/styledComponents/div.styled";
import { RediButton } from "../RediButton";
const { Title } = Typography;

interface IFoodOrderCard {
  food: IFood;
  handleDeleteFood: (foodId: IFood["itemId"]) => void;
  handleQty: (foodId: IFood["itemId"], type: "add" | "remove") => void;
}
const FoodOrderCard = ({ food, handleDeleteFood, handleQty }: IFoodOrderCard) => {
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
            name={`Delete-${food.itemName}`}
            typeButton="error"
            shape="round"
            title={<DeleteOutlined />}
            size="large"
            haveIcon={false}
            onClick={() => handleDeleteFood(food.itemId)}
          />
        </Col>
        <Col lg={5} style={{ textAlign: "center" }}>
          <Title level={4} style={{ marginTop: 0, paddingTop: "0.5rem" }}>
            {food.itemQuantity}
          </Title>
        </Col>
        <Col lg={5} style={{ textAlign: "center" }}>
          <RediButton
            name={`Minus-${food.itemName}`}
            typeButton="display"
            size="large"
            shape="circle"
            disabled={food.itemQuantity === 1 ? true : false}
            title={<MinusSquareOutlined />}
            onClick={() => handleQty(food.itemId, "remove")}
            haveIcon={false}
          />
        </Col>
        <Col lg={5} style={{ textAlign: "center" }}>
          <RediButton
            name={`Plus-${food.itemName}`}
            typeButton="success"
            size="large"
            shape="circle"
            onClick={() => handleQty(food.itemId, "add")}
            title={<PlusSquareOutlined />}
            haveIcon={false}
          />
        </Col>
      </Row>
    </OrderCardStyled>
  );
};

export default FoodOrderCard;