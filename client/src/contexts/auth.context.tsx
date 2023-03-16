import { Skeleton } from "antd";
import React, { useContext, useEffect, useState } from "react";
import Auth from "../../src/components/Auth";

// @ts-ignore
export const AuthContext = React.createContext();

export function useAuth() {
  const userValue = useContext(AuthContext);
  console.log(userValue);
  if (!userValue) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return userValue;
}

interface IAuthProvider {
  children: React.ReactNode;
}

export function AuthProvider({ children }: IAuthProvider) {
  // const [currentUser, setCurrentUser] = useState({ username: "pit" });
  const [currentUser, setCurrentUser] = useState({ username: "pit" });
  const [spinLoading, setSpinLoading] = useState(true);

  useEffect(() => {
    // setSpinLoading(true);
    // setTimeout(() => {
    setCurrentUser({ username: "pit" });
    setSpinLoading(false);
    // }, 1000);
    // new Promise((resolve, reject) => {
    //   AxiosFunction({ url: "/api/auth/currentuser", method: "get", body: {}, queryParams: {} })
    //     .then((res) => {
    //       setCurrentUser(res.data.currentUser);
    //       setSpinLoading(true);
    //       resolve(res);
    //     })
    //     .catch((err) => {
    //       setCurrentUser(null);
    //       setSpinLoading(false);
    //       reject(err);
    //     });
    // });
  }, [currentUser]);

  if (spinLoading) {
    return <Skeleton />;
  }

  return (
    <AuthContext.Provider value={{ authorization: currentUser }}>
      {currentUser ? children : <Auth />}
    </AuthContext.Provider>
  );
}
