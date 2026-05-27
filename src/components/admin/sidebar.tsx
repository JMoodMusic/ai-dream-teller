"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Home, 
  LogOut, 
  Sparkles 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { adminLogout } from "@/app/admin-login/actions";

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    name: "매출 대시보드",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "주문 내역 리스트",
    href: "/admin/order-list",
    icon: ShoppingBag,
  },
  {
    name: "유저 리스트",
    href: "/admin/user-list",
    icon: Users,
  },
];

// TODO: 추후 실제 어드민 계정 권한 정보가 들어오면 백엔드 API와 연동하여 로그아웃 및 프로필 정보 표시 처리 필요 (FIX: 세션 만료 예외 대응)
const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await adminLogout();
      alert("로그아웃 되었습니다.");
      router.push("/admin-login");
    } catch (error) {
      console.error("로그아웃 중 오류가 발생했습니다:", error);
    }
  };

  return (
    <aside className="w-64 shrink-0 bg-slate-900/90 border-r border-slate-800 text-slate-200 flex flex-col h-screen sticky top-0 backdrop-blur-md">
      {/* 어드민 서비스 헤더 */}
      <div className="h-16 flex items-center gap-3.5 px-6 border-b border-slate-800">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 via-pink-500 to-yellow-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
          <Sparkles className="w-4 h-4 text-white animate-pulse" />
        </div>
        <div>
          <h1 className="font-serif font-black text-sm tracking-tight text-white leading-none">
            Dream Teller
          </h1>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mt-0.5">
            Admin Console
          </span>
        </div>
      </div>

      {/* 네비게이션 메뉴 목록 */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {SIDEBAR_ITEMS.map((item) => {
          // 정확한 하위 경로 매칭을 위해 체크
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3.5 px-4 h-12 rounded-xl text-sm font-semibold tracking-tight transition-all duration-200 group relative",
                isActive 
                  ? "bg-gradient-to-r from-purple-600/30 to-pink-600/10 text-purple-400 border-l-4 border-purple-500 pl-3 bg-purple-950/20" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 transition-transform duration-200 group-hover:scale-105", 
                isActive ? "text-purple-400" : "text-slate-400 group-hover:text-slate-300"
              )} />
              {item.name}
              {isActive && (
                <span className="absolute right-4 w-1.5 h-1.5 rounded-full bg-purple-500 shadow-md shadow-purple-500/50" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* 하단 시스템 바로가기 및 로그아웃 */}
      <div className="p-4 border-t border-slate-800 space-y-1 bg-slate-950/20">
        <Link
          href="/"
          className="flex items-center gap-3.5 px-4 h-11 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors"
        >
          <Home className="w-4.5 h-4.5" />
          사용자 홈으로
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3.5 px-4 h-11 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-colors"
        >
          <LogOut className="w-4.5 h-4.5" />
          로그아웃
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
