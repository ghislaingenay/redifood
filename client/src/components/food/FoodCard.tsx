import { Card } from "antd";
import Image from "next/image";
import { BACKGROUND_COLOR, LIGHT_GREY } from "../../constants";
const FoodCard = ({ addFoodToCart, food }) => {
  return (
    <>
      <Card
        style={{
          textAlign: "center",
          backgroundColor: LIGHT_GREY,
          boxShadow: "0 0 10px 0 rgba(0,0,0,0.2)",
        }}
        onClick={() => {
          addFoodToCart(food.itemId);
        }}
        role="card"
      >
        <Image
          style={{
            textAlign: "center",
            marginBottom: "0.5rem",
            borderRadius: "50%",
            boxShadow: "0 0 10px 0px rgba(0,0,0,0.2)",
          }}
          alt={`Food ${food.itemName}`}
          src={food.itemPhoto}
          width={150}
          height={150}
        />
        <div style={{ fontWeight: "bold", alignContent: "center", justifyContent: "center" }}>{food.itemName}</div>
        <div
          style={{
            height: "2rem",
            fontSize: "0.75rem",
            overflow: "clip",
            marginTop: "1rem",
            alignContent: "center",
            justifyContent: "center",
            color: BACKGROUND_COLOR,
          }}
        >
          {food.itemDescription}
        </div>
      </Card>
    </>
  );
};

export default FoodCard;
