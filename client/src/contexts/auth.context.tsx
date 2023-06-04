import Error, { ErrorProps } from "next/error";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { AxiosFunction } from "../../pages/api/axios-request";
import { UserPayload } from "../../redifood-module/src/interfaces";
import Auth from "../../src/components/Auth";
import Loading from "../components/Loading";

export const AuthContext = createContext({} as IUseAuth);

interface IUseAuth {
  currentUser: any;
  verifyUser: () => Promise<UserPayload | null>;
}

export function useAuth() {
  const userValue = useContext(AuthContext);
  console.log(userValue);
  if (!userValue) {
    throw new Error(
      "useAuth must be used within an AuthProvider" as (string & ErrorProps) | Readonly<string & ErrorProps>,
    );
  }
  return userValue;
}

interface IAuthProvider {
  children: ReactNode;
}

export function AuthProvider({ children }: IAuthProvider) {
  const [currentUser, setCurrentUser] = useState<IUseAuth["currentUser"]>(null);
  const [spinLoading, setSpinLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      setSpinLoading(false);
      return;
    }
    setSpinLoading(true);
    console.log("currentUser", currentUser);
    AxiosFunction({
      url: `/api/auth/currentuser`,
      method: "get",
      body: {},
      queryParams: {},
    })
      .then((res) => {
        setCurrentUser(res.currentUser);
        setSpinLoading(false);
      })
      .catch(() => {
        setCurrentUser(null);
        setSpinLoading(false);
      });
  }, [currentUser]);

  const verifyUser = async (): Promise<UserPayload | null> => {
    return AxiosFunction({ url: "/api/auth/currentuser", method: "get", body: {}, queryParams: {} })
      .then((res) => {
        return res.currentUser;
      })
      .catch(() => {
        return null;
      });
  };

  if (spinLoading) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider value={{ currentUser: currentUser, verifyUser: verifyUser }}>
      {currentUser ? children : <Auth />}
    </AuthContext.Provider>
  );
}
