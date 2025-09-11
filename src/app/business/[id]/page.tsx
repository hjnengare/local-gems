"use client";

import Link from "next/link";
import { useState } from "react";

export default function BusinessProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data - in real app this would come from params and API
  const business = {
    name: "Mama's Kitchen",
    rating: 4.3,
    image: null,
    trust: 95,
    punctuality: 89,
    friendliness: 92,
    specials: [
      { id: 1, name: "2 for 1 Pizza", description: "Every day", icon: "pizza" },
      { id: 2, name: "Jazz Night", description: "Mondays", icon: "musical-notes" }
    ],
    reviews: [
      {
        id: 1,
        author: "Jess",
        rating: 5,
        text: "Loved the pizza, staff were so friendly. Food came fast & trustworthy. Bon me friendly!",
        date: "Feb 2023"
      },
      {
        id: 2,
        author: "Hilario",
        rating: 4,
        text: "Terrible anything but food came fast. Bon me",
        date: "March 2023"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-off-white">
      {/* Header */}
      <header className="bg-white border-b border-light-gray px-4 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Link href="/home" className="text-hoockers-green">
            <ion-icon name="arrow-back-outline" size="small"></ion-icon>
          </Link>
          <h1 className="font-urbanist text-5 font-700 text-black">{business.name}</h1>
          <div className="w-6"></div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Business Header */}
        <div className="bg-white rounded-3 shadow-1 p-6 mb-6">
          <div className="flex items-start space-x-4">
            {/* Business Image/Icon */}
            <div className="w-20 h-20 bg-cultured-1 rounded-3 flex items-center justify-center flex-shrink-0">
              <ion-icon name="restaurant-outline" size="large" style={{ color: "#8b8b8b" }}></ion-icon>
            </div>
            
            {/* Business Info */}
            <div className="flex-1">
              <h2 className="font-urbanist text-4 font-700 text-black mb-2">{business.name}</h2>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <ion-icon name="star" style={{ color: "#589f6a" }} size="small"></ion-icon>
                  <span className="font-urbanist text-6 font-600 text-black">{business.rating}</span>
                </div>
              </div>
              
              {/* Trust Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="font-urbanist text-6 font-700 text-hoockers-green">{business.trust}%</div>
                  <div className="font-urbanist text-8 font-400 text-gray-web">Trust</div>
                </div>
                <div className="text-center">
                  <div className="font-urbanist text-6 font-700 text-hoockers-green">{business.punctuality}%</div>
                  <div className="font-urbanist text-8 font-400 text-gray-web">Punctuality</div>
                </div>
                <div className="text-center">
                  <div className="font-urbanist text-6 font-700 text-hoockers-green">{business.friendliness}%</div>
                  <div className="font-urbanist text-8 font-400 text-gray-web">Friendliness</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specials & Events */}
        <div className="bg-white rounded-3 shadow-1 p-6 mb-6">
          <h3 className="font-urbanist text-5 font-600 text-black mb-4">Specials & Events</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {business.specials.map((special) => (
              <div key={special.id} className="bg-cultured-1 rounded-3 p-4 flex items-center space-x-3">
                <div className="w-12 h-12 bg-hoockers-green rounded-3 flex items-center justify-center">
                  <ion-icon name={special.icon} style={{ color: 'white' }} size="small"></ion-icon>
                </div>
                <div>
                  <h4 className="font-urbanist text-6 font-600 text-black">{special.name}</h4>
                  <p className="font-urbanist text-8 font-400 text-gray-web">{special.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-3 shadow-1 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-urbanist text-5 font-600 text-black">Reviews</h3>
            <Link 
              href={`/business/${business.name.toLowerCase().replace(/[^a-z0-9]/g, '')}/review`}
              className="bg-hoockers-green text-white px-4 py-2 rounded-3 font-urbanist text-8 font-500 hover:bg-opacity-90 transition-colors duration-1"
            >
              Write a Review
            </Link>
          </div>
          
          <div className="space-y-4">
            {business.reviews.map((review) => (
              <div key={review.id} className="border-b border-light-gray pb-4 last:border-b-0">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-hoockers-green rounded-full flex items-center justify-center">
                    <span className="font-urbanist text-8 font-600 text-white">
                      {review.author[0]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-urbanist text-7 font-600 text-black">{review.author}</span>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <ion-icon
                            key={i}
                            name={i < review.rating ? "star" : "star-outline"}
                            style={{ color: i < review.rating ? "#589f6a" : "#9ca3af" }}
                            size="small"
                          ></ion-icon>
                        ))}
                      </div>
                      <span className="font-urbanist text-8 font-400 text-gray-web">({review.date})</span>
                    </div>
                    <p className="font-urbanist text-8 font-400 text-black">{review.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}