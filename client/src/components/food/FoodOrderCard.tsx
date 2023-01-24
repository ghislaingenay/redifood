import { DeleteOutlined, MinusSquareOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { IFood } from "@interfaces/food.interface";
import { Card, Col, Row, Typography } from "antd";
import { RediButton } from "../RediButton";
const { Title } = Typography;

interface IFoodOrderCard {
  food: IFood;
  handleDeleteFood: (foodId: IFood["itemId"]) => void;
  handleQty: (foodId: IFood["itemId"], type: "add" | "remove") => void;
}
const FoodOrderCard = ({ food, handleDeleteFood, handleQty }: IFoodOrderCard) => {
  return (
    <Card
      key={food.itemId}
      role="card"
      className=" px-2"
      style={{ marginBottom: "1rem", boxShadow: "0 0 0.2rem rgba(0,0,0, 0.1)" }}
    >
      <Row justify="space-between" gutter={10}>
        <Col lg={15}>
          <Title level={5} className="pt-0 m-0 pb-1">
            <b>{food.itemName}</b>
          </Title>
        </Col>
        <Col lg={8}>
          <Title level={5} className="pt-0 m-0 pb-1">
            Price: {food.itemPrice} $
          </Title>
        </Col>
      </Row>
      <Row justify="space-between" align="middle">
        <Col lg={5}>
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
        <Col lg={5}>
          <Title level={4} className="text-center justify-center align-middle mt-0 pt-2">
            {food.itemQuantity}
          </Title>
        </Col>
        <Col lg={5}>
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
        <Col lg={5}>
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
    </Card>
  );
};

export default FoodOrderCard;
