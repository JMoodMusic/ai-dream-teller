import React from "react";
import type { Metadata } from "next";
import AdminLoginForm from "./admin-login-form";

export const metadata: Metadata = {
  title: "관리자 로그인 | AI Dream Teller",
  description: "Dream Teller 최고 관리자 콘솔을 보호하는 통합 로그인 보안 인증 페이지입니다.",
};

const AdminLoginPage = () => {
  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden font-sans select-none">
      {/* 몽환적이고 환상적인 우주 오로라 네온 배경 */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-purple-700/10 blur-[150px] mix-blend-screen" />
        <div className="absolute top-[30%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pink-700/10 blur-[150px] mix-blend-screen animate-pulse" />
        <div className="absolute -bottom-[10%] left-[20%] w-[45%] h-[45%] rounded-full bg-indigo-800/10 blur-[150px] mix-blend-screen" />
      </div>

      {/* 미세한 별 가루 장식 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* 로그인 메인 모듈 */}
      <AdminLoginForm />
    </div>
  );
};

export default AdminLoginPage;
