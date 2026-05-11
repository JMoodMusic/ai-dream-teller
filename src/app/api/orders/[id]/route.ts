import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

interface OrderDetail {
  id: string;
  order_number: string;
  user_type: string;
  profile_id: string | null;
  guest_id: string | null;
  total_amount: number;
  status: string;
  payment_key: string | null;
  created_at: string;
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: orderNumber } = await params;
    const supabase = await createClient();
    const cookieStore = await cookies();
    
    const { data: { user } } = await supabase.auth.getUser();
    const guestId = cookieStore.get("guest_session")?.value;

    // RPC 함수를 사용하여 주문 상세 정보 조회
    const { data: order, error: orderError } = await supabase
      .rpc("get_order_by_number", { p_order_number: orderNumber })
      .single();

    const typedOrder = order as OrderDetail;

    if (orderError || !typedOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const { data: dream, error: dreamError } = await supabase
      .from("dreams")
      .select("*")
      .eq("order_id", typedOrder.id)
      .single();

    if (dreamError || !dream) {
      return NextResponse.json({ message: "Dream not found" }, { status: 404 });
    }
    
    // 접근 권한 체크
    const isOwner = (user && typedOrder.profile_id === user.id) || (guestId && typedOrder.guest_id === guestId);
    const isPublic = dream.is_public;

    if (!isOwner && !isPublic) {
       return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ order: typedOrder, dream, isOwner }, { status: 200 });
  } catch (error: unknown) {
    console.error("Fetch order detail error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
