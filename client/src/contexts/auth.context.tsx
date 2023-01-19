import { Skeleton } from "antd";
import React, { useContext, useEffect, useState } from "react";
import Auth from "src/components/Auth";
import { AxiosFunction } from "../../pages/api/axios.function";

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

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [spinLoading, setSpinLoading] = useState(true);

  useEffect(() => {
    setSpinLoading(true);
    new Promise((resolve, reject) => {
      AxiosFunction({ url: "/api/auth/currentuser", method: "get", body: {}, params: {} })
        .then((res) => {
          setCurrentUser(res.data.currentUser);
          setSpinLoading(true);
          resolve(res);
        })
        .catch((err) => {
          setCurrentUser(null);
          setSpinLoading(false);
          reject(err);
        });
    });
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
