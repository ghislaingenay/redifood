import { ECurrency } from "../../redifood-module/src/interfaces";
import { EFoodMode } from "../../src/interfaces";

export const mockedFoodData = [
  {
    itemId: "1",
    itemName: "Pizza Mediterranean",
    itemPhoto:
      "https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",

    itemPrice: 12.5,
    itemDescription: "Soo good",
    itemSection: "pizza",
    itemExtra: "tomato",
    itemQuantity: 0,
    itemCurrency: ECurrency.USD,
  },
  {
    itemId: "2",
    itemName: "Pizza Cheesy",
    itemPhoto:
      "https://images.unsplash.com/photo-1520201163981-8cc95007dd2a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
    itemPrice: 13.99,
    itemDescription: "Gorgonzola, gouda, mozzarella, blue cheese",
    itemSection: "pizza",
    itemExtra: "cream",
    itemQuantity: 0,
    itemCurrency: ECurrency.USD,
  },
  {
    itemId: "3",
    itemName: "Millefeuille",
    itemPhoto:
      "https://images.unsplash.com/photo-1587122569949-ae6e755c6bdc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=885&q=80",
    itemPrice: 4.25,
    itemDescription: "The traditional French Millefeuille",
    itemSection: "dessert",
    itemExtra: "pastry",
    itemQuantity: 0,
    itemCurrency: ECurrency.USD,
  },
  {
    itemId: "4",
    itemName: "Profiteroles",
    itemPhoto:
      "https://images.unsplash.com/photo-1602903489862-1fe54b1f5ff2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=825&q=80",
    itemPrice: 3.75,
    itemDescription: "Improve version of cream puff",
    itemSection: "dessert",
    itemExtra: "pastry",
    itemQuantity: 0,
    itemCurrency: ECurrency.USD,
  },
  {
    itemId: "5",
    itemName: "Carrot cake",
    itemPhoto:
      "https://images.unsplash.com/photo-1622926421334-6829deee4b4b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=496&q=80",
    itemPrice: 5.2,
    itemDescription: "Ingredient A and B",
    itemSection: "dessert",
    itemExtra: "cake",
    itemQuantity: 0,
    itemCurrency: ECurrency.USD,
  },
  {
    itemId: "6",
    itemName: "Espresso",
    itemPhoto:
      "https://images.unsplash.com/photo-1610889556528-9a770e32642f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1015&q=80",
    itemPrice: 1,
    itemDescription: "Hard and strong with the perfect beans",
    itemSection: "drink",
    itemExtra: "hot drink",
    itemQuantity: 0,
    itemCurrency: ECurrency.USD,
  },
  {
    itemId: "7",
    itemName: "Sprite can - 330 mL",
    itemPhoto:
      "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
    itemPrice: 1.2,
    itemDescription: "Sprite can of 330 mL",
    itemSection: "drink",
    itemExtra: "soda",
    itemQuantity: 0,
    itemCurrency: ECurrency.USD,
  },
  {
    itemId: "8",
    itemName: "Sprite can - 500 mL",
    itemPhoto:
      "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
    itemPrice: 1.6,
    itemDescription: "Sprite can of 500 mL",
    itemSection: "drink",
    itemExtra: "soda",
    itemQuantity: 0,
    itemCurrency: ECurrency.USD,
  },
  {
    itemId: "9",
    itemName: "Singha - 33 cL",
    itemPhoto:
      "https://images.unsplash.com/photo-1654081057025-93aec17feeca?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=688&q=80",
    itemPrice: 1.58,
    itemDescription: "Singha with 330 mL format",
    itemSection: "drink",
    itemExtra: "beer",
    itemQuantity: 0,
    itemCurrency: ECurrency.USD,
  },
];

export const foodSectionArray = ["all", "pizza", "dessert", "drink"];

export const createErrorProps: any = { foodList: [], foodSection: [], status: "error" };
export const createSuccessProps: any = {
  foodList: mockedFoodData,
  foodSection: foodSectionArray,
  status: "success",
};

export const mockOrderEdit = [
  {
    itemId: "8",
    itemName: "Sprite can - 500 mL",
    itemPhoto:
      "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
    itemPrice: 1.6,
    itemDescription: "Sprite can of 500 mL",
    itemSection: "drink",
    itemExtra: "soda",
    itemQuantity: 4,
    itemCurrency: "USD",
  },
  {
    itemId: "3",
    itemName: "Millefeuille",
    itemPhoto:
      "https://images.unsplash.com/photo-1587122569949-ae6e755c6bdc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=885&q=80",
    itemPrice: 4.25,
    itemDescription: "The traditional French Millefeuille",
    itemSection: "dessert",
    itemExtra: "pastry",
    itemQuantity: 1,
    itemCurrency: "USD",
  },
];

export const editSuccessProps: any = {
  foodList: mockedFoodData,
  foodSection: foodSectionArray,
  currentFoodOrder: mockOrderEdit,
  status: "success",
};

export const foodAlterProps: any = {
  foods: mockedFoodData,
  sectionList: foodSectionArray,
  status: "success",
  mode: EFoodMode.ALTER,
};
