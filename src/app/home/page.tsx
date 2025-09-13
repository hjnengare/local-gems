import Header from "../components/Header/Header";
import BusinessRow from "../components/BusinessRow/BusinessRow";
import EventsSpecials from "../components/EventsSpecials/EventsSpecials";
import CommunityHighlights from "../components/CommunityHighlights/CommunityHighlights";
import TopReviewers from "../components/TopReviewers/TopReviewers";
import { TRENDING_BUSINESSES, NEARBY_FAVORITES } from "../data/businessData";
import { EVENTS_AND_SPECIALS } from "../data/eventsData";
import { FEATURED_REVIEWS, TOP_REVIEWERS, BUSINESSES_OF_THE_MONTH } from "../data/communityHighlightsData";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-off-white via-off-white/98 to-off-white">
      <Header />
      <div className="pt-[124px] md:pt-[144px]">
        <BusinessRow title="For You" businesses={TRENDING_BUSINESSES} cta="View All Trending" />
        <BusinessRow title="Trending Now" businesses={NEARBY_FAVORITES} cta="View All Favorites" />
        <EventsSpecials events={EVENTS_AND_SPECIALS} />
        <CommunityHighlights 
          reviews={FEATURED_REVIEWS} 
          topReviewers={TOP_REVIEWERS}
          businessesOfTheMonth={BUSINESSES_OF_THE_MONTH}
          variant="reviews"
        />
      </div>
    </div>
  );
}