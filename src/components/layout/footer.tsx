import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 sm:px-8 md:flex-row md:items-start">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2026 AI Dream Teller. All rights reserved.
          </p>
          <div className="text-xs text-muted-foreground/80 text-center md:text-left flex flex-col gap-1">
            <p>상호: (주)에이아이드림텔러 | 대표: 홍길동 | 사업자등록번호: 123-45-67890</p>
            <p>통신판매업 신고번호: 2026-서울강남-0000 | 이메일: support@aidreamteller.com</p>
          </div>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-4 text-sm font-medium text-muted-foreground pt-2">
          <Link href="/terms" className="hover:underline underline-offset-4">이용약관</Link>
          <Link href="/privacy" className="hover:underline underline-offset-4">개인정보처리방침</Link>
          <Link href="mailto:support@aidreamteller.com" className="hover:underline underline-offset-4">문의하기</Link>
        </div>
      </div>
    </footer>
  );
}
