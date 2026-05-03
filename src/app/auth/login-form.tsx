"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { getSiteUrl } from "@/lib/supabase/get-site-url";
import type { Provider } from "@supabase/supabase-js";

/**
 * 구글 공식 "G" 로고 SVG
 * - Google Identity 브랜딩 가이드라인 준수
 */
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    <path fill="none" d="M0 0h48v48H0z" />
  </svg>
);

/**
 * 카카오 공식 말풍선 심볼 SVG
 * - 카카오 디자인 가이드라인 준수 (심볼 색상: #000000)
 */
const KakaoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
    <path
      fill="#000000"
      d="M128 36C70.562 36 24 72.713 24 118c0 29.279 19.466 54.97 48.748 69.477-1.593 5.494-10.237 35.344-10.581 37.689 0 0-.207 1.762.934 2.434s2.483.15 2.483.15c3.272-.457 37.943-24.811 43.944-29.068 5.995.849 12.168 1.318 18.472 1.318 57.438 0 104-36.712 104-82 0-45.287-46.562-82-104-82z"
    />
  </svg>
);

/**
 * 소셜 로그인 버튼 Props 타입
 */
interface SocialLoginButtonProps {
  provider: Provider;
  icon: React.ReactNode;
  label: string;
  className: string;
  isLoading: boolean;
  onClick: () => void;
}

/**
 * 공식 디자인 가이드라인을 따르는 소셜 로그인 버튼 컴포넌트
 * - 호버 시 은은한 그림자 및 빛 효과 (디자인 가이드 Interactions 준수)
 */
const SocialLoginButton = ({
  icon,
  label,
  className,
  isLoading,
  onClick,
}: SocialLoginButtonProps) => (
  <button
    onClick={onClick}
    disabled={isLoading}
    className={`
      w-full flex items-center justify-center gap-3 
      py-3.5 px-6 rounded-2xl text-base font-medium
      transition-all duration-300 ease-out
      disabled:opacity-60 disabled:cursor-not-allowed
      hover:shadow-lg hover:-translate-y-0.5
      active:translate-y-0 active:shadow-md
      ${className}
    `}
  >
    {isLoading ? (
      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
    ) : (
      icon
    )}
    <span>{label}</span>
  </button>
);

/**
 * 로그인 폼 컴포넌트
 * - framer-motion 순차 애니메이션으로 부드러운 등장 효과
 * - 구글, 카카오 소셜 로그인 버튼 제공
 * - 로그인 성공 후 /dream-teller (프로덕트 상세 페이지)로 리다이렉트
 * - 환경별 도메인 분기 (개발/프로덕션)
 */
const LoginForm = () => {
  const [loadingProvider, setLoadingProvider] = useState<Provider | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /**
   * 소셜 로그인 핸들러
   * - Supabase Auth의 signInWithOAuth를 사용하여 OAuth 플로우 시작
   * - redirectTo에 환경별 콜백 URL을 지정
   */
  const handleSocialLogin = async (provider: Provider) => {
    try {
      setLoadingProvider(provider);
      setErrorMessage(null);

      const supabase = createClient();
      const siteUrl = getSiteUrl();

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          // 환경별 도메인으로 콜백 URL 구성
          redirectTo: `${siteUrl}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(`${loadingProvider} 로그인 실패:`, error);
      setErrorMessage("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
      setLoadingProvider(null);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto space-y-3">
      {/* 에러 메시지 표시 */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-3 rounded-2xl bg-pink-50/80 border border-pink-200/60 text-pink-600 text-sm text-center backdrop-blur-sm"
        >
          {errorMessage}
        </motion.div>
      )}

      {/* 구글 로그인 버튼 - 공식 브랜딩 가이드라인 준수 */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
      >
        <SocialLoginButton
          provider="google"
          icon={<GoogleIcon />}
          label="Google로 로그인"
          className="bg-white text-slate-700 border border-slate-200/80 hover:bg-white/90 hover:border-slate-300 shadow-sm"
          isLoading={loadingProvider === "google"}
          onClick={() => handleSocialLogin("google")}
        />
      </motion.div>

      {/* 카카오 로그인 버튼 - 공식 디자인 가이드라인 준수 */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      >
        <SocialLoginButton
          provider="kakao"
          icon={<KakaoIcon />}
          label="카카오 로그인"
          className="bg-[#FEE500] text-[rgba(0,0,0,0.85)] hover:bg-[#FADA0A] shadow-sm"
          isLoading={loadingProvider === "kakao"}
          onClick={() => handleSocialLogin("kakao")}
        />
      </motion.div>
    </div>
  );
};

export default LoginForm;
