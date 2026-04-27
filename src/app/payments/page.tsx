"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { loadTossPayments, TossPaymentsWidgets } from "@tosspayments/tosspayments-sdk";
import { Button } from "@/components/ui/button";

// 토스페이먼츠 테스트용 클라이언트 키
const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
// 고객을 고유하게 식별할 수 있는 키 (데모를 위해 임의 생성)
const customerKey = "customer_" + Math.random().toString(36).substring(2, 10);

function PaymentsContent() {
  const searchParams = useSearchParams();
  const amountParam = searchParams.get("amount");
  const amount = amountParam ? parseInt(amountParam, 10) : 1500;

  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function fetchPaymentWidget() {
      try {
        const tossPayments = await loadTossPayments(clientKey);
        // 결제위젯 인스턴스 생성
        const widgets = tossPayments.widgets({ customerKey });
        setWidgets(widgets);
      } catch (error) {
        console.error("토스페이먼츠 위젯 로딩 실패:", error);
      }
    }
    fetchPaymentWidget();
  }, []);

  useEffect(() => {
    async function renderPaymentWidgets() {
      if (!widgets) return;
      try {
        // 결제 금액 설정
        await widgets.setAmount({ currency: "KRW", value: amount });

        // 결제수단 및 약관 위젯 렌더링
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
      } catch (error) {
        console.error("위젯 렌더링 중 오류:", error);
      }
    }
    renderPaymentWidgets();
  }, [widgets]);

  const handlePayment = async () => {
    try {
      if (!widgets) return;
      await widgets.requestPayment({
        orderId: `order_${Math.random().toString(36).substring(2, 10)}`,
        orderName: amount === 2000 ? "AI 꿈 해몽 서비스 (이미지 포함)" : "AI 꿈 해몽 서비스",
        customerName: "테스트유저",
        customerEmail: "test@example.com",
        successUrl: window.location.origin + "/payments/success",
        failUrl: window.location.origin + "/payments/fail",
      });
    } catch (err) {
      // 에러 처리 (사용자 취소 등)
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center py-16 px-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif font-bold text-slate-800 mb-3">결제 및 완료</h1>
          <p className="text-slate-500">마지막으로 결제를 진행하시면 꿈 해몽 결과가 제공됩니다.</p>
        </div>

        <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 mb-8 relative">
          {!isReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm rounded-3xl z-10">
              <div className="animate-pulse flex flex-col items-center">
                <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-sm text-purple-600 font-medium">결제 모듈을 불러오는 중...</p>
              </div>
            </div>
          )}
          
          <div id="payment-method" className="w-full min-h-[300px]" />
          <div id="agreement" className="w-full mt-4" />

          <div className="mt-8">
            <Button
              className="w-full h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-bold text-lg border-0 shadow-md hover:shadow-lg transition-all"
              onClick={handlePayment}
              disabled={!isReady}
            >
              {amount.toLocaleString()}원 결제하기
            </Button>
          </div>
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
