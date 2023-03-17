import { Skeleton } from "antd";
import Error, { ErrorProps } from "next/error";
import React, { useContext, useEffect, useState } from "react";
import { AxiosFunction } from "../../pages/api/axios-request";
import Auth from "../../src/components/Auth";

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
  // const [currentUser, setCurrentUser] = useState({ username: "pit" });
  const [currentUser, setCurrentUser] = useState<IUseAuth["currentUser"]>({ username: "pit" });
  const [spinLoading, setSpinLoading] = useState(true);

  useEffect(() => {
    setSpinLoading(false);
    // setTimeout(() => {
    //   setCurrentUser({ username: "pit" });
    //   // console.log("currentUser", currentUser);
    //   // setSpinLoading(false);
    // }, 1000);
    // new Promise((resolve, reject) => {
    //   AxiosFunction({ url: "/api/auth/currentuser", method: "get", body: {}, queryParams: {} })
    //     .then((res) => {
    //       setCurrentUser(res.data.currentUser);
    //       setSpinLoading(false);
    //       resolve(res);
    //     })
    //     .catch((err) => {
    //       setCurrentUser(null);
    //       setSpinLoading(false);
    //       reject(err);
    //     });
    // });
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
    return <Skeleton />;
  }

  return (
    <AuthContext.Provider value={{ currentUser: currentUser, verifyUser: verifyUser }}>
      {currentUser ? children : <Auth />}
    </AuthContext.Provider>
  );
}
