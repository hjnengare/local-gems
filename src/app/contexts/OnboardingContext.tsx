"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useAuth, User } from "./AuthContext";
import { ONBOARDING_STEPS, OnboardingStep } from "./onboarding-steps";

interface OnboardingContextType {
  canAccessRoute: (path: string) => boolean;
  getNextIncompleteStep: () => OnboardingStep | null;
  getCurrentStep: (path: string) => OnboardingStep | null;
  isStepComplete: (path: string) => boolean;
  getCompletionProgress: () => {
    completed: number;
    total: number;
    percentage: number;
  };
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

interface OnboardingProviderProps {
  children: ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const { user } = useAuth();

  const canAccessRoute = (path: string): boolean => {
    const step = ONBOARDING_STEPS.find(s => s.path === path);

    if (!step) return true; // Non-onboarding routes are always accessible

    // If user is completed onboarding, they can access any route
    if (user?.onboardingComplete) return true;

    // Check if required previous steps are complete
    if (step.requiredPrevious && user) {
      return step.requiredPrevious.every(previousPath => {
        const previousStep = ONBOARDING_STEPS.find(s => s.path === previousPath);
        return previousStep ? previousStep.isComplete(user) : false;
      });
    }

    // For steps without requirements (like /onboarding, /register, /login)
    return true;
  };

  const getNextIncompleteStep = (): OnboardingStep | null => {
    if (!user) return ONBOARDING_STEPS.find(s => s.path === "/onboarding") || null;

    if (user.onboardingComplete) return null;

    // Find first incomplete step
    return ONBOARDING_STEPS.find(step => !step.isComplete(user)) || null;
  };

  const getCurrentStep = (path: string): OnboardingStep | null => {
    return ONBOARDING_STEPS.find(step => step.path === path) || null;
  };

  const isStepComplete = (path: string): boolean => {
    const step = getCurrentStep(path);
    if (!step) return true;
    return step.isComplete(user);
  };

  const getCompletionProgress = () => {
    if (!user) {
      return { completed: 0, total: ONBOARDING_STEPS.length, percentage: 0 };
    }

    const completed = ONBOARDING_STEPS.filter(step => step.isComplete(user)).length;
    const total = ONBOARDING_STEPS.length;
    const percentage = Math.round((completed / total) * 100);

    return { completed, total, percentage };
  };

  const value: OnboardingContextType = {
    canAccessRoute,
    getNextIncompleteStep,
    getCurrentStep,
    isStepComplete,
    getCompletionProgress,
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
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}