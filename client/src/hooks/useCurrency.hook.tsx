import { useContext } from "react";
import AppContext from "../contexts/app.context";
import { ECurrency, ELanguage } from "../interfaces";

const useCurrency = () => {
  const {
    state: { currency },
  } = useContext(AppContext);

  const stocks = [
    { currencyValue: ECurrency.USD, value: 1, numberFormat: ELanguage.ENGLISH, symbol: "$" },
    { currencyValue: ECurrency.EUR, value: 0.85, numberFormat: ELanguage.FRENCH, symbol: "€" },
  ];

  const findStock = () => {
    const res = stocks.find((stock) => stock.currencyValue === currency);
    if (!res) throw new Error("Currency not found");
    return res;
  };

  const convertFormat = (price: number) => {
    const { currencyValue } = findStock();
    return new Intl.NumberFormat(currencyValue, {
      maximumSignificantDigits: 2,
    }).format(price);
  };

  const convertPrice = (price: number, direction: "backToFront" | "frontToBack") => {
    if (direction === "backToFront") {
      const stock = stocks.find((stock) => stock.currencyValue === currency);
      return convertFormat(price * stock.value);
    } else {
      const stock = stocks.find((stock) => stock.currencyValue === currency);
      return convertFormat(price / stock.value);
    }
  };

  const displayCurrency = () => {
    const { symbol } = findStock();
    return symbol;
  };

  return { convertPrice, displayCurrency };
};

export default useCurrency;
