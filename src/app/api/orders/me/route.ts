import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Supabase Foreign Key 연동으로 dreams 테이블 정보까지 가져오기
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select(`
        *,
        dreams (
          id, expert_style, dream_content, ai_analysis, image_url, status, is_public, created_at
        )
      `)
      .eq("profile_id", user.id)
      .order("created_at", { ascending: false });

    if (ordersError) throw ordersError;

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error: any) {
    console.error("Fetch orders error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
