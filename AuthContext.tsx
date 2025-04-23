import React, { createContext, useContext, useState } from 'react';
import { AuthContext } from './useApiHook';

// Define the type for customActions
type ActionObject = {
    codes: number[];
    action: () => void;
  };
  
  // Define a type for a list of ActionObject
  type CustomActions = ActionObject[];

  
  // Define the AuthProviderProps type
  interface AuthProviderProps {
    children: React.ReactNode;
    logoutFunction?: () => void;
    customActions?: CustomActions;
    baseURL?:string;
    token?:string;
  }
  
  // Update the AuthProvider component
  export const AuthProvider: React.FC<AuthProviderProps> = ({ children, logoutFunction, customActions,baseURL,token }) => {

    const [accessToken, setAccessToken] = useState<string|null>(token)

    return (
      <AuthContext.Provider value={{ logout: logoutFunction, customActions,baseURL,token:accessToken, setToken:setAccessToken }}>
        {children}
      </AuthContext.Provider>
    );
  };


  
