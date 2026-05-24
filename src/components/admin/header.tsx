"use client";

import React from "react";
import { Bell, ShieldAlert, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

import { usePathname } from "next/navigation";

interface AdminHeaderProps {
  title?: string;
}

// TODO: 추후 관리자 알림(신규 결제 내역, 해몽 실패 오류 발생 알림 등)이 활성화되면 텔레그램 봇 알림 상태와 웹소켓 실시간 동기화 필요
const AdminHeader = () => {
  const pathname = usePathname();
  const currentDate = format(new Date(), "yyyy년 M월 d일 (EEEE)", { locale: ko });

  // 현재 주소에 따른 동적 타이틀 매핑
  const getPageTitle = () => {
    if (pathname === "/admin") return "매출 대시보드";
    if (pathname === "/admin/order-list") return "주문 내역 리스트";
    if (pathname?.startsWith("/admin/order-list/")) return "상세 주문 내역";
    if (pathname === "/admin/user-list") return "유저 리스트";
    return "관리자 콘솔";
  };

  const title = getPageTitle();

  return (
    <header className="h-16 border-b border-slate-200 bg-white/70 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
      {/* 좌측 타이틀 영역 */}
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          {title}
        </h2>
        <span className="h-4 w-px bg-slate-200 hidden sm:inline" />
        <p className="text-xs text-slate-400 font-medium hidden sm:inline" suppressHydrationWarning>
          {currentDate}
        </p>
      </div>

      {/* 우측 관리자 정보 및 알림 영역 */}
      <div className="flex items-center gap-4">
        {/* 알림 토글 (TODO: 알림 읽음 처리 및 실시간 연동 기능 추가 예정) */}
        <button className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-pink-500 ring-2 ring-white" />
        </button>

        <span className="h-5 w-px bg-slate-200" />

        {/* 관리자 프로필 정보 */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right hidden sm:flex">
            <span className="text-sm font-bold text-slate-800 leading-none">
              최고 관리자
            </span>
            <span className="text-[10px] text-purple-600 font-semibold block mt-0.5 uppercase tracking-wider">
              System Admin
            </span>
          </div>

          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-100 via-pink-100 to-yellow-100 border border-purple-200 flex items-center justify-center relative overflow-hidden shadow-sm">
            <ShieldAlert className="w-4 h-4 text-purple-600" />
            {/* 온라인 상태 뱃지 */}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
