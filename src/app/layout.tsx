import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import { OnboardingProvider } from "./contexts/OnboardingContext";
import OnboardingGuard from "./components/OnboardingGuard";
import PageTransitionProvider from "./components/Providers/PageTransitionProvider";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Local Gems - Discover trusted local gems near you",
  description: "Find amazing local businesses, restaurants, and experiences in your area with personalized recommendations and trusted reviews.",
  keywords: "local business, restaurants, reviews, recommendations, local gems",
  authors: [{ name: "Local Gems" }],
  creator: "Local Gems",
  openGraph: {
    title: "Local Gems - Discover trusted local gems near you",
    description: "Find amazing local businesses, restaurants, and experiences in your area with personalized recommendations and trusted reviews.",
    url: "/",
    siteName: "Local Gems",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Local Gems - Discover trusted local gems near you",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Local Gems - Discover trusted local gems near you",
    description: "Find amazing local businesses, restaurants, and experiences in your area with personalized recommendations and trusted reviews.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="canonical" href="/" />
      </head>
      <body className={urbanist.className}>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <AuthProvider>
          <OnboardingProvider>
            <OnboardingGuard>
              <PageTransitionProvider>
                {children}
              </PageTransitionProvider>
            </OnboardingGuard>
          </OnboardingProvider>
        </AuthProvider>
        <Script
          src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"
          type="module"
        />
        <Script
          src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"
          noModule
        />
      </body>
    </html>
  );
}
