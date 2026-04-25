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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold sm:inline-block text-xl">AI Dream Teller</span>
          </Link>
        </div>
        
        {/* 데스크탑 네비게이션 */}
        <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
          {/* TODO: 로그인 상태에 따라 분기 처리 필요 */}
          {/* 비회원용/로그아웃 상태 메뉴 */}
          <Link href="/guest-login" className="transition-colors hover:text-foreground/80 text-foreground/60">
            비회원 주문 조회
          </Link>
          <Link href="/auth" className="transition-colors hover:text-foreground/80 text-foreground/60">
            로그인
          </Link>
          {/* 회원용 메뉴 */}
          <Link href="/my-page" className="transition-colors hover:text-foreground/80 text-foreground/60">
            마이페이지
          </Link>
        </nav>

        {/* 모바일 햄버거 메뉴 */}
        <div className="flex md:hidden">
          <Sheet>
            <SheetTrigger className={buttonVariants({ variant: "ghost", size: "icon" })} aria-label="메뉴 열기">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="top">
              <SheetHeader>
                <SheetTitle className="text-left">메뉴</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-6 text-sm font-medium">
                {/* TODO: 로그인 상태에 따라 분기 처리 필요 */}
                <Link href="/guest-login" className="transition-colors hover:text-foreground/80 text-foreground/60">
                  비회원 주문 조회
                </Link>
                <Link href="/auth" className="transition-colors hover:text-foreground/80 text-foreground/60">
                  로그인
                </Link>
                <Link href="/my-page" className="transition-colors hover:text-foreground/80 text-foreground/60">
                  마이페이지
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

