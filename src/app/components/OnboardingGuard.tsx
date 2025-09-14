"use client";

import { useEffect, useMemo, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { ONBOARDING_STEPS, OnboardingStep } from "../contexts/onboarding-steps";
import PageLoading from "./Loading/PageLoading";

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export default function OnboardingGuard({ children }: OnboardingGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Memoize expensive calculations
  const isOnboardingRoute = useMemo(() =>
    ONBOARDING_STEPS.some(step => pathname === step.path || pathname.startsWith(step.path)),
    [pathname]
  );

  const currentStep = useMemo(() =>
    ONBOARDING_STEPS.find(step => pathname === step.path),
    [pathname]
  );

  // Memoize navigation logic
  const handleNavigation = useCallback(() => {
    if (isLoading || !currentStep) return;

    // Skip guard for non-onboarding routes
    if (!isOnboardingRoute) return;

    // If user is already onboarded and trying to access onboarding steps, redirect to home
    if (user?.onboardingComplete && pathname !== "/complete") {
      router.replace("/home");
      return;
    }

    // If no user and trying to access protected steps, redirect to start
    if (!user && currentStep.path !== "/onboarding" && currentStep.path !== "/register" && currentStep.path !== "/login") {
      router.replace("/onboarding");
      return;
    }

    // Check if user has completed required previous steps
    if (currentStep.requiredPrevious && user) {
      const incompletePrevious = currentStep.requiredPrevious.find(previousPath => {
        const previousStep = ONBOARDING_STEPS.find(step => step.path === previousPath);
        return previousStep && !previousStep.isComplete(user);
      });

      if (incompletePrevious) {
        // Find the next incomplete step to redirect to
        const nextIncompleteStep = ONBOARDING_STEPS.find(step =>
          step.requiredPrevious && !step.isComplete(user)
        );

        const redirectPath = nextIncompleteStep?.path || "/onboarding";
        router.replace(redirectPath);
        return;
      }
    }
  }, [user, isLoading, pathname, router, isOnboardingRoute, currentStep]);

  useEffect(() => {
    handleNavigation();
  }, [handleNavigation]);

  // Show loading while checking auth
  if (isLoading) {
    return <PageLoading />;
  }

  return <>{children}</>;
}