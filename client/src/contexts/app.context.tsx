import { createContext, useEffect, useState } from "react";
import { NotificationRes } from "../../src/definitions/notification.class";
import { ECurrency, ELanguage } from "../interfaces";

// @ts-ignore
const AppContext = createContext({} as IAppContext);
interface IAppContext {
  state: {
    language: string;
    currency: ECurrency;
  };
  setStatus: (status: "success" | "error") => void;
  setLanguage: (val: ELanguage) => void;
  setCurrency: (val: ECurrency) => void;
}
export default AppContext;

export const AppProvider = ({ children }) => {
  const [status, setStatus] = useState<"success" | "error">("success");
  const [language, setLanguage] = useState<ELanguage>(ELanguage.ENGLISH);
  const [currency, setCurrency] = useState<ECurrency>(ECurrency.EUR);

  useEffect(() => {
    if (status === "error") {
      NotificationRes.onFailure({
        title: "An error occured",
        description: "Please resfresh the page",
        placement: "topRight",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppContext.Provider
      value={{
        state: {
          language: language,
          currency: currency,
        },
        setStatus: setStatus,
        setLanguage: setLanguage,
        setCurrency: setCurrency,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
