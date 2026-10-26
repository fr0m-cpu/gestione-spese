import { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // undefined = sto ancora controllando, null = non loggato
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    api('/auth/me')
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  const value = {
    user,
    login: async (body) => setUser(await api('/auth/login', { method: 'POST', body })),
    register: async (body) => setUser(await api('/auth/register', { method: 'POST', body })),
    logout: async () => {
      await api('/auth/logout', { method: 'POST' });
      setUser(null);
    },
    deleteAccount: async () => {
      await api('/auth/me', { method: 'DELETE' });
      setUser(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
