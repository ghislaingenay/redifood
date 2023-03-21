import { createContext, useEffect, useState } from "react";
import useLanguage from "../../pages/api/useLanguage";
import { ECurrency, ELanguage } from "../../redifood-module/src/interfaces";
import { NotificationRes } from "../../src/definitions/notification.class";
import { storeCurrency } from "../functions/global.fn";

// @ts-ignore
const AppContext = createContext({} as IAppContext);
interface IAppContext {
  state: {
    language: ELanguage;
    currency: ECurrency;
    vat: number;
  };
  setStatus: (status: string) => void;
  setLanguage: (val: ELanguage) => void;
  setCurrency: (val: ECurrency) => void;
  setVaT: (val: number) => void;
}
export default AppContext;

interface IAppProvider {
  children: React.ReactNode;
}

export const AppProvider = ({ children }: IAppProvider) => {
  const [status, setStatus] = useState<string>("success");
  const [language, setLanguage] = useState<ELanguage>(ELanguage.ENGLISH);
  const [currency, setCurrency] = useState<ECurrency>(ECurrency.USD);
  const { retrieveCookie } = useLanguage(language);
  const [vat, setVaT] = useState<number>(7);

  useEffect(() => {
    if (status === "error") {
      NotificationRes.onFailure({
        title: "An error occured",
        description: "Please resfresh the page",
        placement: "topRight",
      });
    }
    setCurrency(storeCurrency());
    setLanguage(retrieveCookie());
    // localStorage.setItem('currency', )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  return (
    <AppContext.Provider
      value={{
        state: {
          vat: vat,
          language: language,
          currency: currency,
        },
        setVaT: setVaT,
        setStatus: setStatus,
        setLanguage: setLanguage,
        setCurrency: setCurrency,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
