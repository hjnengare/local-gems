import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

function getSupabase() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies }
  );
}

export async function GET(req: Request) {
  const supabase = getSupabase();
  const url = new URL(req.url);
  const idsParam = url.searchParams.get("interests");
  const ids = idsParam
    ? idsParam.split(",").map(s => s.trim()).filter(Boolean)
    : [];

  let query = supabase
    .from("subcategories")
    .select("id,label,interest_id");

  if (ids.length) query = query.in("interest_id", ids);

  const { data, error } = await query.order("label", { ascending: true });

  if (error) {
    console.error("Fetch subcategories error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ subcategories: data ?? [] });
}