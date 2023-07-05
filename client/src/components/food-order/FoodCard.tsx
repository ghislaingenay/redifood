import Image from "next/image";
import { IFoodGetApi } from "../../../redifood-module/src/interfaces";
import { useFood } from "../../contexts/food.context";
import { EFoodMode } from "../../interfaces";
import { AnimCard } from "../../styles/animations/global.anim";

interface IFoodCard {
  food: IFoodGetApi;
  foodList: IFoodGetApi[];
  mode: EFoodMode;
}
const FoodCard = ({ food, foodList, mode }: IFoodCard) => {
  const {
    functions: { addToCart, selectFood },
    foodPictures: { haveFoodPicture },
  } = useFood();
  return (
    <>
      <AnimCard
        onClick={() => {
          if (mode === EFoodMode.ALTER) {
            selectFood(food.id, foodList);
          } else {
            addToCart(food.id, foodList);
          }
        }}
        role="card"
      >
        {haveFoodPicture && (
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
        )}
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
      </AnimCard>
    </>
  );
};

export default FoodCard;
