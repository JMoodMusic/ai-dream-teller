import type { Metadata } from "next";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "로그인 | AI Dream Teller",
  description:
    "AI Dream Teller에 로그인하세요. 구글 또는 카카오 계정으로 간편하게 로그인하고, 나만의 꿈 해석을 시작해보세요.",
};

/**
 * 회원 로그인 페이지 (/auth)
 * - 디자인 가이드: Soft, Ethereal, Fluid 테마 적용
 * - 배경 Aurora 효과 + 글래스모피즘 카드 + framer-motion 애니메이션
 * - 구글 및 카카오 소셜 로그인만 제공
 * - 로그인 성공 후 /dream-teller (프로덕트 상세 페이지)로 리다이렉트
 */
const AuthPage = () => {
  return (
    <div className="flex-1 flex items-center justify-center relative bg-[#FDFBF7] overflow-hidden px-4 py-16 sm:py-24">
      {/* Background Aurora Effects - 랜딩 페이지와 동일한 몽환적 분위기 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-15%] w-[50%] h-[50%] rounded-full bg-purple-300/30 blur-[120px] mix-blend-multiply animate-pulse" />
        <div className="absolute top-[10%] right-[-15%] w-[45%] h-[45%] rounded-full bg-blue-200/40 blur-[120px] mix-blend-multiply" />
        <div className="absolute bottom-[-20%] left-[25%] w-[55%] h-[55%] rounded-full bg-pink-200/30 blur-[150px] mix-blend-multiply animate-pulse" />
        {/* 추가 장식 - 은은한 별빛 효과 */}
        <div className="absolute top-[15%] left-[20%] w-2 h-2 rounded-full bg-purple-400/40 animate-ping" />
        <div className="absolute top-[30%] right-[25%] w-1.5 h-1.5 rounded-full bg-pink-400/30 animate-ping [animation-delay:1s]" />
        <div className="absolute bottom-[25%] left-[15%] w-1 h-1 rounded-full bg-blue-400/40 animate-ping [animation-delay:2s]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* 로그인 카드 - 글래스모피즘 + 랜딩 페이지 카드 스타일 통일 */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-sm hover:bg-white/80 transition-colors p-8 sm:p-10 space-y-8">
          {/* 상단 타이틀 영역 */}
          <div className="text-center space-y-4">
            {/* 몽환적인 장식 아이콘 - 그라데이션 적용 */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 border border-purple-200/40 mb-1">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#9333EA" />
                    <stop offset="50%" stopColor="#EC4899" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
                <path
                  d="M21.64 13a1 1 0 0 0-1.05-.14 8.05 8.05 0 0 1-3.37.73 8.15 8.15 0 0 1-8.14-8.14 8.59 8.59 0 0 1 .25-2A1 1 0 0 0 8 2.36a10.14 10.14 0 1 0 14 11.69 1 1 0 0 0-.36-1.05z"
                  fill="url(#moonGrad)"
                  opacity="0.85"
                />
                <circle cx="19" cy="5" r="1" fill="url(#moonGrad)" opacity="0.5" />
                <circle cx="17" cy="2" r="0.5" fill="url(#moonGrad)" opacity="0.3" />
              </svg>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
              꿈의 세계로{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500">
                들어가기
              </span>
            </h1>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed break-keep">
              소셜 계정으로 간편하게 로그인하고
              <br />
              AI가 분석하는 나만의 꿈 해석을 시작해보세요
            </p>
          </div>

          {/* 구분선 - 테마에 맞는 은은한 선 */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200/80" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white/60 backdrop-blur-sm px-4 text-slate-400 font-medium">
                소셜 계정으로 계속하기
              </span>
            </div>
          </div>

          {/* 소셜 로그인 버튼 */}
          <LoginForm />

          {/* 하단 안내 문구 */}
          <p className="text-center text-xs text-slate-400 leading-relaxed">
            로그인 시{" "}
            <a
              href="/terms"
              className="underline underline-offset-2 hover:text-purple-500 transition-colors"
            >
              이용약관
            </a>
            {" "}및{" "}
            <a
              href="/privacy"
              className="underline underline-offset-2 hover:text-purple-500 transition-colors"
            >
              개인정보처리방침
            </a>
            에 동의하는 것으로 간주됩니다.
          </p>

          {/* 구분선 */}
          <div className="w-full border-t border-slate-200/60" />

          {/* 메인 페이지 복귀 링크 */}
          <a
            href="/"
            className="flex items-center justify-center gap-1.5 text-sm text-slate-400 hover:text-purple-500 transition-colors group"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:-translate-x-1"
            >
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
            메인 페이지로 돌아가기
          </a>
        </div>

        {/* 하단 장식 - 테마 컬러 사용 */}
        <p className="text-center mt-6 text-sm text-slate-400">
          아직 계정이 없으신가요?{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 font-medium">
            소셜 로그인으로 자동 가입됩니다 ✨
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
