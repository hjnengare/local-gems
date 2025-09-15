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

  // Simplified navigation logic to fix registration loop
  const handleNavigation = useCallback(() => {
    if (isLoading) return;

    // Skip guard for non-onboarding routes
    if (!isOnboardingRoute) return;

    // If user is already onboarded and trying to access onboarding steps, redirect to home
    if (user?.onboardingComplete && pathname !== "/complete") {
      router.replace("/home");
      return;
    }

    // If no user and trying to access protected steps, redirect to start
    if (!user && pathname !== "/onboarding" && pathname !== "/register" && pathname !== "/login") {
      router.replace("/onboarding");
      return;
    }

    // For registration flow - allow progression
    if (user && pathname === "/interests") {
      // User is logged in and going to interests - allow it
      return;
    }

    // For other steps, check basic requirements
    if (pathname === "/subcategories" && user && (!user.interests || user.interests.length === 0)) {
      router.replace("/interests");
      return;
    }

    if (pathname === "/deal-breakers" && user && (!user.subInterests || user.subInterests.length === 0)) {
      router.replace("/subcategories");
      return;
    }

    if (pathname === "/complete" && user && (!user.dealbreakers || user.dealbreakers.length < 2)) {
      router.replace("/deal-breakers");
      return;
    }
  }, [user, isLoading, pathname, router, isOnboardingRoute]);

  useEffect(() => {
    handleNavigation();
  }, [handleNavigation]);

  // Show loading while checking auth
  if (isLoading) {
    return <PageLoading />;
  }

  return <>{children}</>;
}