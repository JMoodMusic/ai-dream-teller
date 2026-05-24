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
      // 1. 현재 세션 ID에 해당하는 비회원의 전화번호 조회
      const { data: currentGuest, error: guestLookupError } = await createAdminClient()
        .from("guests")
        .select("phone_number")
        .eq("id", guestId)
        .maybeSingle();

      if (guestLookupError) {
        console.error("Guest phone lookup error:", guestLookupError);
        throw guestLookupError;
      }

      if (!currentGuest) {
        return NextResponse.json({ message: "Guest session invalid" }, { status: 401 });
      }

      // 2. 해당 전화번호를 공유하는 모든 guest_id들 조회
      const { data: allGuests, error: allGuestsError } = await createAdminClient()
        .from("guests")
        .select("id")
        .eq("phone_number", currentGuest.phone_number);

      if (allGuestsError || !allGuests) {
        console.error("All guests fetch error:", allGuestsError);
        throw allGuestsError || new Error("Failed to fetch all guest IDs");
      }

      const guestIds = allGuests.map((g) => g.id);

      // 3. 그 전화번호로 가입되었던 모든 비회원 ID들의 주문들을 전부 포함해 조회
      query = query.in("guest_id", guestIds);
    }

    const { data: orders, error: ordersError } = await query;

    if (ordersError) throw ordersError;

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error: unknown) {
    console.error("Order history fetch error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
