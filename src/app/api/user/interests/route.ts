import { NextResponse } from "next/server";
import { getServerSupabase } from "@/app/lib/supabase/server";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const supabase = await getServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { selections }: { selections: string[] } = await req.json();

    if (!Array.isArray(selections)) {
      return NextResponse.json({ error: "Invalid payload - selections must be an array" }, { status: 400 });
    }

    // Clean and dedupe selections
    const cleaned = Array.from(
      new Set(
        (selections ?? [])
          .filter((s: string) => s && s.trim())
          .map((s: string) => s.trim())
      )
    );

    // Skip validation for now - let the RPC handle it
    // The interests table may not be seeded yet
    console.log('Processing interest selections:', cleaned);

    const validSelections = cleaned;

    // Short-circuit if no changes needed
    const { data: existing } = await supabase
      .from('user_interests')
      .select('interest_id')
      .eq('user_id', user.id);

    const current = new Set((existing ?? []).map(r => r.interest_id));
    const next = new Set(validSelections);
    const same = current.size === next.size && [...current].every(x => next.has(x));

    if (same) {
      return NextResponse.json({
        ok: true,
        message: 'No changes needed',
        selections: validSelections
      });
    }

    // Use atomic replace function for true transactional behavior
    const { error } = await supabase.rpc('replace_user_interests', {
      p_user_id: user.id,
      p_interest_ids: validSelections
    });

    if (error) {
      // If function doesn't exist, fall back to manual transaction
      if (error.message?.includes('function') || error.message?.includes('does not exist')) {
        console.warn('replace_user_interests function not found, using fallback method');

        // Manual transaction: delete then insert
        const { error: deleteError } = await supabase
          .from('user_interests')
          .delete()
          .eq('user_id', user.id);

        if (deleteError) {
          console.error('Error deleting user interests:', deleteError);
          return NextResponse.json({ error: deleteError.message }, { status: 400 });
        }

        if (validSelections.length > 0) {
          const rows = validSelections.map(interest_id => ({
            user_id: user.id,
            interest_id
          }));

          const { error: insertError } = await supabase
            .from('user_interests')
            .insert(rows);

          if (insertError) {
            console.error('Error inserting user interests:', insertError);
            // Handle FK violation explicitly
            if (insertError.code === '23503') {
              return NextResponse.json({ error: 'Invalid interest id(s).' }, { status: 400 });
            }
            return NextResponse.json({ error: insertError.message }, { status: 400 });
          }
        }
      } else {
        console.error('Error replacing user interests:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    return NextResponse.json({
      ok: true,
      message: `Successfully saved ${validSelections.length} interests`,
      selections: validSelections
    });
  } catch (error) {
    console.error('Error in interests API:', error);
    return NextResponse.json(
      { error: "Failed to save interests" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const supabase = await getServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data, error } = await supabase
      .from("user_interests")
      .select("interest_id")
      .eq("user_id", user.id);

    if (error) {
      console.error('Error fetching user interests:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const interests = data?.map(row => row.interest_id) || [];

    return NextResponse.json({
      interests,
      count: interests.length
    });
  } catch (error) {
    console.error('Error in GET interests API:', error);
    return NextResponse.json(
      { error: "Failed to fetch interests" },
      { status: 500 }
    );
  }
}