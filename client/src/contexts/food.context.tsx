import React, { useContext, useState } from "react";
import { IFoodApi } from "../../redifood-module/src/interfaces";

// @ts-ignore
export const FoodContext = React.createContext();

interface IFoodContext {
  foodOrder: IFoodApi[];
  setFoodOrder: React.Dispatch<React.SetStateAction<IFoodApi[]>>;
  functions: {
    deleteFood: (item: IFoodApi["itemId"]) => void;
    addFood: (item: IFoodApi["itemId"]) => void;
    removeFood: (item: IFoodApi["itemId"]) => void;
    addToCart: (item: IFoodApi["itemId"], foodList: IFoodApi[]) => void;
    selectFood: (item: IFoodApi["itemId"], foodList: IFoodApi[]) => void;
  };
  foodPictures: {
    haveFoodDescription: boolean;
    setHaveFoodDescription: (val: boolean) => void;
    haveFoodPicture: boolean;
    setHaveFoodPicture: (val: boolean) => void;
  };
}
export function useFood() {
  const foodElement = useContext(FoodContext);
  if (!foodElement) {
    throw new Error("useFood must be used within a FoodProvider");
  }
  return foodElement as IFoodContext;
}

interface IFoodProvider {
  children: React.ReactNode;
}

export function FoodProvider({ children }: IFoodProvider) {
  const [foodOrder, setFoodOrder] = useState<IFoodApi[]>([]);
  const [haveFoodDescription, setHaveFoodDescription] = useState(true);
  const [haveFoodPicture, setHaveFoodPicture] = useState(true);

  const deleteFood = (itemId: IFoodApi["itemId"]) => {
    const updatedOrder = [...foodOrder].filter((food) => food.itemId !== itemId);
    setFoodOrder(updatedOrder);
  };

  const addFood = (itemId: IFoodApi["itemId"]) => {
    const currentOrder = [...foodOrder];
    for (let i = 0; i < currentOrder.length; i++) {
      if (currentOrder[i].itemId === itemId) {
        let currentFood = currentOrder[i];
        currentFood.itemQuantity += 1;
      }
    }
    setFoodOrder(currentOrder);
  };
  const removeFood = (itemId: IFoodApi["itemId"]) => {
    const currentOrder = [...foodOrder];
    for (let i = 0; i < currentOrder.length; i++) {
      if (currentOrder[i].itemId === itemId) {
        let currentFood = currentOrder[i];
        currentFood.itemQuantity -= 1;
      }
    }
    setFoodOrder(currentOrder);
  };

  const selectFood = (foodId: IFoodApi["itemId"], foodList: IFoodApi[]) => {
    setFoodOrder([]);
    const foundFound = foodList.filter((food) => food.itemId === foodId);
    if (foundFound) {
      setFoodOrder(foundFound);
    }
    return null;
  };

  const addToCart = (foodId: IFoodApi["itemId"], foodList: IFoodApi[]) => {
    const foundFound = foodOrder.find((food) => food.itemId === foodId);
    if (foundFound) {
      let currentOrder = [...foodOrder];
      for (let i = 0; i < currentOrder.length; i++) {
        if (currentOrder[i].itemId === foundFound.itemId) {
          currentOrder[i].itemQuantity += 1;
        }
      }
      setFoodOrder(currentOrder);
    } else {
      let newFood = foodList.find((food) => food.itemId === foodId);
      if (newFood) newFood.itemQuantity = 1;
      const currentOrder: IFoodApi[] = [...foodOrder];
      currentOrder.push(newFood!);
      setFoodOrder(currentOrder);
    }
  };

  const values: IFoodContext = {
    foodOrder: foodOrder,
    setFoodOrder: setFoodOrder,
    functions: {
      deleteFood: deleteFood,
      removeFood: removeFood,
      addFood: addFood,
      addToCart: addToCart,
      selectFood: selectFood,
    },
    foodPictures: {
      haveFoodDescription: haveFoodDescription,
      setHaveFoodDescription: setHaveFoodDescription,
      haveFoodPicture: haveFoodPicture,
      setHaveFoodPicture: setHaveFoodPicture,
    },
  };

  return <FoodContext.Provider value={values}>{children}</FoodContext.Provider>;
}
