import { NextResponse } from "next/server";
import { getServerSupabase } from "@/app/lib/supabase/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = await getServerSupabase();

    const { data, error } = await supabase
      .from('interests')
      .select('id, name')
      .order('name');

    if (error) {
      console.error('Error fetching interests:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
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