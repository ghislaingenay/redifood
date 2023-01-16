import { INotificationParams, TNotificationApi, TPlacementNotification } from "@interfaces/class.interface";
import { notification } from "antd";

export class NotificationRes {
  static onSuccess(data: INotificationParams) {
    return notification.success({
      duration: 2,
      message: data.title,
      description: data.description,
      placement: data.placement,
    });
  }

  static async onFailure(data: INotificationParams) {
    return notification.error({
      duration: 2,
      message: data.title,
      description: data.description,
      placement: data.placement,
    });
  }
  static async onWarning(data: INotificationParams) {
    return notification.warning({
      duration: 2,
      message: data.title,
      description: data.description,
      placement: data.placement,
    });
  }
  static async onInfo(data: INotificationParams) {
    return notification.info({
      duration: 2,
      message: data.title,
      description: data.description,
      placement: data.placement,
    });
  }

  static send(type: TNotificationApi, placement: TPlacementNotification, description: string, title: string) {
    return notification[type]({
      duration: 2,
      description,
      placement,
      message: title,
    });
  }
}
