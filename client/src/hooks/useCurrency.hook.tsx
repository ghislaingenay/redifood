import { useContext, useEffect, useState } from "react";
import { ECurrency, ELanguage } from "../../redifood-module/src/interfaces";
import AppContext from "../contexts/app.context";
import { storeCurrency } from "../functions/global.fn";

interface IUseCurrency {
  convertPrice: (price: number, direction: "backToFront" | "frontToBack", currBool: boolean) => string;
  displayCurrency: () => string;
  convertAmount: (price: number | string) => string;
}

const useCurrency = () => {
  const [currencyChoice, setCurrencyChoice] = useState<ECurrency>(ECurrency.USD);

  const {
    state: { currency },
  } = useContext(AppContext);
  const stocks = [
    { currencyValue: ECurrency.USD, value: 1, numberFormat: ELanguage.ENGLISH, symbol: "$" },
    { currencyValue: ECurrency.EUR, value: 0.85, numberFormat: ELanguage.FRENCH, symbol: "€" },
  ];

  const findStock = () => {
    const res = stocks.find((stock) => stock.currencyValue === currencyChoice);
    if (!res) throw new Error("Currency not found");
    return res;
  };

  const convertFormat = (price: number, currBool: boolean) => {
    const { numberFormat, currencyValue } = findStock();
    const styling = currBool && { style: "currency", currency: currencyValue };
    return new Intl.NumberFormat(numberFormat, {
      // maximumSignificantDigits: 2,
      maximumFractionDigits: 2,
      ...styling,
    }).format(price);
  };

  const convertPrice = (price: number, direction: "backToFront" | "frontToBack", currBool: boolean) => {
    if (direction === "backToFront") {
      const stock = stocks.find((stock) => stock.currencyValue === currencyChoice);
      if (stock) return convertFormat(price * stock.value, currBool);
    } else {
      const stock = stocks.find((stock) => stock.currencyValue === currencyChoice);
      if (stock) return convertFormat(price / stock.value, currBool);
    }
  };

  const displayCurrency = () => {
    const { symbol } = findStock();
    return symbol;
  };

  const convertAmount = (price: number | string) => {
    const { numberFormat, currencyValue } = findStock();
    const amount = Number(price);
    return new Intl.NumberFormat(numberFormat, {
      // style: "currency",
      currency: currencyValue,
    }).format(amount);
  };

  useEffect(() => {
    return setCurrencyChoice(storeCurrency());
  }, [currency]);

  return { convertPrice, displayCurrency, convertAmount } as IUseCurrency;
};

export default useCurrency;
