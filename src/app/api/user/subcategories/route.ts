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

    // Validate that all subcategory IDs exist in the subcategories table
    if (cleaned.length > 0) {
      const { data: known, error: knownErr } = await supabase
        .from('subcategories')
        .select('id')
        .in('id', cleaned);

      if (knownErr) {
        console.error('Error validating subcategory IDs:', knownErr);
        return NextResponse.json({ error: knownErr.message }, { status: 400 });
      }

      if ((known?.length ?? 0) !== cleaned.length) {
        return NextResponse.json({ error: 'One or more subcategory IDs are invalid' }, { status: 400 });
      }
    }

    const validSelections = cleaned;

    // Short-circuit if no changes needed
    const { data: existing } = await supabase
      .from('user_subcategories')
      .select('subcategory_id')
      .eq('user_id', user.id);

    const current = new Set((existing ?? []).map(r => r.subcategory_id));
    const next = new Set(validSelections);
    const same = current.size === next.size && [...current].every(x => next.has(x));

    if (same) {
      return NextResponse.json({
        ok: true,
        message: 'No changes needed',
        selections: validSelections
      });
    }

    // Use atomic replace function if it exists, otherwise fallback
    const { error } = await supabase.rpc('replace_user_subcategories', {
      p_user_id: user.id,
      p_subcategory_ids: validSelections
    });

    if (error) {
      // If function doesn't exist, fall back to manual transaction
      if (error.message?.includes('function') || error.message?.includes('does not exist')) {
        console.warn('replace_user_subcategories function not found, using fallback method');

        // Manual transaction: delete then insert
        const { error: deleteError } = await supabase
          .from('user_subcategories')
          .delete()
          .eq('user_id', user.id);

        if (deleteError) {
          console.error('Error deleting user subcategories:', deleteError);
          return NextResponse.json({ error: deleteError.message }, { status: 400 });
        }

        if (validSelections.length > 0) {
          const rows = validSelections.map(subcategory_id => ({
            user_id: user.id,
            subcategory_id
          }));

          const { error: insertError } = await supabase
            .from('user_subcategories')
            .insert(rows);

          if (insertError) {
            console.error('Error inserting user subcategories:', insertError);
            // Handle FK violation explicitly
            if (insertError.code === '23503') {
              return NextResponse.json({ error: 'Invalid subcategory id(s).' }, { status: 400 });
            }
            return NextResponse.json({ error: insertError.message }, { status: 400 });
          }
        }
      } else {
        console.error('Error replacing user subcategories:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    return NextResponse.json({
      ok: true,
      message: `Successfully saved ${validSelections.length} subcategories`,
      selections: validSelections
    });
  } catch (error) {
    console.error('Error in subcategories API:', error);
    return NextResponse.json(
      { error: "Failed to save subcategories" },
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
      .from("user_subcategories")
      .select("subcategory_id")
      .eq("user_id", user.id);

    if (error) {
      console.error('Error fetching user subcategories:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const subcategories = data?.map(row => row.subcategory_id) || [];

    return NextResponse.json({
      subcategories,
      count: subcategories.length
    });
  } catch (error) {
    console.error('Error in GET subcategories API:', error);
    return NextResponse.json(
      { error: "Failed to fetch subcategories" },
      { status: 500 }
    );
  }
}