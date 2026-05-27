import React from "react";
import AdminSidebar from "@/components/admin/sidebar";
import AdminHeader from "@/components/admin/header";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = async ({ children }: AdminLayoutProps) => {
  let shouldRedirect = false;

  // 어드민 세션 쿠키 검증 가동 (try-catch 내부에서는 체크만 진행)
  try {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get("admin_session")?.value;

    if (adminSession !== "true") {
      shouldRedirect = true;
    }
  } catch (error) {
    console.error("Admin Layout Auth Guard Error:", error);
    shouldRedirect = true;
  }

  // NEXT_REDIRECT 자바스크립트 예외가 catch에 걸리지 않도록 try-catch 외부 안전지대에서 실행
  if (shouldRedirect) {
    return redirect("/admin-login");
  }



  return (

    <div className="flex w-full h-screen overflow-hidden bg-[#FDFBF7] text-slate-800 font-sans">
      {/* 1. 좌측 공통 네비게이션 사이드바 */}
      <AdminSidebar />

      {/* 2. 우측 메인 영역 (헤더 + 본문 바디) */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* 장식용 은은한 오로라 배경 (프리미엄 무드 연출) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-200/10 blur-[100px] mix-blend-multiply" />
          <div className="absolute bottom-[10%] left-[-10%] w-[35%] h-[35%] rounded-full bg-pink-300/10 blur-[100px] mix-blend-multiply" />
        </div>

        {/* 상단 공통 헤더 */}
        <AdminHeader />

        {/* 하위 페이지 렌더링 본문 (스크롤 독립 제어) */}
        <main className="flex-1 overflow-y-auto p-8 relative z-10">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
