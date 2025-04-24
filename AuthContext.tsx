import React, { createContext, useContext, useState } from 'react';
import { AuthContext } from './useApiHook';
import { FetchDataProps } from './fetchFunction';

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
    token?:string|null|undefined;
    customFetchFunction?:(i:FetchDataProps)=>{ data: any; statusCode: number|null; error: string|null|any } 
   
  }
  
  // Update the AuthProvider component
  export const AuthProvider: React.FC<AuthProviderProps> = ({ children, logoutFunction, customActions,baseURL,token,customFetchFunction }) => {

    const [accessToken, setAccessToken] = useState<string|null|undefined>(token);
    const [url, setUrl] = useState(baseURL)

    return (
      <AuthContext.Provider value={{ logout: logoutFunction, customActions,baseURL:url,token:accessToken, setToken:setAccessToken,setBaseURL:setUrl,customFetchFunction }}>
        {children}
      </AuthContext.Provider>
    );
  };


  
