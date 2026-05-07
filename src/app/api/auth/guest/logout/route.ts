import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("guest_session");
    
    return NextResponse.json(
      { message: "비회원 조회가 종료되었습니다." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Guest logout error:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
