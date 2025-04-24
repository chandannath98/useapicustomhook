import { useContext } from "react";
import { AuthContext } from "./useApiHook";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { token, setToken, baseURL, setBaseURL } = context;

  return { token, setToken, baseURL, setBaseURL };
};
