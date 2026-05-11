import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { phoneNumber, password } = await request.json();

    if (!phoneNumber || !password) {
      return NextResponse.json(
        { message: "전화번호와 비밀번호를 모두 입력해주세요." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    interface GuestInfo {
      id: string;
      phone_number: string;
      password_hash: string;
      created_at: string;
    }

    // RPC 함수를 사용하여 비회원 정보 조회
    const { data: guests, error: guestError } = await supabase.rpc(
      "get_guest_by_phone",
      { p_phone_number: phoneNumber.replace(/-/g, "") }
    );

    const typedGuests = guests as GuestInfo[] | null;

    if (guestError || !typedGuests || typedGuests.length === 0) {
      return NextResponse.json(
        { message: "입력하신 정보를 찾을 수 없습니다." },
        { status: 401 }
      );
    }

    const targetGuest = typedGuests[0];

    // 비밀번호 검증 (현재는 단순 비교, 운영 환경에서는 해싱 필요)
    if (targetGuest.password_hash !== password) {
      return NextResponse.json(
        { message: "비밀번호가 일치하지 않습니다." },
        { status: 401 }
      );
    }

    // 게스트 세션 쿠키 설정 (guest_id 저장)
    const cookieStore = await cookies();
    cookieStore.set("guest_session", targetGuest.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1일
      path: "/",
    });

    return NextResponse.json(
      { message: "성공적으로 조회되었습니다." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Guest login error:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
