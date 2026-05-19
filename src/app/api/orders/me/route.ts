import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = await createClient();
    const cookieStore = await cookies();
    
    const { data: { user } } = await supabase.auth.getUser();
    const guestId = cookieStore.get("guest_session")?.value;

    if (!user && !guestId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const queryClient = user ? supabase : createAdminClient();

    let query = queryClient
      .from("orders")
      .select(`
        *,
        dreams (
          id, expert_style, dream_content, ai_analysis, image_url, status, is_public, created_at
        )
      `)
      .eq("status", "SUCCESS") // 결제 완료된 건만 표시
      .order("created_at", { ascending: false });

    if (user) {
      query = query.eq("profile_id", user.id);
    } else if (guestId) {
      query = query.eq("guest_id", guestId);
    }

    const { data: orders, error: ordersError } = await query;

    if (ordersError) throw ordersError;

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error: unknown) {
    console.error("Order history fetch error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
