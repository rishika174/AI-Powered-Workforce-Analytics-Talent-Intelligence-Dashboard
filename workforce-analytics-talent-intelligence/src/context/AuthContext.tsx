import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSession } from '../types';

interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  login: (email: string, role?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(() => {
    const stored = localStorage.getItem('workforce_user_session');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse auth session:', e);
      }
    }
    // Default logged-in executive user for instant SaaS preview
    return {
      id: 'USR-8801',
      name: 'Alexandra Vance',
      email: 'alexandra.vance@workforceintel.ai',
      role: 'VP of Human Resources',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    };
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('workforce_user_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('workforce_user_session');
    }
  }, [user]);

  const login = (email: string, role: 'Employee' | 'HR Admin' | 'Department Manager' = 'HR Admin') => {
    const newUser: UserSession = {
      id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      email,
      role,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
