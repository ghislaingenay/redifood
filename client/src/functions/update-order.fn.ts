import { AxiosFunction } from "../../pages/api/axios-request";
import { EOrderStatus, IFoodApi, IOrderApi } from "../../redifood-module/src/interfaces";
import { TUpdateOrderBody } from "../components/food-order/FoodLayout";
import { NotificationRes } from "../definitions/notification.class";
import { setFoodItemsForDb } from "./food.fn";

export const handleUpdateOrder = async (
  foodOrder: IFoodApi[],
  order: IOrderApi<string>,
): Promise<{ success: boolean }> => {
  const updatedFoodList = setFoodItemsForDb([...foodOrder]);

  const bodyUpdateOrder: TUpdateOrderBody = {
    orderTableNumber: order.orderTableNumber,
    orderItems: updatedFoodList,
    orderStatus: EOrderStatus.UPDATED,
  };
  AxiosFunction({
    method: "put",
    url: `/api/orders/${order.id}`,
    body: bodyUpdateOrder,
    queryParams: {},
  }).catch(() => {
    NotificationRes.onFailure({
      title: "Error updating order",
      description: "Please try again",
      placement: "topRight",
    });
    return { success: false };
  });

  NotificationRes.onSuccess({
    title: "Order was succesfully updated",
    description: "You will be redirected in 2 seconds",
    placement: "topRight",
  });
  return { success: true };
};
