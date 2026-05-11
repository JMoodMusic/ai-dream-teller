import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Supabase OAuth 콜백 처리 라우트
 * - OAuth 인증 후 Supabase가 리다이렉트하는 콜백 URL
 * - auth code를 세션으로 교환 후 메인 랜딩 페이지로 이동
 */
export const GET = async (request: Request) => {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // OAuth 완료 후 이동할 페이지 (기본값: 메인 랜딩 페이지)
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 로그인 성공 시 메인 랜딩 페이지로 리다이렉트
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // 에러 발생 시 로그인 페이지로 리다이렉트 (에러 메시지 포함)
  return NextResponse.redirect(
    `${origin}/auth?error=auth_callback_error`
  );
};
