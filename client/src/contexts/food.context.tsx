import React, { useContext, useState } from "react";
import { IFoodApi } from "../../redifood-module/src/interfaces";

// @ts-ignore
export const FoodContext = React.createContext();

interface IFoodContext {
  foodOrder: IFoodApi[];
  setFoodOrder: React.Dispatch<React.SetStateAction<IFoodApi[]>>;
  functions: {
    deleteFood: (item: IFoodApi["id"]) => void;
    addFood: (item: IFoodApi["id"]) => void;
    removeFood: (item: IFoodApi["id"]) => void;
    addToCart: (item: IFoodApi["id"], foodList: IFoodApi[]) => void;
    selectFood: (item: IFoodApi["id"], foodList: IFoodApi[]) => void;
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

  const deleteFood = (itemId: IFoodApi["id"]) => {
    const updatedOrder = [...foodOrder].filter((food) => food.id !== itemId);
    setFoodOrder(updatedOrder);
  };

  const addFood = (itemId: IFoodApi["id"]) => {
    const currentOrder = [...foodOrder];
    for (let i = 0; i < currentOrder.length; i++) {
      if (currentOrder[i].id === itemId) {
        let currentFood = currentOrder[i];
        currentFood.itemQuantity += 1;
      }
    }
    setFoodOrder(currentOrder);
  };
  const removeFood = (itemId: IFoodApi["id"]) => {
    const currentOrder = [...foodOrder];
    for (let i = 0; i < currentOrder.length; i++) {
      if (currentOrder[i].id === itemId) {
        let currentFood = currentOrder[i];
        currentFood.itemQuantity -= 1;
      }
    }
    setFoodOrder(currentOrder);
  };

  const selectFood = (foodId: IFoodApi["id"], foodList: IFoodApi[]) => {
    setFoodOrder([]);
    const foundFound = foodList.filter((food) => food.id === foodId);
    if (foundFound) {
      setFoodOrder(foundFound);
    }
    return null;
  };

  const addToCart = (foodId: IFoodApi["id"], foodList: IFoodApi[]) => {
    const foundFound = foodOrder.find((food) => food.id === foodId);
    if (foundFound) {
      let currentOrder = [...foodOrder];
      for (let i = 0; i < currentOrder.length; i++) {
        if (currentOrder[i].id === foundFound.id) {
          currentOrder[i].itemQuantity += 1;
        }
      }
      setFoodOrder(currentOrder);
    } else {
      let newFood = foodList.find((food) => food.id === foodId);
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
