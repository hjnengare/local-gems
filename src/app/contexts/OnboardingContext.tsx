"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

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

// Dummy data for interests
const DUMMY_INTERESTS: Interest[] = [
  { id: 'food', name: 'Food & Dining', description: 'Restaurants, cafes, and culinary experiences', icon: 'restaurant' },
  { id: 'entertainment', name: 'Entertainment', description: 'Movies, shows, and nightlife', icon: 'musical-notes' },
  { id: 'shopping', name: 'Shopping', description: 'Retail stores and markets', icon: 'bag' },
  { id: 'health', name: 'Health & Wellness', description: 'Gyms, spas, and medical services', icon: 'fitness' },
  { id: 'services', name: 'Services', description: 'Professional and personal services', icon: 'construct' },
  { id: 'automotive', name: 'Automotive', description: 'Car services and repairs', icon: 'car' },
  { id: 'home', name: 'Home & Garden', description: 'Home improvement and gardening', icon: 'home' },
  { id: 'beauty', name: 'Beauty & Personal Care', description: 'Salons and personal care services', icon: 'cut' }
];

// Dummy data for subcategories
const DUMMY_SUB_INTERESTS: Interest[] = [
  // Food subcategories
  { id: 'restaurants', name: 'Restaurants', description: 'Fine dining and casual restaurants' },
  { id: 'cafes', name: 'Cafes & Coffee Shops', description: 'Coffee shops and casual cafes' },
  { id: 'fast-food', name: 'Fast Food', description: 'Quick service restaurants' },
  { id: 'bakeries', name: 'Bakeries', description: 'Bakeries and pastry shops' },

  // Entertainment subcategories
  { id: 'movies', name: 'Movie Theaters', description: 'Cinemas and movie theaters' },
  { id: 'bars', name: 'Bars & Pubs', description: 'Drinking establishments' },
  { id: 'clubs', name: 'Nightclubs', description: 'Dance clubs and nightlife' },
  { id: 'concerts', name: 'Live Music', description: 'Concert venues and live music' },

  // Shopping subcategories
  { id: 'clothing', name: 'Clothing Stores', description: 'Fashion and apparel stores' },
  { id: 'electronics', name: 'Electronics', description: 'Electronic goods and gadgets' },
  { id: 'grocery', name: 'Grocery Stores', description: 'Supermarkets and grocery stores' },
  { id: 'specialty', name: 'Specialty Shops', description: 'Unique and specialty retail' },

  // Health subcategories
  { id: 'gyms', name: 'Gyms & Fitness', description: 'Fitness centers and gyms' },
  { id: 'spas', name: 'Spas & Wellness', description: 'Spas and wellness centers' },
  { id: 'medical', name: 'Medical Services', description: 'Healthcare and medical services' },
  { id: 'dental', name: 'Dental Care', description: 'Dental offices and services' }
];

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [interests, setInterests] = useState<Interest[]>([]);
  const [subInterests, setSubInterests] = useState<Interest[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedSubInterests, setSelectedSubInterests] = useState<string[]>([]);
  const [selectedDealbreakers, setSelectedDealbreakers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentStep = user?.onboardingStep || 'interests';

  const loadInterests = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 300));
      setInterests(DUMMY_INTERESTS);
    } catch (error) {
      console.error('Error loading interests:', error);
      setError('Failed to load interests');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadSubInterests = useCallback(async (parentIds?: string[]) => {
    try {
      setIsLoading(true);
      setError(null);
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 300));
      // Filter subcategories based on selected interests (dummy logic)
      let filteredSubInterests = DUMMY_SUB_INTERESTS;
      if (parentIds && parentIds.length > 0) {
        // For demo purposes, show all subcategories regardless of parent
        filteredSubInterests = DUMMY_SUB_INTERESTS;
      }
      setSubInterests(filteredSubInterests);
    } catch (error) {
      console.error('Error loading sub-interests:', error);
      setError('Failed to load sub-interests');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getNextStep = (current: string): string => {
    const currentIndex = ONBOARDING_STEPS.indexOf(current);
    if (currentIndex === -1 || currentIndex === ONBOARDING_STEPS.length - 1) {
      return 'complete';
    }
    return ONBOARDING_STEPS[currentIndex + 1];
  };

  const getStepCompletionMessage = useCallback((step: string): string => {
    switch (step) {
      case 'interests':
        return `Great! ${selectedInterests.length} interests selected. Let's explore sub-categories!`;
      case 'subcategories':
        return `Perfect! ${selectedSubInterests.length} sub-interests added. Now let's set your dealbreakers.`;
      case 'deal-breakers':
        return `Excellent! ${selectedDealbreakers.length} dealbreakers set. Almost done!`;
      default:
        return 'Step completed successfully!';
    }
  }, [selectedInterests.length, selectedSubInterests.length, selectedDealbreakers.length]);

  const nextStep = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      const nextStepName = getNextStep(currentStep);

      // Save current step data
      const updates: Record<string, unknown> = {
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

      // Note: User selections are now saved locally via updateUser

      // Show success toast for step completion
      const completionMessage = getStepCompletionMessage(currentStep);
      showToast(completionMessage, 'success', 3000);
    } catch (error) {
      console.error('Error proceeding to next step:', error);
      setError('Failed to save progress');
    } finally {
      setIsLoading(false);
    }
  }, [user, currentStep, selectedInterests, selectedSubInterests, selectedDealbreakers, updateUser, showToast, getStepCompletionMessage]);

  const completeOnboarding = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      // Mark onboarding as complete with all final data
      await updateUser({
        onboardingComplete: true,
        onboardingStep: 'complete',
        interests: selectedInterests,
        subInterests: selectedSubInterests,
        dealbreakers: selectedDealbreakers
      });

      // Note: All selections are now saved locally via updateUser

      // Show completion toast
      showToast('🎉 Welcome to KLIO! Your profile is now complete.', 'success', 4000);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      setError('Failed to complete onboarding');
    } finally {
      setIsLoading(false);
    }
  }, [user, selectedInterests, selectedSubInterests, selectedDealbreakers, updateUser, showToast]);

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