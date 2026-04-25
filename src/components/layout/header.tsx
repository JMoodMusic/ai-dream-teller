import Link from "next/link";
import { Menu } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
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
          {/* TODO: 로그인 상태에 따라 분기 처리 및 마이페이지 등 추가 필요 */}
          <Link 
            href="/auth" 
            className={buttonVariants({ variant: "default", className: "rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-sm px-6" })}
          >
            로그인
          </Link>
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
                {/* TODO: 로그인 상태에 따라 분기 처리 및 마이페이지 등 추가 필요 */}
                <Link 
                  href="/auth" 
                  className={buttonVariants({ variant: "default", size: "lg", className: "w-full rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-sm text-base py-6" })}
                >
                  로그인
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

