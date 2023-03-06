import { createContext, useEffect, useState } from "react";
import { NotificationRes } from "../../src/definitions/notification.class";
import { ECurrency, ELanguage } from "../interfaces";

// @ts-ignore
const AppContext = createContext({} as IAppContext);
interface IAppContext {
  state: {
    status: "error" | "success";
    language: string;
    currency: ECurrency;
  };
  setStatus: (status: "success" | "error") => void;
  setLanguage: (val: ELanguage) => void;
  setCurrency: (val: ECurrency) => void;
  convertPrice: (price: number) => number;
  displayCurrency: () => string;
}
export default AppContext;

export const AppProvider = ({ children }) => {
  const [status, setStatus] = useState<"success" | "error">("success");
  const [language, setLanguage] = useState<ELanguage>(ELanguage.ENGLISH);
  const [currency, setCurrency] = useState<ECurrency>(ECurrency.USD);

  useEffect(() => {
    if (status === "error") {
      NotificationRes.onFailure({
        title: "An error occured",
        description: "Please resfresh the page",
        placement: "topRight",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const convertPrice = (price: number) => {
    switch (currency) {
      case ECurrency.USD:
        return price;
      case ECurrency.EUR:
        return price * 0.85;
      default:
        return price;
    }
  };

  const displayCurrency = () => (currency === ECurrency.USD ? "$" : "€");

  return (
    <AppContext.Provider
      value={{
        state: {
          status: status,
          language: language,
          currency: currency,
        },
        setStatus: setStatus,
        setLanguage: setLanguage,
        setCurrency: setCurrency,
        convertPrice: convertPrice,
        displayCurrency: displayCurrency,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
