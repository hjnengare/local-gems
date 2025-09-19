import { NextResponse } from "next/server";
import { getServerSupabase } from "@/app/lib/supabase/server";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Pagination parameters
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20'))); // Max 50, min 1
    const offset = (page - 1) * limit;

    // Filter parameters
    const category = searchParams.get('category');
    const badge = searchParams.get('badge');
    const verified = searchParams.get('verified');
    const priceRange = searchParams.get('price_range');
    const location = searchParams.get('location');

    // Search parameters
    const search = searchParams.get('search');

    // Sorting parameters
    const sortBy = searchParams.get('sort_by') || 'total_rating';
    const sortOrder = searchParams.get('sort_order') || 'desc';

    // Location-based parameters
    const lat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : null;
    const lng = searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : null;
    const radius = searchParams.get('radius') ? parseFloat(searchParams.get('radius')!) : 10;

    const supabase = await getServerSupabase();

    // Base query - only select active businesses
    let query = supabase
      .from('businesses')
      .select('*')
      .eq('status', 'active');

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

    if (priceRange) {
      query = query.eq('price_range', priceRange);
    }

    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    // Full-text search
    if (search) {
      query = query.textSearch('search_vector', search, {
        type: 'websearch',
        config: 'english'
      });
    }

    // Sorting
    const validSortFields = ['total_rating', 'reviews', 'created_at', 'name'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'total_rating';
    const ascending = sortOrder === 'asc';

    query = query.order(sortField, { ascending });

    // Add secondary sort for consistency
    if (sortField !== 'created_at') {
      query = query.order('created_at', { ascending: false });
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: businesses, error } = await query;

    if (error) {
      console.error('Error fetching businesses:', error);
      return NextResponse.json(
        { error: 'Failed to fetch businesses' },
        { status: 500 }
      );
    }

    // Get total count for pagination
    const { count: totalCount } = await supabase
      .from('businesses')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    console.log(`[BUSINESSES API] Successfully fetched ${businesses?.length || 0} businesses (page ${page})`);
    console.log('[BUSINESSES API] Query params:', {
      category, badge, verified, priceRange, location, search,
      sortBy: sortField, sortOrder, page, limit
    });

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
      href: business.href || `/business/${business.slug}`,
      percentiles: business.service_percentile && business.price_percentile && business.ambience_percentile ? {
        service: business.service_percentile,
        price: business.price_percentile,
        ambience: business.ambience_percentile
      } : undefined,
      verified: business.verified,
      distance: business.distance_km ? `${business.distance_km} km` : undefined,
      priceRange: business.price_range,
      // Additional fields for enhanced UI
      description: business.description,
      phone: business.phone,
      website: business.website,
      address: business.address,
    })) || [];

    const totalPages = Math.ceil((totalCount || 0) / limit);
    const hasMore = page < totalPages;

    console.log('[BUSINESSES API] Response metadata:', {
      count: transformedBusinesses.length,
      totalCount,
      page,
      totalPages,
      hasMore
    });

    return NextResponse.json({
      data: transformedBusinesses,
      meta: {
        count: transformedBusinesses.length,
        totalCount: totalCount || 0,
        page,
        limit,
        totalPages,
        hasMore,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error in businesses API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}