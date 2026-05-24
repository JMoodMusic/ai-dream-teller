import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

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
    const adminSupabase = createAdminClient();
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

    const { data: dream, error: dreamError } = await adminSupabase
      .from("dreams")
      .select("*")
      .eq("order_id", typedOrder.id)
      .single();

    if (dreamError || !dream) {
      return NextResponse.json({ message: "Dream not found" }, { status: 404 });
    }
    
    // 접근 권한 체크
    let isOwner = false;
    if (user && typedOrder.profile_id === user.id) {
      isOwner = true;
    } else if (guestId && typedOrder.guest_id) {
      if (typedOrder.guest_id === guestId) {
        isOwner = true;
      } else {
        const { data: currentGuest } = await adminSupabase
          .from("guests")
          .select("phone_number")
          .eq("id", guestId)
          .maybeSingle();

        const { data: targetGuest } = await adminSupabase
          .from("guests")
          .select("phone_number")
          .eq("id", typedOrder.guest_id)
          .maybeSingle();

        if (currentGuest && targetGuest && currentGuest.phone_number === targetGuest.phone_number) {
          isOwner = true;
        }
      }
    }
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

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: orderNumber } = await params;
    const body = await request.json();
    const { isPublic } = body;
    
    if (typeof isPublic !== "boolean") {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const supabase = await createClient();
    const cookieStore = await cookies();
    
    const { data: { user } } = await supabase.auth.getUser();
    const guestId = cookieStore.get("guest_session")?.value;

    const { data: order, error: orderError } = await supabase
      .rpc("get_order_by_number", { p_order_number: orderNumber })
      .single();

    const typedOrder = order as OrderDetail;

    if (orderError || !typedOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    let isOwner = false;
    if (user && typedOrder.profile_id === user.id) {
      isOwner = true;
    } else if (guestId && typedOrder.guest_id) {
      if (typedOrder.guest_id === guestId) {
        isOwner = true;
      } else {
        const adminSupabase = createAdminClient();
        const { data: currentGuest } = await adminSupabase
          .from("guests")
          .select("phone_number")
          .eq("id", guestId)
          .maybeSingle();

        const { data: targetGuest } = await adminSupabase
          .from("guests")
          .select("phone_number")
          .eq("id", typedOrder.guest_id)
          .maybeSingle();

        if (currentGuest && targetGuest && currentGuest.phone_number === targetGuest.phone_number) {
          isOwner = true;
        }
      }
    }
    
    if (!isOwner) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const adminSupabase = createAdminClient();
    const { error: updateError } = await adminSupabase
      .from("dreams")
      .update({ is_public: isPublic })
      .eq("order_id", typedOrder.id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ message: "Updated successfully" }, { status: 200 });
  } catch (error: unknown) {
    console.error("Update dream public status error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
