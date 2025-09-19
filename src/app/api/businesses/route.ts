import { NextResponse } from "next/server";
import { getServerSupabase } from "@/app/lib/supabase/server";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20;
    const badge = searchParams.get('badge');
    const verified = searchParams.get('verified');

    const supabase = await getServerSupabase();

    let query = supabase
      .from('businesses')
      .select('*');

    // Apply filters
    if (category) {
      query = query.eq('category', category);
    }

    if (badge) {
      query = query.eq('badge', badge);
    }

    if (verified === 'true') {
      query = query.eq('verified', true);
    }

    // Order by rating and reviews for quality results
    query = query
      .order('total_rating', { ascending: false })
      .order('reviews', { ascending: false })
      .limit(limit);

    const { data: businesses, error } = await query;

    if (error) {
      console.error('Error fetching businesses:', error);
      return NextResponse.json(
        { error: 'Failed to fetch businesses' },
        { status: 500 }
      );
    }

    console.log(`[BUSINESSES API] Successfully fetched ${businesses?.length || 0} businesses`);
    console.log('[BUSINESSES API] Query filters:', { category, limit, badge, verified });

    // Transform database format to BusinessCard component format
    const transformedBusinesses = businesses?.map(business => ({
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
      href: business.href,
      percentiles: business.service_percentile && business.price_percentile && business.ambience_percentile ? {
        service: business.service_percentile,
        price: business.price_percentile,
        ambience: business.ambience_percentile
      } : undefined,
      verified: business.verified,
      distance: business.distance,
      priceRange: business.price_range,
    })) || [];

    console.log('[BUSINESSES API] Transformed businesses:', transformedBusinesses.slice(0, 2)); // Log first 2 for debugging

    return NextResponse.json({
      businesses: transformedBusinesses,
      count: transformedBusinesses.length
    });

  } catch (error) {
    console.error('Error in businesses API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}