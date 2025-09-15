"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, createProfile, getProfile, updateProfile, Profile } from '../lib/supabase';
import { authRateLimiter } from '../lib/rateLimiter';
// Lazy load performance tracking to avoid blocking
const trackAuthPerformance = {
  loginStart: () => {},
  loginEnd: () => {},
  registerStart: () => {},
  registerEnd: () => {}
};
// Simplified validation for performance
const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (password: string) => password && password.length >= 6;
import type { Session } from '@supabase/supabase-js';

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
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Convert Profile to User
  const profileToUser = (profile: Profile, email: string): User => ({
    id: profile.id,
    email,
    onboardingStep: profile.onboarding_step,
    onboardingComplete: profile.onboarding_complete,
    interests: profile.interests || [],
    subInterests: profile.sub_interests || [],
    dealbreakers: profile.dealbreakers || [],
    createdAt: profile.created_at
  });

  // Load user session on mount and handle auth state changes
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        loadUserProfile(session.user.id, session.user.email!);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);

        if (session?.user) {
          await loadUserProfile(session.user.id, session.user.email!);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string, email: string) => {
    try {
      setIsLoading(true);
      const profile = await getProfile(userId);
      const user = profileToUser(profile, email);
      setUser(user);
      setError(null);
    } catch (error) {
      console.error('Error loading user profile:', error);
      setError('Failed to load user profile');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      trackAuthPerformance.loginStart();
      setIsLoading(true);
      setError(null);

      // Input validation and sanitization
      if (!email?.trim() || !password?.trim()) {
        setError('Email and password are required');
        setIsLoading(false);
        trackAuthPerformance.loginEnd();
        return false;
      }

      const sanitizedEmail = email.trim().toLowerCase();

      // Rate limiting check
      if (!authRateLimiter.isAllowed(sanitizedEmail)) {
        const remainingTime = Math.ceil(authRateLimiter.getRemainingTime(sanitizedEmail) / (60 * 1000));
        setError(`Too many login attempts. Please try again in ${remainingTime} minutes.`);
        setIsLoading(false);
        trackAuthPerformance.loginEnd();
        return false;
      }

      // Basic validation for performance
      if (!validateEmail(sanitizedEmail)) {
        setError('Please enter a valid email address');
        setIsLoading(false);
        trackAuthPerformance.loginEnd();
        return false;
      }

      if (!validatePassword(password)) {
        setError('Password must be at least 6 characters long');
        setIsLoading(false);
        trackAuthPerformance.loginEnd();
        return false;
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password,
      });

      if (signInError) {
        // Handle network/connection errors gracefully
        if (signInError.message.includes('fetch') || signInError.message.includes('network')) {
          setError('Connection error. Please check your internet connection and try again.');
        } else {
          setError(signInError.message);
        }
        setIsLoading(false);
        return false;
      }

      if (data.user) {
        await loadUserProfile(data.user.id, data.user.email!);

        // Redirect based on onboarding status
        const profile = await getProfile(data.user.id);


        if (profile.onboarding_complete) {
          router.push('/home');
        } else {
          router.push(`/${profile.onboarding_step}`);
        }

        trackAuthPerformance.loginEnd();
        return true;
      }

      setIsLoading(false);
      trackAuthPerformance.loginEnd();
      return false;
    } catch (error) {
      console.error('Login error:', error);

      // Handle different types of errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setError('Connection error. Please check your internet connection and try again.');
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Login failed. Please try again.');
      }

      setIsLoading(false);
      trackAuthPerformance.loginEnd();
      return false;
    }
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    try {
      trackAuthPerformance.registerStart();
      setIsLoading(true);
      setError(null);

      // Input validation and sanitization
      if (!email?.trim() || !password?.trim()) {
        setError('Email and password are required');
        setIsLoading(false);
        trackAuthPerformance.registerEnd();
        return false;
      }

      const sanitizedEmail = email.trim().toLowerCase();

      // Rate limiting check
      if (!authRateLimiter.isAllowed(sanitizedEmail)) {
        const remainingTime = Math.ceil(authRateLimiter.getRemainingTime(sanitizedEmail) / (60 * 1000));
        setError(`Too many registration attempts. Please try again in ${remainingTime} minutes.`);
        setIsLoading(false);
        trackAuthPerformance.registerEnd();
        return false;
      }

      // Basic validation for performance
      if (!validateEmail(sanitizedEmail)) {
        setError('Please enter a valid email address');
        setIsLoading(false);
        trackAuthPerformance.registerEnd();
        return false;
      }

      if (!validatePassword(password)) {
        setError('Password must be at least 6 characters long');
        setIsLoading(false);
        trackAuthPerformance.registerEnd();
        return false;
      }

      console.log('🚀 Starting registration for:', sanitizedEmail);

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password,
      });

      console.log('📝 Registration response:', { data, error: signUpError });

      if (signUpError) {
        console.error('❌ Registration error:', signUpError);
        // Handle network/connection errors gracefully
        if (signUpError.message.includes('fetch') || signUpError.message.includes('network')) {
          setError('Connection error. Please check your internet connection and try again.');
        } else {
          setError(signUpError.message);
        }
        setIsLoading(false);
        return false;
      }

      if (data.user) {
        // Create profile for new user
        try {
          console.log('👤 Creating profile for user:', data.user.id);
          await createProfile(data.user.id);
          await loadUserProfile(data.user.id, data.user.email!);

          console.log('✅ Profile created, redirecting to interests...');
          // Navigate to interests page after successful registration
          router.push('/interests');
          trackAuthPerformance.registerEnd();
          return true;
        } catch (profileError) {
          console.error('Error creating profile:', profileError);
          setError('Failed to create user profile');
          setIsLoading(false);
          trackAuthPerformance.registerEnd();
          return false;
        }
      }

      setIsLoading(false);
      trackAuthPerformance.registerEnd();
      return false;
    } catch (error) {
      console.error('Registration error:', error);

      // Handle different types of errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setError('Connection error. Please check your internet connection and try again.');
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Registration failed. Please try again.');
      }

      setIsLoading(false);
      trackAuthPerformance.registerEnd();
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setError(null);


      router.push('/onboarding');
    } catch (error) {
      console.error('Logout error:', error);
      setError(error instanceof Error ? error.message : 'Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>): Promise<void> => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      // Convert User updates to Profile updates
      const profileUpdates: Partial<Profile> = {};
      if (userData.onboardingStep !== undefined) {
        profileUpdates.onboarding_step = userData.onboardingStep;
      }
      if (userData.onboardingComplete !== undefined) {
        profileUpdates.onboarding_complete = userData.onboardingComplete;
      }
      if (userData.interests !== undefined) {
        profileUpdates.interests = userData.interests;
      }
      if (userData.subInterests !== undefined) {
        profileUpdates.sub_interests = userData.subInterests;
      }
      if (userData.dealbreakers !== undefined) {
        profileUpdates.dealbreakers = userData.dealbreakers;
      }

      const updatedProfile = await updateProfile(user.id, profileUpdates);
      const updatedUser = profileToUser(updatedProfile, user.email);
      setUser(updatedUser);
    } catch (error) {
      console.error('Update user error:', error);
      setError(error instanceof Error ? error.message : 'Update failed');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      setError(null);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(error.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Reset password error:', error);
      setError(error instanceof Error ? error.message : 'Reset password failed');
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    session,
    login,
    register,
    logout,
    updateUser,
    resetPassword,
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