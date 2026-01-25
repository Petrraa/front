import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { loginUser, registerUser } from '../api/api';
import type { RegisterData } from '../api/api';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (loginValue: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Restore user on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = async (loginValue: string, password: string) => {
    const { data } = await loginUser({ login: loginValue, password });
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  const register = async (data: RegisterData) => {
    const { data: res } = await registerUser(data);
    setUser(res.user);
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
