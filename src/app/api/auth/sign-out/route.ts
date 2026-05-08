import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * 로그아웃 처리 엔드포인트
 */
export const POST = async (request: Request) => {
  const { origin } = new URL(request.url);
  const supabase = await createClient();

  // 1. Supabase 로그아웃 (세션 쿠키 파기)
  await supabase.auth.signOut();

  // 2. 로그아웃 후 홈으로 리다이렉트
  return NextResponse.redirect(`${origin}/`, {
    status: 303, // POST 요청 후 GET으로 리다이렉트하기 위해 303 사용
  });
};
