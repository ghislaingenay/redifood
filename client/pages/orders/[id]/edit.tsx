import { useEffect } from "react";
import FoodLayout from "../../../src/components/food/FoodLayout";
import { useFood } from "../../../src/contexts/food.context";
import { NotificationRes } from "../../../src/definitions/notification.class";
import { EFoodMode, IFood } from "../../../src/interfaces";
import { foodSectionArray, mockedFoodData, mockOrderEdit } from "../../../test/mocks/mockFoodData";

const EditOrder = ({ foodList, currentFoodOrder, foodSection, status }) => {
  const { setFoodOrder } = useFood();
  const editOrder = (foodOrder: IFood[]) => {
    console.log("order edites", foodOrder);
    NotificationRes.onSuccess({
      title: "Order was succesfully created",
      description: "You will be redirected in 2 seconds",
      placement: "topRight",
    });
    // Recover info
    // Add missing data
    // axios
  };

  useEffect(() => {
    setFoodOrder(currentFoodOrder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <FoodLayout
        status={status}
        foodSection={foodSection}
        foodList={foodList}
        mode={EFoodMode.EDIT}
        mainTitle="EDIT ORDER"
        editOrder={editOrder}
      />
    </>
  );
};

export default EditOrder;

export async function getServerSideProps() {
  return {
    props: {
      foodList: mockedFoodData,
      currentFoodOrder: mockOrderEdit,
      foodSection: foodSectionArray,
      status: "success",
    },
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
