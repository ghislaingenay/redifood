import { createContext, useEffect, useState } from "react";
import { NotificationRes } from "../../src/definitions/notification.class";
import { ECurrency } from "../interfaces";

// @ts-ignore
const AppContext = createContext({} as IAppContext);
interface IAppContext {
  state: {
    status: "error" | "success";
    language: string;
    currency: ECurrency;
  };
  setStatus: (status: "success" | "error") => void;
  setLanguage: (val: string) => void;
  setCurrency: (val: ECurrency) => void;
}
export default AppContext;

export const AppProvider = ({ children }) => {
  const [status, setStatus] = useState<"success" | "error">("success");
  const [language, setLanguage] = useState<string>("en");
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
