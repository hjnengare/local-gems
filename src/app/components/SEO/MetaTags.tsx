import { Metadata } from "next";

interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
}

export function generateMetadata({
  title = "Local Gems - Discover Amazing Local Businesses",
  description = "Find and review the best local businesses in your area. Discover hidden gems, read authentic reviews, and connect with your local community.",
  keywords = ["local business", "reviews", "community", "discover", "restaurants", "services"],
  ogImage = "/og-image.jpg",
  canonical,
}: MetaTagsProps = {}): Metadata {
  return {
    title,
    description,
    keywords: keywords.join(", "),
    authors: [{ name: "Local Gems Team" }],
    openGraph: {
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      type: "website",
      siteName: "Local Gems",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
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
    ...(canonical && { alternates: { canonical } }),
  };
}