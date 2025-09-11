"use client";

import Link from "next/link";
import { useState } from "react";

export default function WriteReviewPage() {
  const [overallRating, setOverallRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [reviewText, setReviewText] = useState("");

  const businessName = "Mama's Kitchen"; // In real app, get from params

  const quickTags = [
    "Trustworthy",
    "On Time", 
    "Friendly",
    "Good Value"
  ];

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleStarClick = (rating: number) => {
    setOverallRating(rating);
  };

  return (
    <div className="min-h-screen bg-off-white">
      {/* Header */}
      <header className="bg-white border-b border-light-gray px-4 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Link href="/business/mamas-kitchen" className="text-hoockers-green">
            <ion-icon name="arrow-back-outline" size="small"></ion-icon>
          </Link>
          <h1 className="font-urbanist text-5 font-700 text-black">Write a Review</h1>
          <div className="w-6"></div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Review Form */}
        <div className="bg-white rounded-3 shadow-1 p-6 mb-6">
          <h2 className="font-urbanist text-4 font-600 text-black mb-6 text-center">
            Write a Review for {businessName}
          </h2>

          {/* Overall Rating */}
          <div className="mb-8">
            <h3 className="font-urbanist text-6 font-600 text-black mb-3">Overall rating</h3>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleStarClick(star)}
                  className="p-1 focus:outline-none"
                >
                  <ion-icon
                    name={star <= overallRating ? "star" : "star-outline"}
                    style={{ 
                      color: star <= overallRating ? "#589f6a" : "#9ca3af",
                      fontSize: "2rem"
                    }}
                  ></ion-icon>
                </button>
              ))}
              <span className="ml-2 font-urbanist text-7 font-400 text-gray-web">
                Tap to select rating
              </span>
            </div>
          </div>

          {/* Quick Tags */}
          <div className="mb-8">
            <h3 className="font-urbanist text-6 font-600 text-black mb-3">
              Choose up to 4 quick tags
            </h3>
            <div className="flex flex-wrap gap-3">
              {quickTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`
                    px-4 py-2 rounded-full border-2 transition-all duration-1 ease-cubic-out font-urbanist text-7 font-500
                    ${selectedTags.includes(tag)
                      ? 'bg-hoockers-green border-hoockers-green text-white'
                      : 'bg-cultured-1 border-light-gray text-black hover:border-hoockers-green'
                    }
                    focus:outline-none focus:ring-2 focus:ring-hoockers-green focus:ring-offset-2
                  `}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Review Text */}
          <div className="mb-8">
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Tell us about your experience..."
              rows={6}
              className="w-full bg-cultured-1 border border-light-gray rounded-3 px-4 py-4 font-urbanist text-6 font-400 text-black placeholder-gray-web focus:outline-none focus:ring-2 focus:ring-hoockers-green focus:border-transparent transition-all duration-1 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button className="bg-cultured-1 text-gray-web font-urbanist text-7 font-500 py-3 px-4 rounded-3 border border-light-gray hover:bg-light-gray transition-colors duration-1">
              Add Voice Note
            </button>
            <button className="bg-cultured-1 text-gray-web font-urbanist text-7 font-500 py-3 px-4 rounded-3 border border-light-gray hover:bg-light-gray transition-colors duration-1">
              Add Photo
            </button>
          </div>

          {/* Submit Button */}
          <button
            className={`
              w-full py-4 px-6 rounded-3 font-urbanist text-6 font-600 transition-all duration-1 ease-cubic-out
              ${overallRating > 0 && reviewText.trim()
                ? 'bg-hoockers-green text-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-hoockers-green focus:ring-offset-2'
                : 'bg-light-gray text-gray-web cursor-not-allowed'
              }
            `}
            disabled={overallRating === 0 || !reviewText.trim()}
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
}