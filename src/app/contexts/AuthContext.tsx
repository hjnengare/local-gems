"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  onboardingStep: string;
  onboardingComplete: boolean;
  interests: string[];
  subInterests: string[];
  dealbreakers: string[];
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Create a dummy user for testing
  const createDummyUser = (email: string): User => ({
    id: 'dummy-user-id',
    email,
    onboardingStep: 'interests',
    onboardingComplete: false,
    interests: [],
    subInterests: [],
    dealbreakers: [],
    createdAt: new Date().toISOString()
  });

  // Load dummy user on mount
  useEffect(() => {
    // Simulate loading delay
    setIsLoading(true);
    setTimeout(() => {
      // Check if user was already "logged in"
      const savedUser = localStorage.getItem('dummyUser');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setIsLoading(false);
    }, 100);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    // Basic validation
    if (!email?.trim() || !password?.trim()) {
      setError('Email and password are required');
      setIsLoading(false);
      return false;
    }

    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Always succeed for dummy auth
    const dummyUser = createDummyUser(email.trim().toLowerCase());
    setUser(dummyUser);
    localStorage.setItem('dummyUser', JSON.stringify(dummyUser));

    // Redirect based on onboarding status
    if (dummyUser.onboardingComplete) {
      router.push('/home');
    } else {
      router.push(`/${dummyUser.onboardingStep}`);
    }

    setIsLoading(false);
    return true;
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    // Basic validation
    if (!email?.trim() || !password?.trim()) {
      setError('Email and password are required');
      setIsLoading(false);
      return false;
    }

    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Always succeed for dummy auth
    const dummyUser = createDummyUser(email.trim().toLowerCase());
    setUser(dummyUser);
    localStorage.setItem('dummyUser', JSON.stringify(dummyUser));

    // Navigate to interests page after registration
    router.push('/interests');
    setIsLoading(false);
    return true;
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    setUser(null);
    setError(null);
    localStorage.removeItem('dummyUser');
    router.push('/onboarding');
    setIsLoading(false);
  };

  const updateUser = async (userData: Partial<User>): Promise<void> => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    // Update user data locally
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('dummyUser', JSON.stringify(updatedUser));

    setIsLoading(false);
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    updateUser,
    isLoading,
    error
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