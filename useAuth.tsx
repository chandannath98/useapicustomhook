import { useContext } from 'react';
import { AuthContext } from './useApiHook';

export const useAuth = () => {
  const { token, setToken } = useContext(AuthContext);

  if (token === undefined || setToken === undefined) {
    console.warn('useAuth must be used within an AuthProvider');
  }

  return { token, setToken };
};
