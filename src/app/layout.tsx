import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import { OnboardingProvider } from "./contexts/OnboardingContext";
import { ToastProvider } from "./contexts/ToastContext";
import PageTransitionProvider from "./components/Providers/PageTransitionProvider";
import WebVitals from "./components/Performance/WebVitals";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://local-gems.vercel.app'),
  title: "KLIO - Discover trusted KLIO near you",
  description: "Find amazing local businesses, restaurants, and experiences in your area with personalized recommendations and trusted reviews.",
  keywords: "local business, restaurants, reviews, recommendations, KLIO",
  authors: [{ name: "KLIO" }],
  creator: "KLIO",
  openGraph: {
    title: "KLIO - Discover trusted local gems near you!",
    description: "Find amazing local businesses, restaurants, and experiences in your area with personalized recommendations and trusted reviews.",
    url: "/",
    siteName: "KLIO",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "KLIO - Discover trusted KLIO near you",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KLIO - Discover trusted KLIO near you",
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
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://unpkg.com" crossOrigin="" />
        <link rel="canonical" href="/" />
        {/* Ionicons: Simple and reliable setup */}
        <Script
          src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"
          type="module"
          strategy="afterInteractive"
        />
        <Script
          src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"
          noModule
          strategy="afterInteractive"
        />
      </head>
      <body className={urbanist.className}>
        <WebVitals />
        <ErrorBoundary>
          <ToastProvider>
            <AuthProvider>
              <OnboardingProvider>
                <PageTransitionProvider>
                  {children}
                </PageTransitionProvider>
              </OnboardingProvider>
            </AuthProvider>
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
