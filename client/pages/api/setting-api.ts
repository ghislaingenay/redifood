import { ISettingsApi, PartialUserInfo } from "../../redifood-module/src/interfaces";
import { NotificationRes } from "../../src/definitions/notification.class";
import { AxiosFunction } from "./axios-request";

export const handleUpdateUserInformation = async (user: PartialUserInfo) => {
  AxiosFunction({
    url: "/api/settings/user",
    method: "put",
    body: user,
    queryParams: {},
  })
    .then(() => {
      return true;
    })
    .catch(() => {
      NotificationRes.onFailure({
        title: "Failed to update user information",
        description: "Please try again later",
        placement: "topRight",
      });
      return;
    });
};

export const handleUpdateUserSettings = async (settings: Partial<ISettingsApi>) => {
  console.log(settings);
  AxiosFunction({
    url: "/api/settings",
    method: "put",
    body: settings,
    queryParams: {},
  })
    .then(() => {
      return true;
    })
    .catch(() => {
      NotificationRes.onFailure({
        title: "Failed to update user settings",
        description: "Please try again later",
        placement: "topRight",
      });
      return;
    });
};
