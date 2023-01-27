import { createContext, useEffect, useState } from "react";
import { NotificationRes } from "../../src/definitions/notification.class";
import { TStatusProps } from "../interfaces/global.interface";

// @ts-ignore
const AppContext = createContext({} as IAppContext);
interface IAppContext {
  state: {
    status: "error" | "success";
  };
  setStatus: (status: TStatusProps) => void;
}
export default AppContext;

export const AppProvider = ({ children }) => {
  const [status, setStatus] = useState<TStatusProps>("success");

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
        },
        setStatus: setStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
