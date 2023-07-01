import { IFoodApi, IFoodSectionListWithExtra } from "../../redifood-module/src/interfaces";
import { AxiosFunction } from "./axios-request";

type TCreated = { created: boolean | "existed" };
type TDeleted = { deleted: boolean | "existed" };
type TUpdated = { updated: boolean };

type PromiseCreated = Promise<TCreated> | TCreated;
type PromiseDeleted = Promise<TDeleted>;
type PromiseUpdated = Promise<TUpdated>;

export const handleCreateSection = (sectionName: string, listing: IFoodSectionListWithExtra[]): PromiseCreated => {
  const existed = listing.find((item) => new RegExp(sectionName, "i").test(item.sectionName));
  if (existed) return { created: "existed" } as TCreated;
  const createdRes = AxiosFunction({
    url: "api/foods/section",
    method: "post",
    queryParams: {},
    body: { sectionName },
  })
    .then(() => {
      return { created: true };
    })
    .catch(() => {
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
    ?.extraList.find((item) => new RegExp(extraName, "i").test(item.extraName));
  if (existed) return { created: "existed" } as TCreated;
  const createdRes = AxiosFunction({
    url: "api/foods/extra",
    method: "post",
    queryParams: {},
    body: { extraName },
  })
    .then(() => {
      return { created: true };
    })
    .catch(() => {
      return { created: false };
    });
  return createdRes;
};

export const deleteSection = (sectionId: number): PromiseDeleted => {
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

export const deleteExtra = (extraId: number): PromiseDeleted => {
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
