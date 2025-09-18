"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface Interest {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

interface Subcategory {
  id: string;
  label: string;
  interest_id: string;
}

interface OnboardingContextType {
  // Data
  interests: Interest[];
  subInterests: Subcategory[];
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

// Fallback data in case API fails
const FALLBACK_INTERESTS: Interest[] = [
  { id: 'food-drink', name: 'Food & Drink', description: 'Restaurants, cafes, and culinary experiences', icon: 'restaurant' },
  { id: 'beauty-wellness', name: 'Beauty & Wellness', description: 'Gyms, spas, and personal care services', icon: 'cut' },
  { id: 'home-services', name: 'Home & Services', description: 'Home improvement and professional services', icon: 'home' },
  { id: 'outdoors-adventure', name: 'Outdoors & Adventure', description: 'Outdoor activities and adventures', icon: 'bicycle' },
  { id: 'nightlife-entertainment', name: 'Nightlife & Entertainment', description: 'Movies, shows, and nightlife', icon: 'musical-notes' },
  { id: 'arts-culture', name: 'Arts & Culture', description: 'Museums, galleries, and cultural experiences', icon: 'color-palette' },
  { id: 'family-pets', name: 'Family & Pets', description: 'Family activities and pet services', icon: 'heart' },
  { id: 'shopping-lifestyle', name: 'Shopping & Lifestyle', description: 'Retail stores and lifestyle services', icon: 'bag' }
];

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [interests, setInterests] = useState<Interest[]>([]);
  const [subInterests, setSubInterests] = useState<Subcategory[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedSubInterests, setSelectedSubInterests] = useState<string[]>([]);
  const [selectedDealbreakers, setSelectedDealbreakers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentStep = user?.profile?.onboarding_step || 'interests';

  const loadInterests = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load from catalog API
      const response = await fetch('/api/interests');
      if (response.ok) {
        const data = await response.json();
        if (data.interests && Array.isArray(data.interests)) {
          setInterests(data.interests);
          return;
        }
      }

      // Fallback to static data if API fails
      console.warn('Interests API failed, using fallback data');
      setInterests(FALLBACK_INTERESTS);
    } catch (error) {
      console.error('Error loading interests:', error);
      setError('Failed to load interests');
      // Use fallback data even on error
      setInterests(FALLBACK_INTERESTS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadSubInterests = useCallback(async (interestIds: string[]) => {
    try {
      setIsLoading(true);
      setError(null);

      const qs = interestIds.length ? `?interests=${interestIds.join(",")}` : "";
      const res = await fetch(`/api/subcategories${qs}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load subcategories");
      const { subcategories } = await res.json();

      // Set subcategories directly - they should be {id,label,interest_id}
      setSubInterests(subcategories);
      console.log("loaded subInterests", subcategories);
    } catch (error) {
      console.error('Error loading sub-interests:', error);
      setError('Failed to load sub-interests');
      setSubInterests([]);
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
      const profileUpdates: Record<string, unknown> = {
        onboarding_step: nextStepName
      };

      if (currentStep === 'interests') {
        profileUpdates.interests = selectedInterests;
      } else if (currentStep === 'subcategories') {
        profileUpdates.sub_interests = selectedSubInterests;
      } else if (currentStep === 'deal-breakers') {
        profileUpdates.dealbreakers = selectedDealbreakers;
      }

      await updateUser({ profile: profileUpdates });

      // Show success toast for step completion
      const completionMessage = getStepCompletionMessage(currentStep);
      showToast(completionMessage, 'success', 3000);

      // Navigate to the next step
      if (nextStepName === 'complete') {
        router.push('/home');
      } else if (nextStepName === 'subcategories' && currentStep === 'interests') {
        // Pass selected interests as URL params to subcategories
        const interestParams = selectedInterests.length > 0
          ? `?interests=${selectedInterests.join(',')}`
          : '';
        router.push(`/subcategories${interestParams}`);
      } else {
        router.push(`/${nextStepName}`);
      }
    } catch (error) {
      console.error('Error proceeding to next step:', error);
      setError('Failed to save progress');
    } finally {
      setIsLoading(false);
    }
  }, [user, currentStep, selectedInterests, selectedSubInterests, selectedDealbreakers, updateUser, showToast, getStepCompletionMessage, router]);

  const completeOnboarding = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      // Mark onboarding as complete with all final data
      await updateUser({
        profile: {
          onboarding_complete: true,
          onboarding_step: 'complete',
          interests: selectedInterests,
          sub_interests: selectedSubInterests,
          dealbreakers: selectedDealbreakers
        }
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