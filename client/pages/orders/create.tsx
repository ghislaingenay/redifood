import FoodLayout from "../../src/components/food/FoodLayout";
import { NotificationRes } from "../../src/definitions/notification.class";
import { EFoodMode, IFood } from "../../src/interfaces/food.interface";
import { foodSectionArray, mockedFoodData } from "../../test/mocks/mockFoodData";

const CreateOrder = ({ foodList, foodSection, status }) => {
  const handleOrderCreate = (foodOrder: IFood[]) => {
    console.log("order created", foodOrder);
    NotificationRes.onSuccess({
      title: "Order was succesfully created",
      description: "You will be redirected in 2 seconds",
      placement: "topRight",
    });
    // Recover info
    // Add missing data
    // axios
  };

  return (
    <>
      <FoodLayout
        status={status}
        foodSection={foodSection}
        foodList={foodList}
        mode={EFoodMode.CREATE}
        mainTitle="Create order"
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
