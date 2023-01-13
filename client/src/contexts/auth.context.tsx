import React, { useContext } from "react";

export const AuthContext = React.createContext(null);

export function useAuth() {
  const userValue = useContext(AuthContext);
  if (!userValue) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return userValue;
}
