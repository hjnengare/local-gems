import { NextResponse } from "next/server";
import { getServerSupabase } from "@/app/lib/supabase/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = await getServerSupabase();

    let { data, error } = await supabase
      .from('interests')
      .select('id, name')
      .order('name');

    if (error) {
      console.error('Error fetching interests:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // If no interests found, auto-seed with default data
    if (!data || data.length === 0) {
      const INTERESTS_DATA = [
        { id: 'food-drink', name: 'Food & Drink' },
        { id: 'beauty-wellness', name: 'Beauty & Wellness' },
        { id: 'home-services', name: 'Home & Services' },
        { id: 'outdoors-adventure', name: 'Outdoors & Adventure' },
        { id: 'nightlife-entertainment', name: 'Nightlife & Entertainment' },
        { id: 'arts-culture', name: 'Arts & Culture' },
        { id: 'family-pets', name: 'Family & Pets' },
        { id: 'shopping-lifestyle', name: 'Shopping & Lifestyle' }
      ];

      console.log('Auto-seeding interests table...');
      const { error: seedError } = await supabase
        .from('interests')
        .upsert(INTERESTS_DATA, { onConflict: 'id' });

      if (seedError) {
        console.error('Error auto-seeding interests:', seedError);
        // Return fallback data
        data = INTERESTS_DATA;
      } else {
        // Fetch the seeded data
        const { data: seededData } = await supabase
          .from('interests')
          .select('id, name')
          .order('name');
        data = seededData || INTERESTS_DATA;
      }
    }

    return NextResponse.json({
      interests: data || [],
      count: data?.length || 0
    });
  } catch (error) {
    console.error('Error in GET interests API:', error);
    return NextResponse.json(
      { error: "Failed to fetch interests" },
      { status: 500 }
    );
  }
}