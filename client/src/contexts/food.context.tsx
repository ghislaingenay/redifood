import React, { useContext, useState } from "react";
import { IFoodApi, IFoodGetApi } from "../../redifood-module/src/interfaces";

// @ts-ignore
export const FoodContext = React.createContext();

interface IFoodContext {
  foodOrder: IFoodGetApi[];
  setFoodOrder: React.Dispatch<React.SetStateAction<IFoodGetApi[]>>;
  functions: {
    deleteFood: (item: IFoodGetApi["id"]) => void;
    addFood: (item: IFoodGetApi["id"]) => void;
    removeFood: (item: IFoodGetApi["id"]) => void;
    addToCart: (item: IFoodGetApi["id"], foodList: IFoodGetApi[]) => void;
    selectFood: (item: IFoodGetApi["id"], foodList: IFoodGetApi[]) => void;
  };
  foodPictures: {
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
  const [foodOrder, setFoodOrder] = useState<IFoodGetApi[]>([]);
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
  const removeFood = (itemId: IFoodGetApi["id"]) => {
    const currentOrder = [...foodOrder];
    for (let i = 0; i < currentOrder.length; i++) {
      if (currentOrder[i].id === itemId) {
        let currentFood = currentOrder[i];
        currentFood.itemQuantity -= 1;
      }
    }
    setFoodOrder(currentOrder);
  };

  const selectFood = (foodId: IFoodApi["id"], foodList: IFoodGetApi[]) => {
    setFoodOrder([]);
    const foundFound = foodList.filter((food) => food.id === foodId);
    if (foundFound) {
      setFoodOrder(foundFound);
    }
    return null;
  };

  const addToCart = (foodId: IFoodApi["id"], foodList: IFoodGetApi[]) => {
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
      const currentOrder: IFoodGetApi[] = [...foodOrder];
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
      haveFoodPicture: haveFoodPicture,
      setHaveFoodPicture: setHaveFoodPicture,
    },
  };

  return <FoodContext.Provider value={values}>{children}</FoodContext.Provider>;
}
