import Error, { ErrorProps } from "next/error";
import React, { useContext, useEffect, useState } from "react";
import { AxiosFunction } from "../../pages/api/axios-request";
import Auth from "../../src/components/Auth";
import Loading from "../components/Loading";

// @ts-ignore
export const AuthContext = React.createContext({} as IUseAuth);

interface IUseAuth {
  currentUser: any;
  verifyUser: () => any;
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
  children: React.ReactNode;
}

export function AuthProvider({ children }: IAuthProvider) {
  const [currentUser, setCurrentUser] = useState<IUseAuth["currentUser"]>(null);
  const [spinLoading, setSpinLoading] = useState(true);

  // {id: '642146142709983e1548df1f', email: 'test@test.com', iat: 1685775524}

  useEffect(() => {
    if (currentUser) {
      setSpinLoading(false);
      return;
    }
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

  const verifyUser = () => {
    AxiosFunction({ url: "/api/auth/currentuser", method: "get", body: {}, queryParams: {} })
      .then((res) => {
        return res.data.currentUser;
      })
      .catch((err: ErrorProps) => {
        console.error(err);
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
