export type TPlacementNotification = "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "top" | "bottom";
export type TNotificationApi = "info" | "success" | "warning" | "error";

export interface INotificationParams {
  placement: TPlacementNotification;
  title: string;
  description: string;
}
