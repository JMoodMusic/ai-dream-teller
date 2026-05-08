import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * OAuth (Google, Kakao 등) 인증 후 Supabase로부터 전달받은 코드를 처리하는 콜백 엔드포인트
 */
export const GET = async (request: Request) => {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  
  // 로그인 성공 후 이동할 페이지 (기본값: 홈)
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    
    // 1. 전달받은 코드를 세션으로 교환 (이 과정에서 세션 쿠키가 브라우저에 설정됨)
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // 2. 인증 성공 시 지정된 페이지로 리다이렉트
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // 인증 실패 시 에러 페이지로 이동 (TODO: 추후 에러 페이지 구현 필요)
  return NextResponse.redirect(`${origin}/auth/auth-error`);
};
