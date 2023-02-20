/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import FoodLayout from "../src/components/food/FoodLayout";
import { useFood } from "../src/contexts/food.context";
import { EFoodMode } from "../src/interfaces";
import { foodSectionArray, mockedFoodData } from "../test/mocks/mockFoodData";

const FoodPage = ({ foodList, foodSection, status }) => {
  const { setFoodOrder } = useFood();

  useEffect(() => {
    setFoodOrder([]);
  }, []);

  return (
    <FoodLayout
      status={status}
      foodSection={foodSection}
      foodList={foodList}
      mode={EFoodMode.ALTER}
      mainTitle="FOOD SECTION"
    />
  );
};

export default FoodPage;

export async function getServerSideProps() {
  return {
    props: { foodList: mockedFoodData, foodSection: foodSectionArray, status: "success" },
  };
  // await axios
  //   .get("/api/foods", { params: { selectedSection: "all" } })
  //   .then((res: any) => {
  //     const {
  //       data: { foodList, foodSection },
  //     } = res;
  //     return {
  //       props: { foodList, foodSection, status: "success" },
  //     };
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  // return {
  //   props: { foodList: [], foodSection: [], status: "error" },
  // };
}
