"use client";

import Link from "next/link";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import { useAuth } from "../contexts/AuthContext";

export default function CompletePage() {
  const { updateUser } = useAuth();
  
  useEffect(() => {
    // Mark onboarding as complete
    updateUser({ onboardingComplete: true });
    
    // Rain confetti effect on mount
    const duration = 2 * 1000; // 2 seconds
    const end = Date.now() + duration;

    (function frame() {
      // left side
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#d67469", "#749176", "#211e1d", "#f2e3da"], // coral, sage, charcoal, off-white
      });
      // right side
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#d67469", "#749176", "#211e1d", "#f2e3da"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-off-white via-off-white/98 to-off-white/95 flex flex-col items-center justify-center px-4 py-14 relative overflow-hidden">
      {/* Ambient blobs for continuity */}
      <div className="absolute inset-0 opacity-4 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-sage/20 to-sage/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-32 right-16 w-40 h-40 bg-gradient-to-br from-coral/15 to-coral/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-br from-charcoal/10 to-charcoal/3 rounded-full blur-2xl animate-pulse delay-500" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-off-white/30 via-transparent to-off-white/20 pointer-events-none" />

      <div className="w-[90%] max-w-[700px] mx-auto relative z-10 text-center">
        {/* Headline & subhead */}
        <h1 className="font-urbanist text-2 md:text-6xl lg:text-5xl font-700 text-charcoal mb-4">
          You&apos;re all set!
        </h1>
        <p className="font-urbanist text-6 md:text-5 font-400 text-charcoal/70 mb-12">
          Time to discover what&apos;s out there.
        </p>

        {/* Small moving graphic */}
        <div className="relative mx-auto mb-14 h-28 w-full max-w-[420px]">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute bottom-0 left-[15%] w-14 h-14 rounded-full bg-off-white border-2 border-coral flex items-center justify-center animate-[float_4s_ease-in-out_infinite]">
              <ion-icon name="happy-outline" style={{ fontSize: 22, color: "var(--charcoal)" }} />
            </div>
            <div className="absolute bottom-0 left-[45%] w-14 h-14 rounded-full bg-off-white border-2 border-sage flex items-center justify-center animate-[float_4.6s_ease-in-out_infinite] [animation-delay:.4s]">
              <ion-icon name="sparkles-outline" style={{ fontSize: 22, color: "var(--charcoal)" }} />
            </div>
            <div className="absolute bottom-0 left-[75%] w-14 h-14 rounded-full bg-off-white border-2 border-coral flex items-center justify-center animate-[float_5s_ease-in-out_infinite] [animation-delay:.8s]">
              <ion-icon name="checkmark-outline" style={{ fontSize: 22, color: "var(--charcoal)" }} />
            </div>
          </div>
        </div>

        {/* CTA */}
        <Link
          href="/home"
          className="group inline-block w-full bg-sage text-white font-urbanist text-6 md:w-1/4 md:text-5 font-600 py-5 md:py-6 px-8 md:px-10 rounded-3 md:rounded-full shadow-lg transition-transform duration-300 hover:scale-[1.03] hover:bg-coral focus:bg-coral focus:outline-none focus:ring-4 focus:ring-coral/30 focus:ring-offset-2"
        >
          Go to Home
        </Link>
      </div>

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) scale(0.95);
            opacity: 0.0;
          }
          10% {
            opacity: 1;
          }
          50% {
            transform: translateY(-40%) scale(1);
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-90%) scale(0.95);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
