import { NextResponse } from "next/server";
import { getServerSupabase } from "@/app/lib/supabase/server";

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Business ID is required' },
        { status: 400 }
      );
    }

    const supabase = await getServerSupabase();

    // Query by either ID or slug
    const { data: business, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('status', 'active')
      .or(`id.eq.${id},slug.eq.${id}`)
      .single();

    if (error || !business) {
      console.error('Error fetching business:', error);
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    console.log(`[BUSINESS API] Successfully fetched business: ${business.name} (${business.id})`);

    // Transform database format to component format
    const transformedBusiness = {
      id: business.id,
      name: business.name,
      image: business.image,
      alt: business.alt,
      category: business.category,
      location: business.location,
      rating: business.rating,
      totalRating: business.total_rating,
      reviews: business.reviews,
      badge: business.badge,
      href: business.href || `/business/${business.slug}`,
      percentiles: business.service_percentile && business.price_percentile && business.ambience_percentile ? {
        service: business.service_percentile,
        price: business.price_percentile,
        ambience: business.ambience_percentile
      } : undefined,
      verified: business.verified,
      distance: business.distance_km ? `${business.distance_km} km` : undefined,
      priceRange: business.price_range,
      // Additional fields for business profile page
      description: business.description,
      phone: business.phone,
      website: business.website,
      address: business.address,
      slug: business.slug,
      // Extended profile data (default values for missing schema columns)
      trust: 95,
      punctuality: 89,
      friendliness: 92,
      specials: [
        { id: 1, name: "Daily Special", description: "Ask staff", icon: "restaurant" }
      ],
    };

    return NextResponse.json({ data: transformedBusiness });

  } catch (error) {
    console.error('Error in individual business API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}