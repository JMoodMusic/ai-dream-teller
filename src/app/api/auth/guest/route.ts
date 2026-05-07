import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { phoneNumber, password } = await request.json();

    if (!phoneNumber || !password) {
      return NextResponse.json(
        { message: "전화번호와 비밀번호를 모두 입력해주세요." },
        { status: 400 }
      );
    }

    // TODO: Supabase guests 테이블 연결 후 실제 검증 로직 구현
    // 임시로 전화번호와 비밀번호가 있으면 성공으로 처리하고 쿠키 설정
    if (phoneNumber === "010-0000-0000" && password === "wrong") {
       return NextResponse.json(
        { message: "비밀번호가 일치하지 않습니다." },
        { status: 401 }
      );
    }

    // 게스트 세션 쿠키 설정 (임시)
    cookies().set("guest_session", "dummy_guest_token", {
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
