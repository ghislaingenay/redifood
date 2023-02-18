import { Card } from "antd";
import Image from "next/image";
import { BACKGROUND_COLOR, LIGHT_GREY } from "../../constants";
import { useFood } from "../../contexts/food.context";
import { IFood } from "../../interfaces";

interface IFoodCard {
  food: IFood;
  foodList: IFood[];
}
const FoodCard = ({ food, foodList }: IFoodCard) => {
  const {
    functions: { addToCart },
  } = useFood();
  return (
    <>
      <Card
        style={{
          textAlign: "center",
          backgroundColor: LIGHT_GREY,
          boxShadow: "0 0 10px 0 rgba(0,0,0,0.2)",
        }}
        onClick={() => {
          addToCart(food.itemId, foodList);
        }}
        role="card"
      >
        <Image
          style={{
            textAlign: "center",
            marginBottom: "0.5rem",
            borderRadius: "50%",
            margin: "0 auto",
            boxShadow: "0 0 10px 0px rgba(0,0,0,0.2)",
          }}
          alt={`Food ${food.itemName}`}
          src={food.itemPhoto}
          width={120}
          height={120}
        />
        <div
          style={{
            fontWeight: "bold",
            alignContent: "center",
            justifyContent: "center",
            height: "2.5rem",
            overflow: "clip",
          }}
        >
          {food.itemName}
        </div>
        <div
          style={{
            height: "2rem",
            fontSize: "0.75rem",
            overflow: "clip",
            marginTop: "0.25rem",
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
