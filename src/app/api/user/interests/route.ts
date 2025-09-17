import { NextResponse } from "next/server";
import { getServerSupabase } from "@/app/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = getServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { selections }: { selections: string[] } = await req.json();

    if (!Array.isArray(selections)) {
      return NextResponse.json({ error: "Invalid payload - selections must be an array" }, { status: 400 });
    }

    // Validate that selections are not empty strings
    const validSelections = selections.filter(selection => selection && selection.trim());

    // Replace the set (delete + insert in a transaction)
    const { error: delErr } = await supabase
      .from("user_interests")
      .delete()
      .eq("user_id", user.id);

    if (delErr) {
      console.error('Error deleting user interests:', delErr);
      return NextResponse.json({ error: delErr.message }, { status: 400 });
    }

    if (validSelections.length > 0) {
      const rows = validSelections.map((interest_id) => ({
        user_id: user.id,
        interest_id,
        created_at: new Date().toISOString()
      }));

      const { error: insErr } = await supabase
        .from("user_interests")
        .insert(rows);

      if (insErr) {
        console.error('Error inserting user interests:', insErr);
        return NextResponse.json({ error: insErr.message }, { status: 400 });
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
  const supabase = getServerSupabase();
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