import Header from "../components/Header/Header";
import BusinessRow from "../components/BusinessRow/BusinessRow";
import { TRENDING_BUSINESSES, NEARBY_FAVORITES } from "../data/businessData";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-off-white via-off-white/98 to-off-white">
      <Header />
      <div className="pt-32">
        <BusinessRow title="Trending Near You" businesses={TRENDING_BUSINESSES} cta="View All Trending" />
        <BusinessRow title="Nearby Favorites" businesses={NEARBY_FAVORITES} cta="View All Favorites" />
      </div>
    </div>
  );
}