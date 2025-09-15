"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { getInterests, getSubInterests, saveUserSelections } from '../lib/supabase';

interface Interest {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

interface OnboardingContextType {
  // Data
  interests: Interest[];
  subInterests: Interest[];
  selectedInterests: string[];
  selectedSubInterests: string[];
  selectedDealbreakers: string[];

  // State
  isLoading: boolean;
  error: string | null;
  currentStep: string;

  // Actions
  loadInterests: () => Promise<void>;
  loadSubInterests: (parentIds?: string[]) => Promise<void>;
  setSelectedInterests: (interests: string[]) => void;
  setSelectedSubInterests: (subInterests: string[]) => void;
  setSelectedDealbreakers: (dealbreakers: string[]) => void;
  nextStep: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

interface OnboardingProviderProps {
  children: ReactNode;
}

const ONBOARDING_STEPS = [
  'interests',
  'subcategories',
  'deal-breakers',
  'complete'
];

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const { user, updateUser } = useAuth();
  const [interests, setInterests] = useState<Interest[]>([]);
  const [subInterests, setSubInterests] = useState<Interest[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedSubInterests, setSelectedSubInterests] = useState<string[]>([]);
  const [selectedDealbreakers, setSelectedDealbreakers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentStep = user?.onboardingStep || 'interests';

  const loadInterests = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getInterests();
      setInterests(data);
    } catch (error: any) {
      console.error('Error loading interests:', error);
      setError('Failed to load interests');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSubInterests = async (parentIds?: string[]) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getSubInterests(parentIds);
      setSubInterests(data);
    } catch (error: any) {
      console.error('Error loading sub-interests:', error);
      setError('Failed to load sub-interests');
    } finally {
      setIsLoading(false);
    }
  };

  const getNextStep = (current: string): string => {
    const currentIndex = ONBOARDING_STEPS.indexOf(current);
    if (currentIndex === -1 || currentIndex === ONBOARDING_STEPS.length - 1) {
      return 'complete';
    }
    return ONBOARDING_STEPS[currentIndex + 1];
  };

  const nextStep = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      const nextStepName = getNextStep(currentStep);

      // Save current step data
      const updates: any = {
        onboardingStep: nextStepName
      };

      if (currentStep === 'interests') {
        updates.interests = selectedInterests;
      } else if (currentStep === 'subcategories') {
        updates.subInterests = selectedSubInterests;
      } else if (currentStep === 'deal-breakers') {
        updates.dealbreakers = selectedDealbreakers;
      }

      await updateUser(updates);

      // Save user selections to database
      if (user.id) {
        const selections: { id: string; type: 'interest' | 'sub_interest' | 'dealbreaker' }[] = [];

        selectedInterests.forEach(id => {
          selections.push({ id, type: 'interest' });
        });

        selectedSubInterests.forEach(id => {
          selections.push({ id, type: 'sub_interest' });
        });

        selectedDealbreakers.forEach(id => {
          selections.push({ id, type: 'dealbreaker' });
        });

        await saveUserSelections(user.id, selections);
      }
    } catch (error: any) {
      console.error('Error proceeding to next step:', error);
      setError('Failed to save progress');
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboarding = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      // Mark onboarding as complete
      await updateUser({
        onboardingComplete: true,
        dealbreakers: selectedDealbreakers
      });

      // Save final selections
      if (user.id) {
        const selections: { id: string; type: 'interest' | 'sub_interest' | 'dealbreaker' }[] = [];

        selectedInterests.forEach(id => {
          selections.push({ id, type: 'interest' });
        });

        selectedSubInterests.forEach(id => {
          selections.push({ id, type: 'sub_interest' });
        });

        selectedDealbreakers.forEach(id => {
          selections.push({ id, type: 'dealbreaker' });
        });

        await saveUserSelections(user.id, selections);
      }
    } catch (error: any) {
      console.error('Error completing onboarding:', error);
      setError('Failed to complete onboarding');
    } finally {
      setIsLoading(false);
    }
  };

  const resetOnboarding = () => {
    setSelectedInterests([]);
    setSelectedSubInterests([]);
    setSelectedDealbreakers([]);
    setError(null);
  };

  const value: OnboardingContextType = {
    // Data
    interests,
    subInterests,
    selectedInterests,
    selectedSubInterests,
    selectedDealbreakers,

    // State
    isLoading,
    error,
    currentStep,

    // Actions
    loadInterests,
    loadSubInterests,
    setSelectedInterests,
    setSelectedSubInterests,
    setSelectedDealbreakers,
    nextStep,
    completeOnboarding,
    resetOnboarding
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}