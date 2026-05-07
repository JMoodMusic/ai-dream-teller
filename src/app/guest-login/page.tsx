import type { Metadata } from "next";
import GuestLoginForm from "./guest-login-form";

export const metadata: Metadata = {
  title: "비회원 주문조회 | AI Dream Teller",
  description:
    "AI Dream Teller 비회원 주문조회 페이지입니다. 전화번호와 비밀번호를 입력하여 구매 내역을 확인하세요.",
};

const GuestLoginPage = () => {
  return (
    <div className="flex-1 flex items-center justify-center relative bg-[#FDFBF7] overflow-hidden px-4 py-16 sm:py-24">
      {/* Background Aurora Effects */}
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
        {/* 로그인 카드 */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-sm hover:bg-white/80 transition-colors p-8 sm:p-10 space-y-8">
          {/* 상단 타이틀 영역 */}
          <div className="text-center space-y-4">
            {/* 장식 아이콘 */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 border border-purple-200/40 mb-1">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="searchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#9333EA" />
                    <stop offset="50%" stopColor="#EC4899" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
                <circle cx="11" cy="11" r="8" stroke="url(#searchGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="16.5" y1="16.5" x2="22" y2="22" stroke="url(#searchGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
              비회원{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500">
                주문조회
              </span>
            </h1>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed break-keep">
              결제 시 입력하신 전화번호와
              <br />
              비밀번호를 입력해주세요
            </p>
          </div>

          <GuestLoginForm />

          {/* 메인 페이지 복귀 링크 */}
          <div className="pt-4 flex justify-center">
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
        </div>

        {/* 하단 장식 */}
        <p className="text-center mt-6 text-sm text-slate-400">
          회원으로 가입하고{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 font-medium">
            더 많은 혜택
          </span>
          을 누려보세요 ✨
          <br />
          <a
            href="/auth"
            className="inline-block mt-2 font-medium text-slate-600 hover:text-purple-500 underline underline-offset-4 transition-colors"
          >
            소셜 로그인하러 가기
          </a>
        </p>
      </div>
    </div>
  );
};

export default GuestLoginPage;
