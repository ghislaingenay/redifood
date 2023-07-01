import { IFoodApi, IFoodSectionListWithExtra } from "../../redifood-module/src/interfaces";
import { NotificationRes } from "../../src/definitions/notification.class";
import { AxiosFunction } from "./axios-request";

type TCreated = { created: boolean };
type TDeleted = { deleted: boolean };
type TUpdated = { updated: boolean };

type PromiseCreated = Promise<TCreated> | TCreated;
type PromiseDeleted = Promise<TDeleted>;
type PromiseUpdated = Promise<TUpdated>;

export const handleCreateSection = (sectionName: string, listing: IFoodSectionListWithExtra[]): PromiseCreated => {
  const existed = listing.find((item) => new RegExp(sectionName, "i").test(item.sectionName));
  if (existed) {
    NotificationRes.onFailure({
      title: "Section existed",
      description: "Please try again",
      placement: "bottomRight",
    });
    return { created: false } as TCreated;
  }
  const createdRes = AxiosFunction({
    url: "api/foods/section",
    method: "post",
    queryParams: {},
    body: { sectionName },
  })
    .then(() => {
      NotificationRes.onSuccess({
        title: "Section created",
        description: "New section has been created",
        placement: "bottomRight",
      });
      return { created: true };
    })
    .catch(() => {
      NotificationRes.onFailure({
        title: "Failed to create section",
        description: "Please try again",
        placement: "bottomRight",
      });
      return { created: false };
    });
  return createdRes;
};

export const handleCreateExtra = (
  extraName: string,
  sectionId: number,
  listing: IFoodSectionListWithExtra[],
): PromiseCreated => {
  const existed = listing
    .find((item) => item.id === sectionId)
    ?.extraList?.find((item) => new RegExp(extraName, "i").test(item.extraName));
  if (existed) {
    NotificationRes.onFailure({
      title: "Extra existed",
      description: "Please try again",
      placement: "bottomRight",
    });
    return { created: false } as TCreated;
  }
  const createdRes = AxiosFunction({
    url: "api/foods/extra",
    method: "post",
    queryParams: {},
    body: { extraName, sectionId },
  })
    .then(() => {
      NotificationRes.onSuccess({
        title: "Extra created",
        description: "New extra has been created",
        placement: "bottomRight",
      });
      return { created: true };
    })
    .catch((err) => {
      NotificationRes.onFailure({
        title: "Failed to create extra",
        description: "Please try again",
        placement: "bottomRight",
      });
      return { created: false };
    });
  return createdRes;
};

export const handleDeleteSection = (sectionId: number): PromiseDeleted => {
  const deleteRes = AxiosFunction({
    url: `api/foods/section/${sectionId}`,
    method: "delete",
    queryParams: {},
    body: {},
  })
    .then(() => {
      return { deleted: true };
    })
    .catch(() => {
      return { deleted: false };
    });
  return deleteRes;
};

export const handleDeleteExtra = (extraId: number): PromiseDeleted => {
  const deleteRes = AxiosFunction({
    url: `api/foods/extra/${extraId}`,
    method: "delete",
    queryParams: {},
    body: {},
  })
    .then(() => {
      return { deleted: true };
    })
    .catch(() => {
      return { deleted: false };
    });
  return deleteRes;
};

export const handleCreateFood = (food: Omit<IFoodApi, "id" | "userId">): PromiseCreated => {
  const createdRes = AxiosFunction({
    url: "api/foods",
    method: "post",
    queryParams: {},
    body: { ...food },
  })
    .then(() => {
      return { created: true };
    })
    .catch(() => {
      return { created: false };
    });
  return createdRes;
};

export const handleUpdatedFood = (food: IFoodApi, foodId: IFoodApi["id"]): PromiseUpdated => {
  const updatedRes = AxiosFunction({
    url: `api/foods/${foodId}`,
    method: "put",
    queryParams: {},
    body: { ...food },
  })
    .then(() => {
      return { updated: true };
    })
    .catch(() => {
      return { updated: false };
    });
  return updatedRes;
};
