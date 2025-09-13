"use client";

import Footer from "../components/Footer/Footer";

interface LeaderboardUser {
  rank: number;
  username: string;
  reviews: number;
  badge?: string;
}

const topReviewers: LeaderboardUser[] = [
  { rank: 1, username: "Observer", reviews: 25, badge: "🥇" },
  { rank: 2, username: "Ghost", reviews: 20, badge: "🥈" },
  { rank: 3, username: "Reviewer", reviews: 15, badge: "🥉" },
  { rank: 4, username: "LocalGuru", reviews: 12 },
  { rank: 5, username: "TasteExplorer", reviews: 10 },
  { rank: 6, username: "CityScout", reviews: 8 },
  { rank: 7, username: "GemHunter", reviews: 7 },
  { rank: 8, username: "ReviewMaster", reviews: 6 }
];

interface BusinessOfMonth {
  name: string;
  rating: number;
  category: string;
}

const businessOfMonth: BusinessOfMonth[] = [
  { name: "Mama's Kitchen", rating: 4.9, category: "Restaurant" },
  { name: "Bella's Hair", rating: 4.8, category: "Beauty" },
  { name: "Fresh Flowers", rating: 4.9, category: "Florist" },
  { name: "Ocean Kloof", rating: 4.9, category: "Restaurant" },
  { name: "Apple Store", rating: 4.5, category: "Tech" },
  { name: "Pet Store A", rating: 4.9, category: "Pets" }
];

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-light-gray px-4 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <h1 className="font-urbanist text-5 font-700 text-hoockers-green">Local Gems</h1>
          <button className="p-2 rounded-full hover:bg-cultured-1 transition-colors duration-1">
            <ion-icon name="person-outline" size="small"></ion-icon>
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h2 className="font-urbanist text-3 font-700 text-black mb-2">
            Community Highlights
          </h2>
          <p className="font-urbanist text-6 font-400 text-gray-web">
            Top Reviewers This Month in Claremont
          </p>
        </div>

        {/* Top Reviewers Leaderboard */}
        <div className="bg-cultured-1 rounded-3 shadow-1 p-6 mb-8">
          <h3 className="font-urbanist text-5 font-600 text-black mb-6 text-center">
            Top Reviewers This Month
          </h3>
          
          {/* Top 3 Podium */}
          <div className="flex justify-center items-end space-x-4 mb-8">
            {/* 2nd Place */}
            <div className="text-center">
              <div className="w-16 h-16 bg-spanish-gray rounded-full flex items-center justify-center mb-2">
                <span className="font-urbanist text-5 font-700 text-white">2</span>
              </div>
              <div className="bg-white rounded-3 p-3 min-w-[120px]">
                <div className="text-2xl mb-1">🥈</div>
                <div className="font-urbanist text-7 font-600 text-black">@{topReviewers[1].username}</div>
                <div className="font-urbanist text-8 font-400 text-gray-web">{topReviewers[1].reviews} reviews</div>
              </div>
            </div>

            {/* 1st Place */}
            <div className="text-center">
              <div className="w-20 h-20 bg-hoockers-green rounded-full flex items-center justify-center mb-2">
                <span className="font-urbanist text-4 font-700 text-white">1</span>
              </div>
              <div className="bg-white rounded-3 p-4 min-w-[140px] border-2 border-hoockers-green">
                <div className="text-3xl mb-1">🥇</div>
                <div className="font-urbanist text-6 font-700 text-black">@{topReviewers[0].username}</div>
                <div className="font-urbanist text-8 font-400 text-gray-web">{topReviewers[0].reviews} reviews</div>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="text-center">
              <div className="w-16 h-16 bg-light-gray rounded-full flex items-center justify-center mb-2">
                <span className="font-urbanist text-5 font-700 text-white">3</span>
              </div>
              <div className="bg-white rounded-3 p-3 min-w-[120px]">
                <div className="text-2xl mb-1">🥉</div>
                <div className="font-urbanist text-7 font-600 text-black">@{topReviewers[2].username}</div>
                <div className="font-urbanist text-8 font-400 text-gray-web">{topReviewers[2].reviews} reviews</div>
              </div>
            </div>
          </div>

          {/* Rest of Rankings */}
          <div className="space-y-3">
            {topReviewers.slice(3).map((user) => (
              <div key={user.rank} className="flex items-center justify-between bg-white rounded-3 p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-cultured-2 rounded-full flex items-center justify-center">
                    <span className="font-urbanist text-8 font-600 text-gray-web">{user.rank}</span>
                  </div>
                  <span className="font-urbanist text-6 font-600 text-black">@{user.username}</span>
                </div>
                <span className="font-urbanist text-7 font-400 text-gray-web">{user.reviews} reviews</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <button className="font-urbanist text-7 font-500 text-hoockers-green hover:underline">
              See leaderboard...
            </button>
          </div>
        </div>

        {/* Businesses of the Month */}
        <div className="bg-white rounded-3 shadow-1 p-6 mb-8">
          <h3 className="font-urbanist text-5 font-600 text-black mb-6">
            Businesses of the Month
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {businessOfMonth.map((business, index) => (
              <div key={index} className="bg-cultured-1 rounded-3 p-4 text-center">
                <div className="w-12 h-12 bg-hoockers-green rounded-3 mx-auto mb-3 flex items-center justify-center">
                  <ion-icon name="star" style={{ color: 'white' }} size="small"></ion-icon>
                </div>
                <h4 className="font-urbanist text-6 font-600 text-black mb-1">{business.name}</h4>
                <p className="font-urbanist text-8 font-400 text-gray-web mb-2">{business.category}</p>
                <div className="flex items-center justify-center space-x-1">
                  <ion-icon name="star" style={{ color: "#589f6a" }} size="small"></ion-icon>
                  <span className="font-urbanist text-8 font-500 text-black">{business.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <Footer variant="bottom-nav" />

      {/* Bottom padding for fixed nav */}
      <div className="h-16"></div>
    </div>
  );
}