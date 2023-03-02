import React, { useContext, useState } from "react";
import { IFood } from "../interfaces";

// @ts-ignore
export const FoodContext = React.createContext();

interface IFoodContext {
  foodOrder: IFood[];
  setFoodOrder: React.Dispatch<React.SetStateAction<IFood[]>>;
  functions: {
    deleteFood: (item: IFood["itemId"]) => void;
    addFood: (item: IFood["itemId"]) => void;
    removeFood: (item: IFood["itemId"]) => void;
    addToCart: (item: IFood["itemId"], foodList: IFood[]) => void;
    selectFood: (item: IFood["itemId"], foodList: IFood[]) => void;
  };
}
export function useFood() {
  const foodElement = useContext(FoodContext);
  if (!foodElement) {
    throw new Error("useFood must be used within a FoodProvider");
  }
  return foodElement as IFoodContext;
}

export function FoodProvider({ children }) {
  const [foodOrder, setFoodOrder] = useState<IFood[]>([]);

  const deleteFood = (itemId: IFood["itemId"]) => {
    const updatedOrder = [...foodOrder].filter((food) => food.itemId !== itemId);
    setFoodOrder(updatedOrder);
  };

  const addFood = (itemId: IFood["itemId"]) => {
    const currentOrder = [...foodOrder];
    for (let i = 0; i < currentOrder.length; i++) {
      if (currentOrder[i].itemId === itemId) {
        let currentFood = currentOrder[i];
        currentFood.itemQuantity += 1;
      }
    }
    setFoodOrder(currentOrder);
  };
  const removeFood = (itemId: IFood["itemId"]) => {
    const currentOrder = [...foodOrder];
    for (let i = 0; i < currentOrder.length; i++) {
      if (currentOrder[i].itemId === itemId) {
        let currentFood = currentOrder[i];
        currentFood.itemQuantity -= 1;
      }
    }
    setFoodOrder(currentOrder);
  };

  const selectFood = (foodId: IFood["itemId"], foodList: IFood[]) => {
    setFoodOrder([]);
    const foundFound = foodList.filter((food) => food.itemId === foodId);
    if (foundFound) {
      setFoodOrder(foundFound);
    }
    return null;
  };

  const addToCart = (foodId: IFood["itemId"], foodList: IFood[]) => {
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
      newFood.itemQuantity = 1;
      const currentOrder: any = [...foodOrder];
      currentOrder.push(newFood);
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
  };

  return <FoodContext.Provider value={values}>{children}</FoodContext.Provider>;
}
