import { AxiosFunction } from "../../pages/api/axios-request";
import { IFoodGetApi, IOrderApi } from "../../redifood-module/src/interfaces";
import { NotificationRes } from "../definitions/notification.class";
import { TUpdateOrderBody } from "../interfaces";
import { setFoodItemsForDb } from "./food.fn";

export const handleUpdateOrder = async (
  foodOrder: IFoodGetApi[],
  order: IOrderApi<string>,
): Promise<{ success: boolean }> => {
  const updatedFoodList = setFoodItemsForDb([...foodOrder]);

  const bodyUpdateOrder: TUpdateOrderBody = {
    orderItems: updatedFoodList,
  };
  console.log({ bodyUpdateOrder });
  const response = AxiosFunction({
    method: "put",
    url: `/api/orders/${order.id}`,
    body: bodyUpdateOrder,
    queryParams: {},
  })
    .then(() => {
      NotificationRes.onSuccess({
        title: "Order was succesfully updated",
        description: "You will be redirected in 2 seconds",
        placement: "topRight",
      });
      return { success: true };
    })
    .catch(() => {
      NotificationRes.onFailure({
        title: "Error updating order",
        description: "Please try again",
        placement: "topRight",
      });
      return { success: false };
    });
  return response;
};
