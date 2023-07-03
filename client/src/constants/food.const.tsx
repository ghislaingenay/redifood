import { EHandleType, PartialFormFood } from "../interfaces";

export const initialFormValues: PartialFormFood = {
  itemName: undefined,
  itemPrice: undefined,
  sectionId: EHandleType.NONE,
  extraId: EHandleType.NONE,
  itemPhoto: undefined,
  itemDescription: undefined,
  itemQuantity: undefined,
  id: undefined,
};
