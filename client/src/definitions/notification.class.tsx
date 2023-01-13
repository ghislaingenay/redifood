import { INotificationParams } from "@interfaces/class.interface";
import { notification } from "antd";

export class NotificationRes {
  static onSuccess(data: INotificationParams) {
    return notification.success({
      message: data.title,
      description: data.description,
      placement: data.placement,
    });
  }

  static async onFailure(data: INotificationParams) {
    return notification.error({
      message: data.title,
      description: data.description,
      placement: data.placement,
    });
  }
  static async onWarning(data: INotificationParams) {
    return notification.warning({
      message: data.title,
      description: data.description,
      placement: data.placement,
    });
  }
  static async onInfo(data: INotificationParams) {
    return notification.info({
      message: data.title,
      description: data.description,
      placement: data.placement,
    });
  }

  // static send(type: TNotificationApi, placement: TPlacementNotification, message: string, response: string) {
  //   return api[type]({
  //     message: message,
  //     description: response,
  //     placement,
  //   });
  // }
}
