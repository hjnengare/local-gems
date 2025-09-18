import { NextResponse } from "next/server";
import { getServerSupabase } from "@/app/lib/supabase/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = await getServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data, error } = await supabase
      .from("user_deal_breakers")
      .select("deal_breaker_id")
      .eq("user_id", user.id);

    if (error) {
      console.error('Error fetching user deal-breakers:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const dealBreakers = data?.map(row => row.deal_breaker_id) || [];

    return NextResponse.json({
      dealBreakers,
      count: dealBreakers.length
    });
  } catch (error) {
    console.error('Error in GET deal-breakers API:', error);
    return NextResponse.json(
      { error: "Failed to fetch deal-breakers" },
      { status: 500 }
    );
  }
}

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

    // Validate that all deal-breaker IDs exist in the deal_breakers table
    if (cleaned.length > 0) {
      const { data: known, error: knownErr } = await supabase
        .from('deal_breakers')
        .select('id')
        .in('id', cleaned);

      if (knownErr) {
        console.error('Error validating deal-breaker IDs:', knownErr);
        return NextResponse.json({ error: knownErr.message }, { status: 400 });
      }

      if ((known?.length ?? 0) !== cleaned.length) {
        return NextResponse.json({ error: 'One or more deal-breaker IDs are invalid' }, { status: 400 });
      }
    }

    const validSelections = cleaned;

    // Short-circuit if no changes needed
    const { data: existing } = await supabase
      .from('user_deal_breakers')
      .select('deal_breaker_id')
      .eq('user_id', user.id);

    const current = new Set((existing ?? []).map(r => r.deal_breaker_id));
    const next = new Set(validSelections);
    const same = current.size === next.size && [...current].every(x => next.has(x));

    if (same) {
      return NextResponse.json({
        ok: true,
        message: 'No changes needed',
        selections: validSelections
      });
    }

    // Manual transaction: delete then insert
    const { error: deleteError } = await supabase
      .from('user_deal_breakers')
      .delete()
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Error deleting user deal-breakers:', deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 400 });
    }

    if (validSelections.length > 0) {
      const rows = validSelections.map(deal_breaker_id => ({
        user_id: user.id,
        deal_breaker_id
      }));

      const { error: insertError } = await supabase
        .from('user_deal_breakers')
        .insert(rows);

      if (insertError) {
        console.error('Error inserting user deal-breakers:', insertError);
        // Handle FK violation explicitly
        if (insertError.code === '23503') {
          return NextResponse.json({ error: 'Invalid deal-breaker id(s).' }, { status: 400 });
        }
        return NextResponse.json({ error: insertError.message }, { status: 400 });
      }
    }

    // Optional: mirror to profiles
    await supabase.from("profiles").upsert({
      user_id: user.id,
      dealbreakers: validSelections,
      onboarding_step: "complete",
      updated_at: new Date().toISOString()
    }, { onConflict: "user_id" });

    return NextResponse.json({
      ok: true,
      message: `Successfully saved ${validSelections.length} deal-breakers`,
      selections: validSelections
    });
  } catch (error) {
    console.error('Error in deal-breakers API:', error);
    return NextResponse.json(
      { error: "Failed to save deal-breakers" },
      { status: 500 }
    );
  }
}