"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Sparkles, AlertCircle, ArrowRight } from "lucide-react";
import { adminLogin } from "./actions";

const AdminLoginForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        const result = await adminLogin(formData);
        if (result.success) {
          router.push("/admin");
          router.refresh();
        } else {
          setError(result.error ?? "로그인에 실패했습니다.");
        }
      } catch (err) {
        setError("서버 통신 중 에러가 발생했습니다.");
      }
    });
  };

  return (
    <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900/40 backdrop-blur-2xl border border-white/10 shadow-2xl relative z-10 animate-fade-in overflow-hidden">
      {/* 백그라운드 장식 스팟 라이트 */}
      <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-pink-500/20 blur-3xl pointer-events-none" />

      {/* 로고 및 안내 문구 */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 via-pink-500 to-yellow-500 flex items-center justify-center shadow-lg shadow-purple-500/30 mb-4 animate-bounce">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-serif font-black text-white tracking-tight leading-none mb-2">
          Dream Teller
        </h2>
        <span className="text-xs text-slate-400 font-bold uppercase tracking-widest bg-slate-800/40 px-3 py-1.5 rounded-full border border-slate-700/30">
          Admin Console
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 아이디 입력 */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 tracking-wider uppercase block ml-1">
            아이디
          </label>
          <div className="relative">
            <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
            <input
              type="text"
              name="username"
              required
              placeholder="Username"
              disabled={isPending}
              className="w-full h-12 pl-12 pr-4 bg-slate-950/60 border border-slate-800 rounded-2xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/50 transition-all duration-300 disabled:opacity-50"
            />
          </div>
        </div>

        {/* 비밀번호 입력 */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 tracking-wider uppercase block ml-1">
            비밀번호
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              disabled={isPending}
              className="w-full h-12 pl-12 pr-4 bg-slate-950/60 border border-slate-800 rounded-2xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/50 transition-all duration-300 disabled:opacity-50"
            />
          </div>
        </div>

        {/* 에러 피드백 알림 블록 */}
        {error && (
          <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-400 text-xs font-semibold animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* 로그인 제출 버튼 */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full h-12 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-600 hover:from-purple-500 hover:via-pink-500 hover:to-yellow-500 text-white font-bold text-sm shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 cursor-pointer group"
        >
          {isPending ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              로그인
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>

      {/* 푸터 카피라이트 */}
      <div className="mt-8 text-center text-[10px] text-slate-600 font-semibold tracking-wider uppercase">
        © 2026 Dream Teller Corp. All rights reserved.
      </div>
    </div>
  );
};

export default AdminLoginForm;
