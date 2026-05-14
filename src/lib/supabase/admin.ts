import { createClient } from "@supabase/supabase-js";

/**
 * RLS를 우회하는 관리자용 Supabase 클라이언트 생성
 * - 주의: 서버 사이드(Server Action, API Route 등)에서만 사용해야 함
 * - 외부에 노출되면 절대 안 됨 (SUPABASE_SERVICE_ROLE_KEY 사용)
 */
export const createAdminClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
};
