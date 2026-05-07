"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white/60 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-sm p-8 sm:p-12">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-slate-500 hover:text-slate-900 -ml-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              홈으로 돌아가기
            </Button>
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-8 text-slate-900">이용 약관</h1>
        
        <div className="space-y-6 text-slate-600 leading-relaxed text-sm sm:text-base">
          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">제1조 (목적)</h2>
            <p>
              본 약관은 AI Dream Teller(이하 "회사")가 제공하는 꿈 해몽 및 관련 제반 서비스(이하 "서비스")의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">제2조 (서비스의 성격)</h2>
            <p>
              회사가 제공하는 꿈 해몽 결과는 인공지능 알고리즘과 통계적 데이터를 바탕으로 한 참고용 정보이며, 의학적, 심리학적 진단이나 전문적인 상담을 대체하지 않습니다. 회사는 서비스 이용으로 인해 발생하는 결과에 대해 법적 책임을 지지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">제3조 (이용계약 체결)</h2>
            <p>
              ① 이용계약은 회원이 되고자 하는 자(이하 "가입신청자")가 약관의 내용에 대하여 동의를 한 다음 회원가입신청을 하고 회사가 이러한 신청에 대하여 승낙함으로써 체결됩니다.
              <br />
              ② 비회원의 경우, 서비스를 결제하고 이용하는 순간 본 약관에 동의한 것으로 간주합니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">제4조 (환불 정책)</h2>
            <p>
              ① 제공되는 서비스는 디지털 콘텐츠(AI 해몽 결과)의 특성상 결제가 완료되고 결과가 생성된 이후에는 단순 변심으로 인한 환불이 불가합니다.
              <br />
              ② 단, 시스템 오류로 인해 결과가 제공되지 않았거나 치명적인 오류가 발생한 경우 고객센터를 통해 100% 환불을 요청할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">제5조 (면책 조항)</h2>
            <p>
              회사는 천재지변, 디도스(DDoS) 공격, 서버 호스팅 업체의 장애 등 불가항력적인 사유로 서비스를 제공할 수 없는 경우 서비스 제공에 관한 책임이 면제됩니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
