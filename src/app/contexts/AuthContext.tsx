"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
  onboardingComplete: boolean;
  interests?: string[];
  subcategories?: string[];
  dealBreakers?: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check for existing user session on mount
  useEffect(() => {
    // Only access localStorage on client side
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('local-gems-user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('local-gems-user');
        }
      }
    }
    setIsLoading(false);
  }, []);

  // Dummy users for testing
  const DUMMY_USERS = [
    {
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b169?w=150&h=150&fit=crop&crop=face',
      onboardingComplete: true,
      interests: ['food-drink', 'arts-culture'],
      subcategories: ['sushi', 'galleries'],
      dealBreakers: ['poor-service', 'dirty-environment']
    },
    {
      id: '2',
      username: 'newuser',
      email: 'new@example.com',
      password: 'newpass123',
      onboardingComplete: false,
      interests: [],
      subcategories: [],
      dealBreakers: []
    }
  ];

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = DUMMY_USERS.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      if (typeof window !== 'undefined') {
        localStorage.setItem('local-gems-user', JSON.stringify(userWithoutPassword));
      }
      setIsLoading(false);
      
      // Redirect based on onboarding status
      if (userWithoutPassword.onboardingComplete) {
        router.push('/home');
      } else {
        router.push('/interests');
      }
      
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = DUMMY_USERS.find(u => u.email === email || u.username === username);
    
    if (existingUser) {
      setIsLoading(false);
      return false; // User already exists
    }
    
    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      onboardingComplete: false,
      interests: [],
      subcategories: [],
      dealBreakers: []
    };
    
    // Add to dummy users array (in real app, this would be an API call)
    DUMMY_USERS.push({ ...newUser, password });
    
    setUser(newUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('local-gems-user', JSON.stringify(newUser));
    }
    setIsLoading(false);
    
    // Navigate to interests page after successful registration
    router.push('/interests');
    
    return true;
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('local-gems-user');
    }
    router.push('/onboarding');
  };

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('local-gems-user', JSON.stringify(updatedUser));
    }
    
    // Update in dummy users array
    const userIndex = DUMMY_USERS.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      DUMMY_USERS[userIndex] = { ...DUMMY_USERS[userIndex], ...userData };
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    updateUser,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
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

export type { User };