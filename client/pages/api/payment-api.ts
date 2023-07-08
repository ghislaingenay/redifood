import { EPaymentType } from "../../redifood-module/src/interfaces";
import { NotificationRes } from "../../src/definitions/notification.class";
import { AxiosFunction } from "./axios-request";

export const payOrder = async (orderId: number, paymentType: EPaymentType): Promise<{ isPaid: boolean }> => {
  const res = AxiosFunction({
    url: `api/orders/${orderId}`,
    body: { paymentType },
    queryParams: {},
    method: "post",
  })
    .then(() => {
      NotificationRes.onSuccess({
        placement: "top",
        title: "Payment successful",
        description: "You will be redirected to the main page",
      });
      return { isPaid: true };
    })
    .catch(() => {
      NotificationRes.onFailure({
        placement: "top",
        title: "Please try again",
        description:
          "An error occured during the process. If this issue occur multiple times, please contact Redifood team",
      });
      return { isPaid: false };
    });
  return res;
};
