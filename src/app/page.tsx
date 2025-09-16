"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./contexts/AuthContext";

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    // Smart routing based on user state
    if (user) {
      // User is logged in, go to main app
      router.push("/home");
    } else {
      // New user, show onboarding
      router.push("/onboarding");
    }
  }, [router, user, isLoading]);

  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4">
          <div className="w-full h-full border-4 border-sage border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h1 className="font-urbanist text-4 font-700 text-charcoal mb-2">
          KLIO
        </h1>
        <p className="font-urbanist text-6 font-400 text-charcoal/70">
          {isLoading ? "Checking your session..." : "Getting ready..."}
        </p>
      </div>
    </div>
  );
}