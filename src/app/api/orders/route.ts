import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    const body = await request.json();
    const { expertStyle, dreamContent, includeImage, guestPhone, guestPassword } = body;

    if (!expertStyle || !dreamContent) {
      return NextResponse.json({ message: "Bad Request: Missing fields" }, { status: 400 });
    }

    if (dreamContent.length > 10000) {
      return NextResponse.json({ message: "Payload Too Large: Dream content exceeds maximum length" }, { status: 413 });
    }

    let profileId = null;
    let guestId = null;
    let userType = "MEMBER";

    if (user) {
      profileId = user.id;
      userType = "MEMBER";
    } else if (guestPhone && guestPassword) {
      userType = "GUEST";
      // 비회원 정보 조회
      interface GuestInfo {
        id: string;
        phone_number: string;
        password_hash: string;
        created_at: string;
      }

      const { data: existingGuest } = await supabase
        .rpc("get_guest_by_phone", { p_phone_number: guestPhone })
        .maybeSingle();

      const guest = existingGuest as GuestInfo | null;

      if (guest) {
        if (guest.password_hash !== guestPassword) {
          return NextResponse.json({ message: "비회원 비밀번호가 일치하지 않습니다." }, { status: 401 });
        }
        guestId = guest.id;
      } else {
        guestId = crypto.randomUUID();
        const { error: guestError } = await supabase
          .from("guests")
          .insert({ id: guestId, phone_number: guestPhone, password_hash: guestPassword });
        
        if (guestError) {
          console.error("Guest Insert Error:", guestError);
          throw guestError;
        }
      }
    } else {
      return NextResponse.json({ message: "로그인이 필요하거나 비회원 정보를 입력해야 합니다." }, { status: 401 });
    }

    // 서버 사이드 금액 검증
    const basePrice = 1500;
    const imagePrice = includeImage ? 500 : 0;
    const totalAmount = basePrice + imagePrice;

    // 주문번호 생성
    const orderNumber = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // DB 삽입용 UUID 사전 생성 (SELECT RLS 우회 목적)
    const orderId = crypto.randomUUID();

    // DB: orders 테이블 저장 (select 없이 insert만 수행)
    const { error: orderError } = await supabase
      .from("orders")
      .insert({
        id: orderId,
        order_number: orderNumber,
        user_type: userType,
        profile_id: profileId,
        guest_id: guestId,
        total_amount: totalAmount,
        status: "PENDING",
      });

    if (orderError) {
      console.error("Order Insert Error:", orderError);
      throw orderError;
    }

    // DB: dreams 테이블 저장
    const { error: dreamError } = await supabase
      .from("dreams")
      .insert({
        order_id: orderId,
        expert_style: expertStyle,
        dream_content: dreamContent,
        status: "PENDING",
        is_public: false,
      });

    if (dreamError) {
      console.error("Dream Insert Error:", dreamError);
      throw dreamError;
    }

    return NextResponse.json({
      orderId: orderNumber,
      amount: totalAmount,
      orderName: `AI 꿈 해몽 (${expertStyle})${includeImage ? " + 이미지" : ""}`,
      customerEmail: user?.email || "",
    }, { status: 200 });
  } catch (error: unknown) {
    console.error("Order Creation Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
