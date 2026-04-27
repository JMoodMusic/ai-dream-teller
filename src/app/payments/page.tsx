"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { loadTossPayments, TossPaymentsWidgets } from "@tosspayments/tosspayments-sdk";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Receipt, Scissors } from "lucide-react";

// 토스페이먼츠 테스트용 클라이언트 키
const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";

function PaymentsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const amountParam = searchParams.get("amount");
  const amount = amountParam ? parseInt(amountParam, 10) : 1500;

  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [customerKey] = useState(() => "customer_" + Math.random().toString(36).substring(2, 10));
  const [orderId] = useState(() => "dream_test_" + Math.random().toString(36).substring(2, 10));
  
  const today = new Date();
  const formattedDate = `${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}.`;

  useEffect(() => {
    async function fetchPaymentWidget() {
      try {
        const tossPayments = await loadTossPayments(clientKey);
        const widgets = tossPayments.widgets({ customerKey });
        setWidgets(widgets);
      } catch (error) {
        console.error("토스페이먼츠 위젯 로딩 실패:", error);
      }
    }
    fetchPaymentWidget();
  }, [customerKey]);

  useEffect(() => {
    async function renderPaymentWidgets() {
      if (!widgets) return;
      try {
        await widgets.setAmount({ currency: "KRW", value: amount });
        await Promise.all([
          widgets.renderPaymentMethods({
            selector: "#payment-method",
            variantKey: "DEFAULT",
          }),
          widgets.renderAgreement({
            selector: "#agreement",
            variantKey: "AGREEMENT",
          }),
        ]);
        
        setIsReady(true);
      } catch (error: any) {
        // React 18 StrictMode 렌더링 두번 실행으로 인한 '취소되었습니다' 에러 무시
        if (error.name === "UserCancelError" || error.message?.includes("취소")) {
          return;
        }
        console.error("위젯 렌더링 중 오류:", error);
      }
    }
    renderPaymentWidgets();
  }, [widgets, amount]);

  const handlePayment = async () => {
    try {
      if (!widgets) return;
      await widgets.requestPayment({
        orderId: orderId,
        orderName: amount > 1500 ? "AI 꿈 해몽 서비스 (이미지 포함)" : "AI 꿈 해몽 서비스",
        customerName: "테스트유저",
        customerEmail: "test@example.com",
        successUrl: window.location.origin + "/payments/success",
        failUrl: window.location.origin + "/payments/fail",
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-5xl flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold">AI</span>
          Dream Teller
        </h1>
        <div className="text-sm font-medium text-slate-500 hidden sm:block">비회원 주문조회</div>
      </div>

      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-6 items-start">
        {/* Left: 영수증 UI */}
        <div className="w-full md:w-[400px] flex-shrink-0 flex flex-col gap-4">
          <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 relative overflow-hidden pb-8">
            {/* 상단 장식용 원형 아이콘 */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Receipt className="w-5 h-5 text-purple-600 mt-4" />
            </div>
            
            <div className="pt-10 px-8">
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-slate-800 mb-1">주문 접수증</h2>
                <p className="text-sm text-slate-400 font-medium">{formattedDate}</p>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-medium text-slate-500">주문 번호</span>
                <span className="text-xs font-mono font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">{orderId}</span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">전문 심층 해몽 (기본)</span>
                  <span className="text-sm font-semibold text-slate-800">1,500원</span>
                </div>
                {amount > 1500 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700">AI 꿈 시각화 이미지 추가</span>
                    <span className="text-sm font-semibold text-slate-800">{(amount - 1500).toLocaleString()}원</span>
                  </div>
                )}
              </div>

              <div className="border-t border-dashed border-slate-200 pt-6 flex justify-between items-center">
                <span className="text-base font-bold text-slate-800">최종 결제 금액</span>
                <span className="text-2xl font-bold text-purple-600">{amount.toLocaleString()}원</span>
              </div>
            </div>

            {/* 절취선 디자인 */}
            <div className="absolute bottom-16 left-0 right-0 flex items-center px-4 overflow-hidden opacity-50">
              <Scissors className="w-4 h-4 text-slate-400 flex-shrink-0 -ml-1 mr-2" />
              <div className="flex-grow border-t-2 border-dashed border-slate-300"></div>
            </div>
          </div>
          
          <button 
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            선택 내역 수정하러 돌아가기
          </button>
        </div>

        {/* Right: 결제 위젯 */}
        <div className="w-full md:flex-grow bg-white rounded-[24px] shadow-sm border border-slate-100 p-8 min-h-[500px] relative">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800 mb-1">결제 수단 선택</h2>
            <p className="text-sm text-slate-500">안전하고 간편하게 결제를 진행하세요.</p>
          </div>

          {!isReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-[24px] z-10">
              <div className="animate-pulse flex flex-col items-center">
                <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-sm text-purple-600 font-medium">결제 모듈을 불러오는 중...</p>
              </div>
            </div>
          )}
          
          <div id="payment-method" className="w-full mb-2" />
          <div id="agreement" className="w-full mb-6" />

          <Button
            className="w-full h-14 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg border-0 shadow-sm transition-all"
            onClick={handlePayment}
            disabled={!isReady}
          >
            {amount.toLocaleString()}원 결제하기
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">로딩중...</div>}>
      <PaymentsContent />
    </Suspense>
  );
}
