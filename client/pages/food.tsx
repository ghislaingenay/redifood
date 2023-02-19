import FoodLayout from "../src/components/food/FoodLayout";
import { EFoodMode } from "../src/interfaces";
import { foodSectionArray, mockedFoodData } from "../test/mocks/mockFoodData";

const FoodPage = ({ foodList, foodSection, status }) => {
  const handleFoodChange = () => {
    console.log("altered food");
  };
  return (
    <FoodLayout
      status={status}
      foodSection={foodSection}
      foodList={foodList}
      mode={EFoodMode.ALTER}
      mainTitle="FOOD SECTION"
      updateFood={handleFoodChange}
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
