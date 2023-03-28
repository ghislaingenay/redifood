import { IFoodApi, IFoodDB } from 'redifood-module/src/interfaces';

export const foodListMockDB: IFoodDB[] = [
  {
    item_name: 'Pizza Mediterranean',
    item_photo: 'ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8',
    item_price: 12.5,
    item_description: 'Soo good',
    section_id: 2,
    extra_id: 4,
    item_quantity: 0,
  },
  {
    item_name: 'Pizza Cheesy',
    item_photo: 'photo-1520201163981-8cc95007dd2a?',
    item_price: 13.99,
    item_description: 'Gorgonzola, gouda, mozzarella, blue cheese',
    section_id: 2,
    extra_id: 3,
    item_quantity: 0,
  },
  {
    item_name: 'Millefeuille',
    item_photo: 'images.unsplash.com/photo-1587122569949-ae6e755c6bdc?',
    item_price: 4.25,
    item_description: 'The traditional French Millefeuille',
    section_id: 1,
    extra_id: 2,
    item_quantity: 0,
  },
];

export const foodListDB = foodListMockDB.map((item: IFoodDB, index: number) => {
  return { ...item, id: index };
});

export const wrongFoodMockDB = {
  item_name: 'Millefeuille',
  item_photo: undefined,
  item_price: 4.25,
  itemDescription: 'The traditional French Millefeuille',
  section_id: 1,
  extra_id: null,
  item_quantity: 0,
};

export const wrongFoodMockApi1 = {
  itemName: 'Pizza Cheesy',
  itemPhoto: 'photo-1520201163981-8cc95007dd2a?',
  hello: 'world',
  item_price: 13.99,
  itemDescription: 'Gorgonzola, gouda, mozzarella, blue cheese',
  sectionId: 2,
  extra_id: 3,
  itemQuantity: 0,
};
export const wrongFoodMockApi2 = {
  itemName: 'Pizza Cheesy',
  item_extra: 3,
  itemPhoto: 'photo-1520201163981-8cc95007dd2a?',
  item_price: 13.99,
  hello: 'world',
  itemDescription: 'Gorgonzola, gouda, mozzarella, blue cheese',
  itemSection: 2,
  itemQuantity: 0,
};
export const goodFoodMockApi = {
  id: 2,
  itemName: 'Pizza Mediterranean',
  itemPhoto: 'ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8',
  itemPrice: 12.5,
  itemDescription: 'Soo good',
  sectionId: 2,
  extraId: 4,
  itemQuantity: 0,
};

export const goodFoodMockDb = {
  id: 2,
  item_name: 'Pizza Mediterranean',
  item_photo: 'ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8',
  item_price: 12.5,
  item_description: 'Soo good',
  section_id: 2,
  extra_id: 4,
  item_quantity: 0,
};

export const foodListMockAPI: IFoodApi[] = [
  {
    itemName: 'Pizza Mediterranean',
    itemPhoto: 'ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8',
    itemPrice: 12.5,
    itemDescription: 'Soo good',
    sectionId: 2,
    extraId: 4,
    itemQuantity: 0,
  },
  {
    itemName: 'Pizza Cheesy',
    itemPhoto: 'photo-1520201163981-8cc95007dd2a?',
    itemPrice: 13.99,
    itemDescription: 'Gorgonzola, gouda, mozzarella, blue cheese',
    sectionId: 2,
    extraId: 3,
    itemQuantity: 0,
  },
  {
    itemName: 'Millefeuille',
    itemPhoto: 'images.unsplash.com/photo-1587122569949-ae6e755c6bdc?',
    itemPrice: 4.25,
    itemDescription: 'The traditional French Millefeuille',
    sectionId: 1,
    extraId: 2,
    itemQuantity: 0,
  },
  {
    itemName: 'Millefeuille',
    itemPhoto: undefined,
    itemPrice: 4.25,
    itemDescription: 'The traditional French Millefeuille',
    sectionId: 1,
    extraId: null,
    itemQuantity: 0,
  },
];
