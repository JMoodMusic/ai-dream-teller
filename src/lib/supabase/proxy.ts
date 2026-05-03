import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Supabase Auth 세션을 갱신하는 proxy 유틸리티
 * - 만료된 Auth 토큰을 자동으로 갱신
 * - 갱신된 토큰을 서버/클라이언트 양쪽에 전달
 * - Supabase 환경변수 미설정 시 건너뜀
 */
export const updateSession = async (request: NextRequest) => {
  // Supabase 환경변수가 설정되지 않은 경우 세션 갱신 건너뜀
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (
    !supabaseUrl ||
    !supabaseAnonKey ||
    supabaseUrl.startsWith("your_") ||
    supabaseAnonKey.startsWith("your_")
  ) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Auth 토큰 갱신 - createServerClient와 getUser 사이에 다른 코드를 넣지 말 것
  await supabase.auth.getUser();

  return supabaseResponse;
};
