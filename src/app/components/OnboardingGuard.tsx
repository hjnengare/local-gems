"use client";

import { useEffect } from "react";
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

  useEffect(() => {
    if (isLoading) return;

    // Skip guard for non-onboarding routes
    const isOnboardingRoute = ONBOARDING_STEPS.some(step =>
      pathname === step.path || pathname.startsWith(step.path)
    );

    if (!isOnboardingRoute) {
      // Allow access to non-onboarding routes (like /home, /business, etc.)
      return;
    }

    const currentStep = ONBOARDING_STEPS.find(step => pathname === step.path);

    if (!currentStep) return;

    // If user is already onboarded and trying to access onboarding steps, redirect to home
    if (user?.onboardingComplete && pathname !== "/complete") {
      router.push("/home");
      return;
    }

    // If no user and trying to access protected steps, redirect to start
    if (!user && currentStep.path !== "/onboarding" && currentStep.path !== "/register" && currentStep.path !== "/login") {
      router.push("/onboarding");
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

        if (nextIncompleteStep) {
          router.push(nextIncompleteStep.path);
        } else {
          router.push("/onboarding");
        }
        return;
      }
    }

  }, [user, isLoading, pathname, router]);

  // Show loading while checking auth
  if (isLoading) {
    return <PageLoading />;
  }

  return <>{children}</>;
}