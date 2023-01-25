import { EFoodMode, IFood } from "@interfaces/food.interface";
import { useContext } from "react";
import FoodLayout from "src/components/food/FoodLayout";
import AppContext from "src/contexts/app.context";
import { foodSectionArray, mockedFoodData } from "../../test/mocks/mockFoodData";

const CreateOrder = ({ foodList, foodSection, status }) => {
  const appValue = useContext(AppContext);
  appValue.setStatus(status);

  const handleOrderCreate = (foodOrder: IFood[]) => {
    console.log("order created", foodOrder);
    // Recover info
    // Add missing data
    // axios
  };

  return (
    <>
      <FoodLayout
        foodSection={foodSection}
        foodList={foodList}
        mode={EFoodMode.CREATE}
        mainTitle="Create an order"
        foodOrder={[]}
        handleOrderCreate={handleOrderCreate}
      />
    </>
  );
};

export default CreateOrder;

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
