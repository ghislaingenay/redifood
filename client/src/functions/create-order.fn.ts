import { AxiosFunction } from "../../pages/api/axios-request";
import { IFoodApi } from "../../redifood-module/src/interfaces";
import { TCreateOrderBody } from "../components/food-order/FoodLayout";
import { NotificationRes } from "../definitions/notification.class";
import { setFoodItemsForDb } from "./food.fn";

export const handleCreateOrder = async (foodOrder: IFoodApi[], tableNumber: number): Promise<{ success: boolean }> => {
  const updatedFoodList = setFoodItemsForDb([...foodOrder]);
  console.log("updated food list", updatedFoodList);
  const bodyCreateOrder: TCreateOrderBody = {
    orderTableNumber: tableNumber as number,
    orderItems: updatedFoodList,
  };
  AxiosFunction({
    method: "post",
    url: "/api/orders",
    body: bodyCreateOrder,
    queryParams: {},
  }).catch(() => {
    NotificationRes.onFailure({
      title: "Error creating order",
      description: "Please try again",
      placement: "topRight",
    });
    return { success: false };
  });
  NotificationRes.onSuccess({
    title: "Order was succesfully created",
    description: "You will be redirected in 2 seconds",
    placement: "topRight",
  });
  return { success: true };
};
