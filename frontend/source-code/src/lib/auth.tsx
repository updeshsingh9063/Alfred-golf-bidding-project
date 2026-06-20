import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { fetchApi } from './api';
import type { User } from './types';

type UserRole = 'subscriber' | 'admin' | null;

interface AuthContextType {
  role: UserRole;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const data = await fetchApi('/auth/me');
        if (data.success && data.data.user) {
          setUser(data.data.user);
          setRole(data.data.user.role);
        } else {
          logout();
        }
      } catch (err) {
        logout();
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      if (data.success) {
        localStorage.setItem('token', data.data.token);
        setUser(data.data.user);
        setRole(data.data.user.role);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      const data = await fetchApi('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      if (data.success) {
        localStorage.setItem('token', data.data.token);
        setUser(data.data.user);
        setRole(data.data.user.role);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Register error:', err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setRole(null);
    setUser(null);
  };

  const refreshUser = async () => {
    await loadUser();
  };

  const isAuthenticated = role !== null;

  return (
    <AuthContext.Provider value={{ role, user, login, register, logout, isAuthenticated, isLoading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
