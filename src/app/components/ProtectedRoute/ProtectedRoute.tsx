"use client";

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiresAuth?: boolean;
  requiresOnboarding?: boolean;
  allowedOnboardingSteps?: string[];
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requiresAuth = true,
  requiresOnboarding = false,
  allowedOnboardingSteps = [],
  redirectTo
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Wait for auth state to load

    // If authentication is required and user is not logged in
    if (requiresAuth && !user) {
      router.push(redirectTo || '/login');
      return;
    }

    // If user is logged in but route doesn't require auth (e.g., login/register pages)
    if (!requiresAuth && user) {
      if (user.onboardingComplete) {
        router.push('/home');
      } else {
        router.push(`/${user.onboardingStep}`);
      }
      return;
    }

    // If onboarding is required but user hasn't completed it
    if (requiresOnboarding && user && !user.onboardingComplete) {
      // Check if current step is allowed
      if (allowedOnboardingSteps.length > 0 && !allowedOnboardingSteps.includes(user.onboardingStep)) {
        router.push(`/${user.onboardingStep}`);
        return;
      }
    }

    // If user has completed onboarding but is trying to access onboarding pages
    if (user && user.onboardingComplete && allowedOnboardingSteps.length > 0) {
      router.push('/home');
      return;
    }
  }, [user, isLoading, router, requiresAuth, requiresOnboarding, allowedOnboardingSteps, redirectTo]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-gradient-to-br from-off-white via-off-white/98 to-off-white/95">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sage/20 border-t-sage rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-urbanist text-base text-charcoal/70">Loading...</p>
        </div>
      </div>
    );
  }

  // If authentication checks pass, render children
  return <>{children}</>;
}

// Convenience wrapper components
export function PublicRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiresAuth={false}>
      {children}
    </ProtectedRoute>
  );
}

export function PrivateRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiresAuth={true}>
      {children}
    </ProtectedRoute>
  );
}

export function OnboardingRoute({
  children,
  step
}: {
  children: ReactNode;
  step: string;
}) {
  return (
    <ProtectedRoute
      requiresAuth={true}
      requiresOnboarding={true}
      allowedOnboardingSteps={[step]}
    >
      {children}
    </ProtectedRoute>
  );
}