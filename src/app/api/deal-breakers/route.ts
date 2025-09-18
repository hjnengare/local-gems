import { NextResponse } from "next/server";
import { getServerSupabase } from "@/app/lib/supabase/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = await getServerSupabase();

    const { data, error } = await supabase
      .from('deal_breakers')
      .select('id, label, icon, category_id')
      .order('label');

    if (error) {
      console.error('Error fetching deal-breakers:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      dealBreakers: data || [],
      count: data?.length || 0
    });
  } catch (error) {
    console.error('Error in GET deal-breakers API:', error);
    return NextResponse.json(
      { error: "Failed to fetch deal-breakers" },
      { status: 500 }
    );
  }
}