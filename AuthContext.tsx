import React, { createContext, useContext } from 'react';
import { AuthContext } from './useApiHook';

// Create the Auth context

// AuthProvider component
export const AuthProvider = ({ children, logoutFunction }) => {
  return (
    <AuthContext.Provider value={{ logout: logoutFunction }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use logout from context
export const useAuth = () => useContext(AuthContext);