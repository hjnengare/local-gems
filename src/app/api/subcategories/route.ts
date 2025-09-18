import { NextResponse } from "next/server";
import { createServerSupabase } from "../../lib/supabase/server";

// Fallback subcategories data
const FALLBACK_SUBCATEGORIES = [
  // Food & Drink
  { id: "restaurants", label: "Restaurants", interest_id: "food-drink" },
  { id: "cafes", label: "Cafes & Coffee", interest_id: "food-drink" },
  { id: "bars", label: "Bars & Pubs", interest_id: "food-drink" },
  { id: "fast-food", label: "Fast Food", interest_id: "food-drink" },
  { id: "fine-dining", label: "Fine Dining", interest_id: "food-drink" },

  // Arts & Culture
  { id: "museums", label: "Museums", interest_id: "arts-culture" },
  { id: "galleries", label: "Art Galleries", interest_id: "arts-culture" },
  { id: "theaters", label: "Theaters", interest_id: "arts-culture" },
  { id: "concerts", label: "Concerts", interest_id: "arts-culture" },
  { id: "cultural-events", label: "Cultural Events", interest_id: "arts-culture" },

  // Home & Services
  { id: "home-improvement", label: "Home Improvement", interest_id: "home-services" },
  { id: "cleaning", label: "Cleaning Services", interest_id: "home-services" },
  { id: "repair-maintenance", label: "Repair & Maintenance", interest_id: "home-services" },
  { id: "landscaping", label: "Landscaping", interest_id: "home-services" },

  // Shopping & Lifestyle
  { id: "fashion", label: "Fashion & Clothing", interest_id: "shopping-lifestyle" },
  { id: "electronics", label: "Electronics", interest_id: "shopping-lifestyle" },
  { id: "home-decor", label: "Home Decor", interest_id: "shopping-lifestyle" },
  { id: "books", label: "Books & Media", interest_id: "shopping-lifestyle" },

  // Outdoors & Adventure
  { id: "hiking", label: "Hiking", interest_id: "outdoors-adventure" },
  { id: "cycling", label: "Cycling", interest_id: "outdoors-adventure" },
  { id: "water-sports", label: "Water Sports", interest_id: "outdoors-adventure" },
  { id: "camping", label: "Camping", interest_id: "outdoors-adventure" },

  // Nightlife & Entertainment
  { id: "nightclubs", label: "Nightclubs", interest_id: "nightlife-entertainment" },
  { id: "live-music", label: "Live Music", interest_id: "nightlife-entertainment" },
  { id: "comedy", label: "Comedy Shows", interest_id: "nightlife-entertainment" },
  { id: "karaoke", label: "Karaoke", interest_id: "nightlife-entertainment" },

  // Beauty & Wellness
  { id: "gyms", label: "Gyms & Fitness", interest_id: "beauty-wellness" },
  { id: "spas", label: "Spas", interest_id: "beauty-wellness" },
  { id: "salons", label: "Hair Salons", interest_id: "beauty-wellness" },
  { id: "wellness", label: "Wellness Centers", interest_id: "beauty-wellness" },

  // Family & Pets
  { id: "family-activities", label: "Family Activities", interest_id: "family-pets" },
  { id: "pet-services", label: "Pet Services", interest_id: "family-pets" },
  { id: "childcare", label: "Childcare", interest_id: "family-pets" },
  { id: "playgrounds", label: "Playgrounds", interest_id: "family-pets" }
];

export async function GET(req: Request) {
  try {
    const supabase = await createServerSupabase();
    const url = new URL(req.url);
    const idsParam = url.searchParams.get("interests");
    const ids = idsParam
      ? idsParam.split(",").map(s => s.trim()).filter(Boolean)
      : [];

    // Try database first
    try {
      let query = supabase
        .from("subcategories")
        .select("id,label,interest_id");

      if (ids.length) query = query.in("interest_id", ids);

      const { data, error } = await query.order("label", { ascending: true });

      if (!error && data) {
        return NextResponse.json({ subcategories: data });
      }

      console.warn("Database query failed, using fallback data:", error?.message);
    } catch (dbError) {
      console.warn("Database connection failed, using fallback data:", dbError);
    }

    // Fallback to static data
    let subcategories = FALLBACK_SUBCATEGORIES;

    // Filter by interest IDs if provided
    if (ids.length > 0) {
      subcategories = FALLBACK_SUBCATEGORIES.filter(sub =>
        ids.includes(sub.interest_id)
      );
    }

    return NextResponse.json({ subcategories });

  } catch (error) {
    console.error("Subcategories API error:", error);
    return NextResponse.json({
      error: "Failed to load subcategories",
      subcategories: []
    }, { status: 500 });
  }
}