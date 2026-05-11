"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
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
        
        <h1 className="text-3xl font-bold mb-8 text-slate-900">개인정보처리방침</h1>
        
        <div className="space-y-6 text-slate-600 leading-relaxed text-sm sm:text-base">
          <section>
            <p>
              AI Dream Teller (이하 &quot;회사&quot;)는 사용자의 개인정보를 중요하게 생각하며, &quot;정보통신망 이용촉진 및 정보보호 등에 관한 법률&quot; 및 &quot;개인정보보호법&quot;을 준수하고 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">1. 수집하는 개인정보 항목</h2>
            <p>
              회사는 회원가입, 고객상담, 서비스 신청 등을 위해 아래와 같은 개인정보를 수집하고 있습니다.
              <br />
              - 회원: 이메일, 닉네임, 프로필 이미지 (소셜 로그인 제공 정보)
              <br />
              - 비회원: 전화번호, 비밀번호
              <br />
              - 서비스 이용 기록: 꿈 입력 내용, 접속 로그, 쿠키, 결제 기록
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">2. 개인정보의 수집 및 이용 목적</h2>
            <p>
              수집된 개인정보는 다음의 목적을 위해 활용됩니다.
              <br />
              - 서비스 제공: AI 꿈 해몽 결과 생성, 콘텐츠 제공, 구매 및 요금 결제
              <br />
              - 회원 관리: 본인 확인, 개인 식별, 불량 회원의 부정 이용 방지
              <br />
              - 서비스 개선: 신규 서비스 개발 및 맞춤형 서비스 제공
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">3. 개인정보의 보유 및 이용 기간</h2>
            <p>
              회사는 원칙적으로 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 아래와 같이 일정한 기간 동안 회원정보를 보관합니다.
              <br />
              - 계약 또는 청약철회 등에 관한 기록: 5년
              <br />
              - 대금결제 및 재화 등의 공급에 관한 기록: 5년
              <br />
              - 소비자의 불만 또는 분쟁처리에 관한 기록: 3년
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">4. 꿈 데이터의 익명화 및 활용</h2>
            <p>
              사용자가 입력한 꿈의 내용은 AI 모델의 학습 및 서비스 품질 개선을 위해 익명화 처리되어 활용될 수 있습니다. 이 과정에서 사용자를 특정할 수 있는 모든 개인 식별 정보는 철저히 배제됩니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
