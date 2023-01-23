import { createContext, useEffect, useState } from "react";
import { NotificationRes } from "src/definitions/notification.class";

// @ts-ignore
const AppContext = createContext({} as IAppContext);
interface IAppContext {
  state: {
    status: "error" | "success";
  };
  setStatus: React.Dispatch<React.SetStateAction<"error" | "success">>;
}
export default AppContext;

export const AppProvider = ({ children }) => {
  const [status, setStatus] = useState<"error" | "success">("success");

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
