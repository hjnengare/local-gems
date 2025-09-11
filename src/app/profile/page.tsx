"use client";

import Link from "next/link";

export default function ProfilePage() {
  const user = {
    username: "JessClLeigh",
    profilePicture: null,
    title: "Top Reviewer in Cape Town this Month",
    stats: {
      reviews: 124,
      badges: 3,
      memberSince: "Jan 1 '23"
    },
    contributions: [
      { business: "Mama's Kitchen", rating: 4, date: "Feb 2023" },
      { business: "Tiger's Milk", rating: 4, date: "March 2023" }
    ],
    achievements: [
      "Trust Expert",
      "Top Reviewer in Cape Town March 2023"
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
          <h1 className="font-urbanist text-5 font-700 text-black">Profile</h1>
          <Link href="/profile/edit" className="text-hoockers-green">
            <ion-icon name="create-outline" size="small"></ion-icon>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="bg-white rounded-3 shadow-1 p-6 mb-6">
          <div className="flex items-start space-x-4 mb-4">
            {/* Profile Picture */}
            <div className="w-20 h-20 bg-hoockers-green rounded-full flex items-center justify-center flex-shrink-0">
              <span className="font-urbanist text-4 font-700 text-white">
                {user.username[0]}
              </span>
            </div>
            
            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h2 className="font-urbanist text-4 font-700 text-black">@{user.username}</h2>
              </div>
              <div className="flex items-center space-x-2 mb-3">
                <ion-icon name="trophy" style={{ color: "#589f6a" }} size="small"></ion-icon>
                <span className="font-urbanist text-7 font-500 text-hoockers-green">
                  {user.title}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="bg-cultured-1 rounded-3 p-4">
            <h3 className="font-urbanist text-6 font-600 text-black mb-3">Stats Overview</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <ion-icon name="star-outline" style={{ color: "#589f6a" }} size="small"></ion-icon>
                  <span className="font-urbanist text-6 font-700 text-black">{user.stats.reviews}</span>
                </div>
                <span className="font-urbanist text-8 font-400 text-gray-web">reviews</span>
              </div>
              <div>
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <ion-icon name="trophy-outline" style={{ color: "#589f6a" }} size="small"></ion-icon>
                  <span className="font-urbanist text-6 font-700 text-black">{user.stats.badges}</span>
                </div>
                <span className="font-urbanist text-8 font-400 text-gray-web">badges</span>
              </div>
              <div>
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <ion-icon name="calendar-outline" style={{ color: "#589f6a" }} size="small"></ion-icon>
                  <span className="font-urbanist text-8 font-400 text-black">{user.stats.memberSince}</span>
                </div>
                <span className="font-urbanist text-8 font-400 text-gray-web">Member since</span>
              </div>
            </div>
          </div>
        </div>

        {/* Your Contributions */}
        <div className="bg-white rounded-3 shadow-1 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-urbanist text-5 font-600 text-black">Your Contributions</h3>
            <button className="font-urbanist text-7 font-500 text-hoockers-green hover:underline">
              See all reviews
            </button>
          </div>
          
          <div className="space-y-4">
            {user.contributions.map((contribution, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-light-gray last:border-b-0">
                <div>
                  <h4 className="font-urbanist text-6 font-600 text-black">
                    - {contribution.business}
                  </h4>
                  <span className="font-urbanist text-8 font-400 text-gray-web">
                    ({contribution.date})
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <ion-icon
                      key={i}
                      name={i < contribution.rating ? "star" : "star-outline"}
                      style={{ color: i < contribution.rating ? "#589f6a" : "#9ca3af" }}
                      size="small"
                    ></ion-icon>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Your Achievements */}
        <div className="bg-white rounded-3 shadow-1 p-6 mb-6">
          <h3 className="font-urbanist text-5 font-600 text-black mb-4">Your Achievements</h3>
          <div className="space-y-3">
            {user.achievements.map((achievement, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-pale-spring-bud rounded-3">
                <div className="w-8 h-8 bg-hoockers-green rounded-full flex items-center justify-center">
                  <ion-icon name="trophy" style={{ color: 'white' }} size="small"></ion-icon>
                </div>
                <span className="font-urbanist text-6 font-500 text-black">{achievement}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-3 shadow-1 p-6">
          <div className="space-y-4">
            <button className="flex items-center space-x-3 w-full text-left p-3 hover:bg-cultured-1 rounded-3 transition-colors duration-1">
              <ion-icon name="settings-outline" style={{ color: "#8b8b8b" }} size="small"></ion-icon>
              <span className="font-urbanist text-6 font-500 text-black">Account Settings</span>
            </button>
            <button className="flex items-center space-x-3 w-full text-left p-3 hover:bg-cultured-1 rounded-3 transition-colors duration-1">
              <ion-icon name="notifications-outline" style={{ color: "#8b8b8b" }} size="small"></ion-icon>
              <span className="font-urbanist text-6 font-500 text-black">Notifications</span>
            </button>
            <button className="flex items-center space-x-3 w-full text-left p-3 hover:bg-cultured-1 rounded-3 transition-colors duration-1">
              <ion-icon name="shield-outline" style={{ color: "#8b8b8b" }} size="small"></ion-icon>
              <span className="font-urbanist text-6 font-500 text-black">Privacy & Data</span>
            </button>
            <button className="flex items-center space-x-3 w-full text-left p-3 hover:bg-cultured-1 rounded-3 transition-colors duration-1 text-red-500">
              <ion-icon name="log-out-outline" style={{ color: "#ef4444" }} size="small"></ion-icon>
              <span className="font-urbanist text-6 font-500">Log Out</span>
            </button>
          </div>
          
          <div className="mt-6 pt-4 border-t border-light-gray text-center">
            <Link 
              href="/home"
              className="inline-flex items-center space-x-2 bg-light-gray text-gray-web font-urbanist text-7 font-500 py-2 px-4 rounded-3 hover:bg-spanish-gray transition-colors duration-1"
            >
              <span>Back</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}