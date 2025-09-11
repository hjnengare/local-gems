"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to onboarding page
    router.push("/onboarding");
  }, [router]);

  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-urbanist text-4 font-700 text-hoockers-green">
          Local Gems
        </h1>
        <p className="font-urbanist text-6 font-400 text-gray-web mt-2">
          Getting ready...
        </p>
      </div>
    </div>
  );
}