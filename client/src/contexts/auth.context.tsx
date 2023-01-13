import React, { useContext } from "react";
import Auth from "src/components/Auth";

export const AuthContext = React.createContext(null);

export function useAuth() {
  const userValue = useContext(AuthContext);
  if (!userValue) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return userValue;
}

export function AuthProvider({ children, currentUser }) {
  return <AuthContext.Provider value={currentUser}>{currentUser ? children : <Auth />}</AuthContext.Provider>;
}
