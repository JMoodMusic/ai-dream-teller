import Link from "next/link";
import { Menu, User } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { createClient } from "@/lib/supabase/server";

/**
 * 전역 헤더 컴포넌트
 * - 서비스 로고 + 로그인 상태에 따른 네비게이션 분기
 * - 비회원: 로그인 버튼
 * - 회원: 마이페이지 버튼
 * - 모바일 반응형: 햄버거 메뉴 → Drawer Sheet
 */
export async function Header() {
  // 서버에서 유저 인증 상태 확인
  let isAuthenticated = false;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    isAuthenticated = !!user;
  } catch {
    // Supabase 미연동 상태에서는 비인증으로 처리
    isAuthenticated = false;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-[#FDFBF7]/95 backdrop-blur supports-[backdrop-filter]:bg-[#FDFBF7]/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-serif italic font-extrabold sm:inline-block text-2xl tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 drop-shadow-sm">
              AI Dream Teller
            </span>
          </Link>
        </div>
        
        {/* 데스크탑 네비게이션 */}
        <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
          {isAuthenticated ? (
            <Link 
              href="/my-page" 
              className={buttonVariants({ variant: "default", className: "rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white shadow-md hover:shadow-lg transition-all border-0 px-6 font-medium gap-2" })}
            >
              <User className="w-4 h-4" />
              마이페이지
            </Link>
          ) : (
            <>
              <Link 
                href="/guest-login" 
                className="text-slate-500 hover:text-purple-600 transition-colors font-medium mr-1"
              >
                비회원 주문조회
              </Link>
              <Link 
                href="/auth" 
                className={buttonVariants({ variant: "default", className: "rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white shadow-md hover:shadow-lg transition-all border-0 px-6 font-medium" })}
              >
                로그인
              </Link>
            </>
          )}
        </nav>

        {/* 모바일 햄버거 메뉴 */}
        <div className="flex md:hidden">
          <Sheet>
            <SheetTrigger className={buttonVariants({ variant: "ghost", size: "icon" })} aria-label="메뉴 열기">
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="top" className="rounded-b-3xl border-b-slate-200 bg-[#FDFBF7]/95 backdrop-blur-md">
              <SheetHeader className="pb-4 border-b border-slate-100">
                <SheetTitle className="text-center font-serif italic font-extrabold text-2xl tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500">
                  AI Dream Teller
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8 px-4 pb-8 text-center">
                {isAuthenticated ? (
                  <Link 
                    href="/my-page" 
                    className={buttonVariants({ variant: "default", size: "lg", className: "w-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white shadow-md text-base py-6 border-0 font-medium gap-2" })}
                  >
                    <User className="w-5 h-5" />
                    마이페이지
                  </Link>
                ) : (
                  <>
                    <Link 
                      href="/guest-login" 
                      className={buttonVariants({ variant: "outline", size: "lg", className: "w-full rounded-full text-base py-6 font-medium text-slate-600 border-slate-200" })}
                    >
                      비회원 주문조회
                    </Link>
                    <Link 
                      href="/auth" 
                      className={buttonVariants({ variant: "default", size: "lg", className: "w-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white shadow-md text-base py-6 border-0 font-medium" })}
                    >
                      로그인
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
