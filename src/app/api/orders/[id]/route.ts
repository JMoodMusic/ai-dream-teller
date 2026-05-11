import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(`*, dreams (*)`)
      .eq("id", id)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
    
    // 접근 권한 체크 (회원 본인 소유의 주문인지)
    if (order.profile_id !== user.id) {
       return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ order }, { status: 200 });
  } catch (error: any) {
    console.error("Fetch order detail error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
