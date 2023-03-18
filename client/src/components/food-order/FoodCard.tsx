import Image from "next/image";
import { BACKGROUND_COLOR } from "../../constants";
import { useFood } from "../../contexts/food.context";
import { EFoodMode, IFood } from "../../interfaces";
import { AnimCard } from "../../styles/animations/global.anim";

interface IFoodCard {
  food: IFood;
  foodList: IFood[];
  mode: EFoodMode;
}
const FoodCard = ({ food, foodList, mode }: IFoodCard) => {
  const {
    functions: { addToCart, selectFood },
    foodPictures: { haveFoodDescription, haveFoodPicture },
  } = useFood();
  return (
    <>
      <AnimCard
        onClick={() => {
          if (mode === EFoodMode.ALTER) {
            selectFood(food.itemId, foodList);
          } else {
            addToCart(food.itemId, foodList);
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
        {haveFoodDescription && (
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
        )}
      </AnimCard>
    </>
  );
};

export default FoodCard;
