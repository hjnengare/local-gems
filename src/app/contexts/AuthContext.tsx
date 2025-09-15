"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, createProfile, getProfile, updateProfile, Profile } from '../lib/supabase';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

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
    } catch (error: any) {
      console.error('Error loading user profile:', error);
      setError('Failed to load user profile');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
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

        return true;
      }

      setIsLoading(false);
      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
        setIsLoading(false);
        return false;
      }

      if (data.user) {
        // Create profile for new user
        try {
          await createProfile(data.user.id);
          await loadUserProfile(data.user.id, data.user.email!);

          // Navigate to interests page after successful registration
          router.push('/interests');
          return true;
        } catch (profileError: any) {
          console.error('Error creating profile:', profileError);
          setError('Failed to create user profile');
          setIsLoading(false);
          return false;
        }
      }

      setIsLoading(false);
      return false;
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.message);
      setIsLoading(false);
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
    } catch (error: any) {
      console.error('Logout error:', error);
      setError(error.message);
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
    } catch (error: any) {
      console.error('Update user error:', error);
      setError(error.message);
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
    } catch (error: any) {
      console.error('Reset password error:', error);
      setError(error.message);
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