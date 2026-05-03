import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

/**
 * Next.js 16 Proxy (구 Middleware)
 * - Supabase Auth 세션을 자동 갱신
 * - 모든 요청에서 쿠키 기반 세션 유지
 */
export const proxy = async (request: NextRequest) => {
  return await updateSession(request);
};

export const config = {
  matcher: [
    /*
     * 정적 파일, 이미지 최적화, favicon을 제외한 모든 경로에서 실행
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
